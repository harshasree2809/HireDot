package com.hiredot.backend.service;

import com.hiredot.backend.model.MasterProfile;
import com.hiredot.backend.repository.MasterProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final MasterProfileRepository profileRepository;

    public Optional<MasterProfile> getProfile(String userId) {
        return profileRepository.findByUserId(userId);
    }

    public MasterProfile saveOrUpdateProfile(String userId, MasterProfile profile) {
        Optional<MasterProfile> existing = profileRepository.findByUserId(userId);
        if (existing.isPresent()) {
            MasterProfile toUpdate = existing.get();
            profile.setId(toUpdate.getId());
            profile.setUserId(userId);
            profile.setCreatedAt(toUpdate.getCreatedAt());
            profile.setUpdatedAt(LocalDateTime.now());
        } else {
            profile.setUserId(userId);
            profile.setCreatedAt(LocalDateTime.now());
            profile.setUpdatedAt(LocalDateTime.now());
        }
        return profileRepository.save(profile);
    }
}
