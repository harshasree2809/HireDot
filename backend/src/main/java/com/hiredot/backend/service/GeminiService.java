package com.hiredot.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.ContentType;
import org.apache.hc.core5.http.io.entity.StringEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    // Always use gemini-2.5-flash — gemini-1.5-flash is permanently shut down by Google.
    // Do NOT read model from env: Render still had GEMINI_MODEL=gemini-1.5-flash set.
    private static final String MODEL = "gemini-2.5-flash";

    private static final String API_BASE =
        "https://generativelanguage.googleapis.com/v1beta/models/";

    private final ObjectMapper objectMapper = new ObjectMapper();

    /** Exposed for /api/health so we can verify the live deploy. */
    public String getModelName() {
        return MODEL;
    }

    public String generateContent(String prompt) {
        if (apiKey == null || apiKey.isBlank() || apiKey.startsWith("your-gemini") || apiKey.startsWith("your_gemini")) {
            throw new RuntimeException("GEMINI_API_KEY is missing. Add your Google AI Studio key to the backend environment.");
        }

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            String url = API_BASE + MODEL + ":generateContent?key=" + apiKey.trim();
            HttpPost request = new HttpPost(url);
            request.setHeader("Content-Type", "application/json");
            log.info("Calling Gemini model: {}", MODEL);

            ObjectNode root = objectMapper.createObjectNode();
            ObjectNode content = root.putArray("contents").addObject();
            content.putArray("parts").addObject().put("text", prompt);
            ObjectNode generationConfig = root.putObject("generationConfig");
            generationConfig.put("responseMimeType", "application/json");

            String body = objectMapper.writeValueAsString(root);
            request.setEntity(new StringEntity(body, ContentType.APPLICATION_JSON));

            return httpClient.execute(request, response -> {
                String responseBody = new String(response.getEntity().getContent().readAllBytes());
                int statusCode = response.getCode();
                log.debug("Gemini response status: {}, body: {}", statusCode, responseBody);

                try {
                    JsonNode jsonNode = objectMapper.readTree(responseBody);

                    // Check for Gemini API errors (invalid key, quota exceeded, etc.)
                    if (jsonNode.has("error")) {
                        String errorMsg = jsonNode.path("error").path("message").asText();
                        int errorCode = jsonNode.path("error").path("code").asInt();
                        log.error("Gemini API Error {}: {}", errorCode, errorMsg);

                        if (errorCode == 429) {
                            throw new RuntimeException("AI quota exceeded. You have hit the free daily limit (1500 requests). Please try again tomorrow.");
                        } else if (errorCode == 400 || errorCode == 401 || errorCode == 403) {
                            if (errorMsg != null && errorMsg.toLowerCase().contains("not found") && errorMsg.toLowerCase().contains("model")) {
                                throw new RuntimeException("Gemini model not found. Set GEMINI_MODEL=gemini-2.5-flash on Render (gemini-1.5-flash is shut down).");
                            }
                            throw new RuntimeException("Invalid Gemini API Key. Please check GEMINI_API_KEY on Render.");
                        }
                        throw new RuntimeException("Gemini API Error: " + errorMsg);
                    }

                    JsonNode candidates = jsonNode.path("candidates");
                    if (!candidates.isArray() || candidates.isEmpty()) {
                        String blockReason = jsonNode.path("promptFeedback").path("blockReason").asText("");
                        if (!blockReason.isBlank()) {
                            throw new RuntimeException("AI blocked this request (" + blockReason + "). Please rephrase your input.");
                        }
                        log.error("Gemini returned no candidates: {}", responseBody);
                        throw new RuntimeException("AI returned an empty response. Please try again.");
                    }

                    JsonNode first = candidates.get(0);
                    String finishReason = first.path("finishReason").asText("");
                    if ("SAFETY".equalsIgnoreCase(finishReason) || "BLOCKLIST".equalsIgnoreCase(finishReason)) {
                        throw new RuntimeException("AI blocked this request due to content policy. Please rephrase your input.");
                    }

                    JsonNode parts = first.path("content").path("parts");
                    if (!parts.isArray() || parts.isEmpty()) {
                        log.error("Gemini candidate had no parts: {}", responseBody);
                        throw new RuntimeException("AI returned an empty response. Please try again.");
                    }

                    String rawText = parts.get(0).path("text").asText(null);
                    String cleaned = cleanJson(rawText);

                    // Validate we actually have usable JSON content
                    if (cleaned == null || cleaned.isBlank() || "{}".equals(cleaned) || "null".equals(cleaned)) {
                        log.error("Gemini text was empty after clean. Raw response: {}", responseBody);
                        throw new RuntimeException("AI returned an empty response. Please try again.");
                    }

                    // Ensure it parses as JSON (object or array)
                    JsonNode parsed = objectMapper.readTree(cleaned);
                    if (parsed == null || parsed.isNull() || (parsed.isObject() && parsed.isEmpty())) {
                        throw new RuntimeException("AI returned an empty response. Please try again.");
                    }

                    return cleaned;

                } catch (RuntimeException e) {
                    throw e;
                } catch (Exception e) {
                    log.error("Error parsing Gemini response: {}", responseBody, e);
                    throw new RuntimeException("Could not parse AI response. Please try again.");
                }
            });
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error calling Gemini API", e);
            throw new RuntimeException("AI service is temporarily unavailable. Please try again later.");
        }
    }

    private String cleanJson(String raw) {
        if (raw == null) return null;
        String trimmed = raw.trim();
        if (trimmed.isEmpty()) return null;

        if (trimmed.startsWith("```")) {
            int firstNewline = trimmed.indexOf('\n');
            if (firstNewline != -1) {
                trimmed = trimmed.substring(firstNewline + 1);
            }
            if (trimmed.endsWith("```")) {
                trimmed = trimmed.substring(0, trimmed.lastIndexOf("```")).trim();
            }
        }

        // If model wrapped JSON in quotes / double-encoded, unwrap once
        if (trimmed.startsWith("\"") && trimmed.endsWith("\"")) {
            try {
                String unquoted = objectMapper.readValue(trimmed, String.class);
                if (unquoted != null && (unquoted.trim().startsWith("{") || unquoted.trim().startsWith("["))) {
                    trimmed = unquoted.trim();
                }
            } catch (Exception ignored) {
                // keep original trimmed text
            }
        }

        return trimmed;
    }
}
