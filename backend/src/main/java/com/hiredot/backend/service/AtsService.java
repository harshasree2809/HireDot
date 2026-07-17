package com.hiredot.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AtsService {
    private final GroqService groqService;

    public String analyzeAts(String resumeText, String jobDescription) {
        String prompt = """
                You are an expert ATS (Applicant Tracking System) analyzer.
                Analyze the resume against the job description and provide a JSON response with:
                {
                  "atsScore": <0-100 score>,
                  "keywordsFound": [<list of matched keywords>],
                  "keywordsMissing": [<list of missing important keywords>],
                  "suggestions": [<list of improvement suggestions>],
                  "sectionScores": {
                    "skills": <0-100>,
                    "experience": <0-100>,
                    "education": <0-100>,
                    "formatting": <0-100>
                  },
                  "summary": "<brief analysis summary>"
                }

                Resume:
                """ + resumeText + "\n\nJob Description:\n" + jobDescription +
                "\n\nIMPORTANT: Respond with ONLY valid JSON. No markdown, no code fences, no explanation - just the raw JSON object.";
        return groqService.generateContent(prompt);
    }
}
