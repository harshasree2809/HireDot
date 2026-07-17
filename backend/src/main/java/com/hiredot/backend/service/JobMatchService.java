package com.hiredot.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JobMatchService {

    private final GeminiService geminiService;

    public String matchJob(String resumeText, String jobDescription) {
        String prompt = """
                You are a professional job matching expert.
                Analyze how well the candidate's profile matches the job description. Return JSON:
                {
                  "matchScore": <0-100>,
                  "fitLevel": "<EXCELLENT/GOOD/FAIR/POOR>",
                  "matchedRequirements": [<list of requirements the candidate meets>],
                  "unmatchedRequirements": [<list of requirements not met>],
                  "strengths": [<candidate's strengths for this role>],
                  "improvements": [<areas to improve>],
                  "recommendation": "<Should apply or not and why>"
                }

                Resume/Profile:
                """ + resumeText + "\n\nJob Description:\n" + jobDescription +
                "\n\nRespond with ONLY valid JSON, no markdown.";
        return geminiService.generateContent(prompt);
    }

    public String analyzeJobDescription(String jobDescription) {
        String prompt = """
                Analyze this job description and extract key information. Return JSON:
                {
                  "jobTitle": "<extracted title>",
                  "company": "<company if mentioned>",
                  "requiredSkills": [<list of required skills>],
                  "preferredSkills": [<list of preferred/nice-to-have skills>],
                  "experienceRequired": "<years of experience required>",
                  "educationRequired": "<education requirement>",
                  "keyResponsibilities": [<main job responsibilities>],
                  "salaryRange": "<if mentioned, else null>",
                  "jobType": "<full-time/part-time/contract/remote>",
                  "industry": "<industry domain>"
                }
                Job Description:
                """ + jobDescription + "\n\nRespond with ONLY valid JSON, no markdown.";
        return geminiService.generateContent(prompt);
    }
}
