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
@Document(collection = "resume_versions")
public class ResumeVersion {

    @Id
    private String id;
    private String userId;
    private String versionName;
    private String cloudinaryUrl;
    private String cloudinaryPublicId;
    private String parsedText;
    private String targetJobTitle;
    private boolean isTailored;
    private int atsScore;
    @Builder.Default
    private LocalDateTime uploadedAt = LocalDateTime.now();
}
