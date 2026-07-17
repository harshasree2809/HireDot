package com.hiredot.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AtsRequest {
    private String resumeText;
    private String jobDescription;
}
