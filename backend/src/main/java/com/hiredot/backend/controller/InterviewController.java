package com.hiredot.backend.controller;

import com.hiredot.backend.dto.request.InterviewRequest;
import com.hiredot.backend.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/interview")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;

    @PostMapping("/generate")
    public ResponseEntity<Map<String, Object>> generateQuestions(@RequestBody InterviewRequest request) {
        int count = request.getQuestionCount() > 0 ? request.getQuestionCount() : 5;
        String result = interviewService.generateInterviewQuestions(
                request.getJobTitle(),
                request.getJobDescription(),
                request.getDifficulty() != null ? request.getDifficulty() : "MEDIUM",
                count
        );
        return ResponseEntity.ok(Map.of("result", result));
    }
}
