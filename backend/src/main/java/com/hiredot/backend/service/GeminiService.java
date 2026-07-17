package com.hiredot.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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

    // Model: gemini-2.5-flash — FREE, 1500 requests/day, no credit card needed
    private static final String API_URL =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    private final ObjectMapper objectMapper = new ObjectMapper();

    public String generateContent(String prompt) {
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            String url = API_URL + "?key=" + apiKey;
            HttpPost request = new HttpPost(url);
            request.setHeader("Content-Type", "application/json");

            String body = "{" +
                    "\"contents\":[{\"parts\":[{\"text\":\"" + escapeJson(prompt) + "\"}]}]," +
                    "\"generationConfig\": {\"responseMimeType\": \"application/json\"}" +
                    "}";
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
                            throw new RuntimeException("Invalid Gemini API Key. Please check GEMINI_API_KEY on Render.");
                        }
                        throw new RuntimeException("Gemini API Error: " + errorMsg);
                    }

                    String rawText = jsonNode.path("candidates").get(0)
                            .path("content").path("parts").get(0)
                            .path("text").asText();
                    return cleanJson(rawText);

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

    private String escapeJson(String text) {
        return text.replace("\\", "\\\\").replace("\"", "\\\"")
                .replace("\n", "\\n").replace("\r", "\\r").replace("\t", "\\t");
    }

    private String cleanJson(String raw) {
        if (raw == null) return "{}";
        String trimmed = raw.trim();
        if (trimmed.startsWith("```")) {
            int firstNewline = trimmed.indexOf('\n');
            if (firstNewline != -1) {
                trimmed = trimmed.substring(firstNewline + 1);
            }
            if (trimmed.endsWith("```")) {
                trimmed = trimmed.substring(0, trimmed.lastIndexOf("```")).trim();
            }
        }
        return trimmed;
    }
}
