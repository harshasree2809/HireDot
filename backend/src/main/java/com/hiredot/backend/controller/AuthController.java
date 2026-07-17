package com.hiredot.backend.controller;

import com.hiredot.backend.dto.request.LoginRequest;
import com.hiredot.backend.dto.request.RegisterRequest;
import com.hiredot.backend.dto.response.AuthResponse;
import com.hiredot.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /** Public status check — no AI dependency so it always works after deploy. */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> status() {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", "ok");
        body.put("service", "hiredot-backend");
        body.put("aiModel", "Groq llama-3.3-70b-versatile");
        body.put("build", "2026-07-18-flash-latest-v3");
        return ResponseEntity.ok(body);
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
