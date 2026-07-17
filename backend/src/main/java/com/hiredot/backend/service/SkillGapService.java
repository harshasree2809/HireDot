package com.hiredot.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillGapService {

    private final GeminiService geminiService;

    public String analyzeSkillGap(String jobDescription, List<String> userSkills) {
        String skillsStr = String.join(", ", userSkills);
        String prompt = """
                You are a career development expert and skills analyst.
                Analyze the skill gap between what the candidate has and what the job requires. Return JSON:
                {
                  "overallGapScore": <0-100, higher means bigger gap>,
                  "presentSkills": [<skills the candidate has that match>],
                  "missingCriticalSkills": [
                    {
                      "skill": "<skill name>",
                      "importance": "<HIGH/MEDIUM/LOW>",
                      "learningResources": [
                        {"name": "<resource name>", "url": "<url or platform>", "duration": "<estimated learning time>"}
                      ]
                    }
                  ],
                  "recommendedCourses": [<list of recommended courses/certifications>],
                  "estimatedTimeToReady": "<how long to bridge the gap>",
                  "careerPath": "<suggested career path>"
                }

                Candidate's current skills: """ + skillsStr + "\nJob Description:\n" + jobDescription +
                "\n\nRespond with ONLY valid JSON, no markdown.";
        return geminiService.generateContent(prompt);
    }
}
