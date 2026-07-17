package com.hiredot.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
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
public class GroqService {

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.model:llama-3.3-70b-versatile}")
    private String modelName;

    private static final String API_URL = "https://api.groq.com/openai/v1/chat/completions";

    private final ObjectMapper objectMapper = new ObjectMapper();

    public String getModelName() {
        return modelName;
    }

    public String generateContent(String prompt) {
        return generateContent(prompt, true);
    }

    public String generateText(String prompt) {
        return generateContent(prompt, false);
    }

    public String generateContent(String prompt, boolean jsonMode) {
        if (apiKey == null || apiKey.isBlank() || apiKey.startsWith("your")) {
            throw new RuntimeException("GROQ_API_KEY is missing. Add your Groq API key to the backend environment.");
        }

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpPost request = new HttpPost(API_URL);
            request.setHeader("Authorization", "Bearer " + apiKey.trim());
            request.setHeader("Content-Type", "application/json");

            log.info("Calling Groq model: {} (jsonMode={})", modelName, jsonMode);

            ObjectNode root = objectMapper.createObjectNode();
            root.put("model", modelName);
            
            ArrayNode messages = root.putArray("messages");
            ObjectNode message = messages.addObject();
            message.put("role", "user");
            
            // If jsonMode is required by Groq, prompt must explicitly mention JSON
            if (jsonMode) {
                message.put("content", prompt + "\n\nIMPORTANT: Return ONLY valid JSON.");
                ObjectNode format = root.putObject("response_format");
                format.put("type", "json_object");
            } else {
                message.put("content", prompt);
            }

            String body = objectMapper.writeValueAsString(root);
            request.setEntity(new StringEntity(body, ContentType.APPLICATION_JSON));

            return httpClient.execute(request, response -> {
                String responseBody = new String(response.getEntity().getContent().readAllBytes());
                int statusCode = response.getCode();
                log.debug("Groq response status: {}, body: {}", statusCode, responseBody);

                try {
                    JsonNode jsonNode = objectMapper.readTree(responseBody);

                    if (jsonNode.has("error")) {
                        String errorMsg = jsonNode.path("error").path("message").asText();
                        int errorCode = statusCode; 
                        log.error("Groq API Error {}: {}", errorCode, errorMsg);

                        if (errorCode == 429) {
                            throw new RuntimeException("Groq API rate limit exceeded. Please wait a moment and try again.");
                        } else if (errorCode == 401 || errorCode == 403) {
                            throw new RuntimeException("Invalid Groq API Key. Please check GROQ_API_KEY on Render.");
                        }
                        throw new RuntimeException("Groq API Error: " + errorMsg);
                    }

                    JsonNode choices = jsonNode.path("choices");
                    if (!choices.isArray() || choices.isEmpty()) {
                        log.error("Groq returned no choices: {}", responseBody);
                        throw new RuntimeException("AI returned an empty response. Please try again.");
                    }

                    String rawText = choices.get(0).path("message").path("content").asText();

                    if (!jsonMode) {
                        if (rawText == null || rawText.isBlank()) {
                            throw new RuntimeException("AI returned an empty response. Please try again.");
                        }
                        return rawText.trim();
                    }

                    String cleaned = cleanJson(rawText);

                    if (cleaned == null || cleaned.isBlank() || "{}".equals(cleaned) || "null".equals(cleaned)) {
                        log.error("Groq text was empty after clean. Raw response: {}", responseBody);
                        throw new RuntimeException("AI returned an empty response. Please try again.");
                    }

                    JsonNode parsed = objectMapper.readTree(cleaned);
                    if (parsed == null || parsed.isNull() || (parsed.isObject() && parsed.isEmpty())) {
                        throw new RuntimeException("AI returned an empty response. Please try again.");
                    }

                    return cleaned;

                } catch (RuntimeException e) {
                    throw e;
                } catch (Exception e) {
                    log.error("Error parsing Groq response: {}", responseBody, e);
                    throw new RuntimeException("Could not parse AI response. Please try again.");
                }
            });
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error calling Groq API", e);
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

        if (trimmed.startsWith("\"") && trimmed.endsWith("\"")) {
            try {
                String unquoted = objectMapper.readValue(trimmed, String.class);
                if (unquoted != null && (unquoted.trim().startsWith("{") || unquoted.trim().startsWith("["))) {
                    trimmed = unquoted.trim();
                }
            } catch (Exception ignored) {}
        }
        return trimmed;
    }
}
