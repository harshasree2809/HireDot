package com.hiredot.backend.controller;

import com.hiredot.backend.dto.request.ApplicationRequest;
import com.hiredot.backend.model.Application;
import com.hiredot.backend.model.User;
import com.hiredot.backend.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @GetMapping
    public ResponseEntity<List<Application>> getApplications(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(applicationService.getApplications(user.getId()));
    }

    @PostMapping
    public ResponseEntity<Application> createApplication(
            @AuthenticationPrincipal User user,
            @RequestBody ApplicationRequest request) {
        return ResponseEntity.ok(applicationService.createApplication(user.getId(), request));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Application> updateStatus(
            @AuthenticationPrincipal User user,
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(applicationService.updateApplicationStatus(id, body.get("status"), user.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Application> updateApplication(
            @AuthenticationPrincipal User user,
            @PathVariable String id,
            @RequestBody ApplicationRequest request) {
        applicationService.updateApplicationStatus(id, request.getStatus(), user.getId());
        return ResponseEntity.ok(applicationService.getApplications(user.getId()).stream()
                .filter(a -> a.getId().equals(id)).findFirst().orElseThrow());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        applicationService.deleteApplication(id, user.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(applicationService.getStats(user.getId()));
    }
}
