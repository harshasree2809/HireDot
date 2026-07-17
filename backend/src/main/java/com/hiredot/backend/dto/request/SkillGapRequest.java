package com.hiredot.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SkillGapRequest {
    private String jobDescription;
    private List<String> userSkills;
}
