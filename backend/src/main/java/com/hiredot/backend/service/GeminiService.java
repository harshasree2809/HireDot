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

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public String generateContent(String prompt) {
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            String url = apiUrl + "?key=" + apiKey;
            HttpPost request = new HttpPost(url);
            request.setHeader("Content-Type", "application/json");

            String body = "{\"contents\":[{\"parts\":[{\"text\":\"" + escapeJson(prompt) + "\"}]}]}";
            request.setEntity(new StringEntity(body, ContentType.APPLICATION_JSON));

            return httpClient.execute(request, response -> {
                String responseBody = new String(response.getEntity().getContent().readAllBytes());
                log.debug("Gemini response: {}", responseBody);
                try {
                    JsonNode jsonNode = objectMapper.readTree(responseBody);
                    return jsonNode.path("candidates").get(0)
                            .path("content").path("parts").get(0)
                            .path("text").asText();
                } catch (Exception e) {
                    log.error("Error parsing Gemini response", e);
                    return "I'm having trouble processing your request. Please try again.";
                }
            });
        } catch (Exception e) {
            log.error("Error calling Gemini API", e);
            return "AI service is temporarily unavailable. Please try again later.";
        }
    }

    private String escapeJson(String text) {
        return text.replace("\\", "\\\\").replace("\"", "\\\"")
                .replace("\n", "\\n").replace("\r", "\\r").replace("\t", "\\t");
    }
}
