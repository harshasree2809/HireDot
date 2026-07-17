package com.hiredot.backend.controller;

import com.hiredot.backend.model.ResumeVersion;
import com.hiredot.backend.model.User;
import com.hiredot.backend.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping("/upload")
    public ResponseEntity<ResumeVersion> uploadResume(
            @AuthenticationPrincipal User user,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "versionName", required = false) String versionName) throws IOException {
        return ResponseEntity.ok(resumeService.uploadResume(user.getId(), file, versionName));
    }

    @GetMapping("/versions")
    public ResponseEntity<List<ResumeVersion>> getVersions(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(resumeService.getVersions(user.getId()));
    }

    @PostMapping("/tailor")
    public ResponseEntity<Map<String, String>> tailorResume(
            @RequestBody Map<String, String> request) {
        String tailored = resumeService.tailorResume(
                request.get("resumeText"),
                request.get("jobDescription")
        );
        return ResponseEntity.ok(Map.of("tailoredResume", tailored));
    }
}
