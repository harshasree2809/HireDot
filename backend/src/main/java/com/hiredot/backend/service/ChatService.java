package com.hiredot.backend.service;

import com.hiredot.backend.model.ChatMessage;
import com.hiredot.backend.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final GeminiService geminiService;

    public ChatMessage sendMessage(String userId, String userMessage) {
        // Save user message
        ChatMessage userMsg = ChatMessage.builder()
                .userId(userId)
                .role("user")
                .content(userMessage)
                .build();
        chatMessageRepository.save(userMsg);

        // Build context-aware prompt
        List<ChatMessage> history = chatMessageRepository.findByUserIdOrderByTimestampAsc(userId);
        StringBuilder contextBuilder = new StringBuilder();
        contextBuilder.append("You are HireDot AI Career Coach - an expert career advisor specializing in:");
        contextBuilder.append(" resume writing, interview preparation, job search strategy, salary negotiation, and professional development.");
        contextBuilder.append(" Be helpful, encouraging, specific, and professional. Keep responses concise but impactful.\n\n");
        contextBuilder.append("Conversation history:\n");
        int start = Math.max(0, history.size() - 10);
        for (int i = start; i < history.size() - 1; i++) {
            ChatMessage msg = history.get(i);
            contextBuilder.append(msg.getRole()).append(": ").append(msg.getContent()).append("\n");
        }
        contextBuilder.append("user: ").append(userMessage);

        String aiResponse = geminiService.generateContent(contextBuilder.toString());

        // Save AI response
        ChatMessage aiMsg = ChatMessage.builder()
                .userId(userId)
                .role("assistant")
                .content(aiResponse)
                .build();
        return chatMessageRepository.save(aiMsg);
    }

    public List<ChatMessage> getHistory(String userId) {
        return chatMessageRepository.findByUserIdOrderByTimestampAsc(userId);
    }

    public void clearHistory(String userId) {
        chatMessageRepository.deleteByUserId(userId);
    }
}
