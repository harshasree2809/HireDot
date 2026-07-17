package com.hiredot.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InterviewRequest {
    private String jobTitle;
    private String jobDescription;
    private String difficulty; // EASY, MEDIUM, HARD
    private int questionCount;
}
