package com.hiredot.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final GroqService groqService;

    public String generateInterviewQuestions(String jobTitle, String jobDescription, String difficulty, int count) {
        String prompt = "You are an expert technical interviewer.\n" +
                "Generate " + count + " interview questions for the role of " + jobTitle + " at " + difficulty + " difficulty.\n" +
                "Return JSON:\n" +
                "{\n" +
                "  \"questions\": [\n" +
                "    {\n" +
                "      \"id\": <number>,\n" +
                "      \"question\": \"<interview question>\",\n" +
                "      \"category\": \"<TECHNICAL/BEHAVIORAL/SITUATIONAL/CULTURE_FIT>\",\n" +
                "      \"difficulty\": \"<EASY/MEDIUM/HARD>\",\n" +
                "      \"sampleAnswer\": \"<a strong sample answer>\",\n" +
                "      \"tips\": [<tips for answering this question>]\n" +
                "    }\n" +
                "  ]\n" +
                "}\n\n" +
                "Job Description:\n" + jobDescription +
                "\n\nRespond with ONLY valid JSON, no markdown.";
        return groqService.generateContent(prompt);
    }
}
