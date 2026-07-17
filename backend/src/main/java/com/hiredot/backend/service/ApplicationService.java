package com.hiredot.backend.service;

import com.hiredot.backend.dto.request.ApplicationRequest;
import com.hiredot.backend.model.Application;
import com.hiredot.backend.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    public List<Application> getApplications(String userId) {
        return applicationRepository.findByUserIdOrderByAppliedAtDesc(userId);
    }

    public Application createApplication(String userId, ApplicationRequest request) {
        Application application = Application.builder()
                .userId(userId)
                .companyName(request.getCompanyName())
                .jobTitle(request.getJobTitle())
                .jobUrl(request.getJobUrl())
                .location(request.getLocation())
                .salaryRange(request.getSalaryRange())
                .status(request.getStatus() != null ? request.getStatus() : "APPLIED")
                .notes(request.getNotes())
                .resumeVersionId(request.getResumeVersionId())
                .build();
        return applicationRepository.save(application);
    }

    public Application updateApplicationStatus(String id, String status, String userId) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        if (!application.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        application.setStatus(status);
        application.setUpdatedAt(LocalDateTime.now());
        return applicationRepository.save(application);
    }

    public void deleteApplication(String id, String userId) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        if (!application.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        applicationRepository.delete(application);
    }

    public Map<String, Long> getStats(String userId) {
        return Map.of(
                "applied", applicationRepository.countByUserIdAndStatus(userId, "APPLIED"),
                "screening", applicationRepository.countByUserIdAndStatus(userId, "SCREENING"),
                "interview", applicationRepository.countByUserIdAndStatus(userId, "INTERVIEW"),
                "offer", applicationRepository.countByUserIdAndStatus(userId, "OFFER"),
                "rejected", applicationRepository.countByUserIdAndStatus(userId, "REJECTED")
        );
    }
}
