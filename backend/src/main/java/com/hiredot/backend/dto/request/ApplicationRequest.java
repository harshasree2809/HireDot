package com.hiredot.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationRequest {
    private String companyName;
    private String jobTitle;
    private String jobUrl;
    private String location;
    private String salaryRange;
    private String status;
    private String notes;
    private String resumeVersionId;
}
