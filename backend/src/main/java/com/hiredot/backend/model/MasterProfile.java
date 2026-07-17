package com.hiredot.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "master_profiles")
public class MasterProfile {

    @Id
    private String id;
    private String userId;

    // Personal Info
    private String fullName;
    private String email;
    private String phone;
    private String location;
    private String linkedinUrl;
    private String githubUrl;
    private String portfolioUrl;
    private String summary;

    // Education
    private List<Education> education;

    // Experience
    private List<Experience> experience;

    // Skills
    private List<String> technicalSkills;
    private List<String> softSkills;
    private List<String> languages;
    private List<String> certifications;

    // Projects
    private List<Project> projects;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Education {
        private String institution;
        private String degree;
        private String field;
        private String startYear;
        private String endYear;
        private String grade;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Experience {
        private String company;
        private String role;
        private String startDate;
        private String endDate;
        private boolean current;
        private String description;
        private List<String> achievements;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Project {
        private String name;
        private String description;
        private List<String> technologies;
        private String url;
        private String githubUrl;
    }
}
