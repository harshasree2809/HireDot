package com.hiredot.backend.controller;

import com.hiredot.backend.dto.request.LoginRequest;
import com.hiredot.backend.dto.request.RegisterRequest;
import com.hiredot.backend.dto.response.AuthResponse;
import com.hiredot.backend.service.AuthService;
import com.hiredot.backend.service.GeminiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final GeminiService geminiService;

    /** Public status check (works even before /api/health is deployed). */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> status() {
        return ResponseEntity.ok(Map.of(
                "status", "ok",
                "service", "hiredot-backend",
                "geminiModel", geminiService.getModelName(),
                "build", "2026-07-18-flash-latest"
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
