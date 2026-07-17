package com.hiredot.backend.controller;

import com.hiredot.backend.dto.request.SkillGapRequest;
import com.hiredot.backend.service.SkillGapService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
public class SkillController {

    private final SkillGapService skillGapService;

    @PostMapping("/gap")
    public ResponseEntity<Map<String, Object>> analyzeSkillGap(@RequestBody SkillGapRequest request) {
        String result = skillGapService.analyzeSkillGap(request.getJobDescription(), request.getUserSkills());
        return ResponseEntity.ok(Map.of("result", result));
    }
}
