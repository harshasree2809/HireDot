package com.hiredot.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "applications")
public class Application {

    @Id
    private String id;
    private String userId;
    private String companyName;
    private String jobTitle;
    private String jobUrl;
    private String location;
    private String salaryRange;
    private String status; // BOOKMARKED, APPLIED, SCREENING, INTERVIEW, OFFER, REJECTED
    private int atsScore;
    private String notes;
    private String resumeVersionId;
    @Builder.Default
    private LocalDateTime appliedAt = LocalDateTime.now();
    private LocalDateTime updatedAt;
    private LocalDateTime interviewDate;
}
