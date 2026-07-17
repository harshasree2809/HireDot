package com.hiredot.backend.controller;

import com.hiredot.backend.dto.request.JobMatchRequest;
import com.hiredot.backend.service.JobMatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobMatchService jobMatchService;

    @PostMapping("/analyze")
    public ResponseEntity<Map<String, Object>> analyzeJob(@RequestBody Map<String, String> request) {
        String result = jobMatchService.analyzeJobDescription(request.get("jobDescription"));
        return ResponseEntity.ok(Map.of("result", result));
    }

    @PostMapping("/match")
    public ResponseEntity<Map<String, Object>> matchJob(@RequestBody JobMatchRequest request) {
        String result = jobMatchService.matchJob(request.getResumeText(), request.getJobDescription());
        return ResponseEntity.ok(Map.of("result", result));
    }
}
