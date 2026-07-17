package com.hiredot.backend.controller;

import com.hiredot.backend.dto.request.ChatRequest;
import com.hiredot.backend.model.ChatMessage;
import com.hiredot.backend.model.User;
import com.hiredot.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<ChatMessage> sendMessage(
            @AuthenticationPrincipal User user,
            @RequestBody ChatRequest request) {
        return ResponseEntity.ok(chatService.sendMessage(user.getId(), request.getMessage()));
    }

    @GetMapping("/history")
    public ResponseEntity<List<ChatMessage>> getHistory(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(chatService.getHistory(user.getId()));
    }

    @DeleteMapping("/history")
    public ResponseEntity<Void> clearHistory(@AuthenticationPrincipal User user) {
        chatService.clearHistory(user.getId());
        return ResponseEntity.noContent().build();
    }
}
