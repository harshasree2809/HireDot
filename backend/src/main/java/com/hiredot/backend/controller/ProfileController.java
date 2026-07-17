package com.hiredot.backend.controller;

import com.hiredot.backend.model.MasterProfile;
import com.hiredot.backend.model.User;
import com.hiredot.backend.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal User user) {
        return profileService.getProfile(user.getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @PutMapping
    public ResponseEntity<MasterProfile> saveProfile(
            @AuthenticationPrincipal User user,
            @RequestBody MasterProfile profile) {
        return ResponseEntity.ok(profileService.saveOrUpdateProfile(user.getId(), profile));
    }
}
