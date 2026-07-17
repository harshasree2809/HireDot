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

    @Value("${openrouter.api.key}")
    private String apiKey;

    @Value("${openrouter.api.url}")
    private String apiUrl;

    @Value("${openrouter.model}")
    private String model;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public String generateContent(String prompt) {
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpPost request = new HttpPost(apiUrl);
            request.setHeader("Content-Type", "application/json");
            request.setHeader("Authorization", "Bearer " + apiKey);
            request.setHeader("HTTP-Referer", "https://hiredot.vercel.app");
            request.setHeader("X-Title", "HireDot");

            String body = "{" +
                    "\"model\":\"" + model + "\"," +
                    "\"max_tokens\":4096," +
                    "\"messages\":[{\"role\":\"user\",\"content\":\"" + escapeJson(prompt) + "\"}]" +
                    "}";
            request.setEntity(new StringEntity(body, ContentType.APPLICATION_JSON));

            return httpClient.execute(request, response -> {
                String responseBody = new String(response.getEntity().getContent().readAllBytes());
                log.debug("OpenRouter response: {}", responseBody);
                try {
                    JsonNode jsonNode = objectMapper.readTree(responseBody);
                    
                    // Check if OpenRouter returned an error (e.g. invalid API key, out of credits)
                    if (jsonNode.has("error")) {
                        String errorMsg = jsonNode.path("error").path("message").asText();
                        log.error("OpenRouter API Error: {}", errorMsg);
                        throw new RuntimeException("AI Model Error: " + errorMsg);
                    }
                    
                    return jsonNode.path("choices").get(0)
                            .path("message").path("content").asText();
                } catch (RuntimeException e) {
                    throw e; // Rethrow the AI Model Error so it reaches the frontend
                } catch (Exception e) {
                    log.error("Error parsing OpenRouter response: {}", responseBody, e);
                    throw new RuntimeException("I'm having trouble processing your request. Please try again.");
                }
            });
        } catch (RuntimeException e) {
            throw e; // Rethrow so it bubbles up
        } catch (Exception e) {
            log.error("Error calling OpenRouter API", e);
            throw new RuntimeException("AI service is temporarily unavailable. Please try again later.");
        }
    }

    private String escapeJson(String text) {
        return text.replace("\\", "\\\\").replace("\"", "\\\"")
                .replace("\n", "\\n").replace("\r", "\\r").replace("\t", "\\t");
    }
}
