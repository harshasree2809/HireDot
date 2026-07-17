package com.hiredot.backend.controller;

import com.hiredot.backend.dto.request.AtsRequest;
import com.hiredot.backend.service.AtsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ats")
@RequiredArgsConstructor
public class AtsController {

    private final AtsService atsService;

    @PostMapping("/analyze")
    public ResponseEntity<Map<String, Object>> analyzeAts(@RequestBody AtsRequest request) {
        String result = atsService.analyzeAts(request.getResumeText(), request.getJobDescription());
        return ResponseEntity.ok(Map.of("result", result));
    }
}
