package com.hiredot.backend.service;

import com.hiredot.backend.model.ResumeVersion;
import com.hiredot.backend.repository.ResumeVersionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeVersionRepository resumeVersionRepository;
    private final CloudinaryService cloudinaryService;
    private final PdfParsingService pdfParsingService;
    private final GeminiService geminiService;

    public ResumeVersion uploadResume(String userId, MultipartFile file, String versionName) throws IOException {
        String parsedText = pdfParsingService.extractTextFromPdf(file);
        Map<String, String> uploadResult = cloudinaryService.uploadResume(file);
        ResumeVersion version = ResumeVersion.builder()
                .userId(userId)
                .versionName(versionName != null ? versionName : file.getOriginalFilename())
                .cloudinaryUrl(uploadResult.get("url"))
                .cloudinaryPublicId(uploadResult.get("publicId"))
                .parsedText(parsedText)
                .isTailored(false)
                .build();
        return resumeVersionRepository.save(version);
    }

    public List<ResumeVersion> getVersions(String userId) {
        return resumeVersionRepository.findByUserIdOrderByUploadedAtDesc(userId);
    }

    public String tailorResume(String resumeText, String jobDescription) {
        String prompt = """
                You are an expert resume writer and ATS optimization specialist.
                Tailor the following resume to match the job description. Make it ATS-friendly by:
                1. Incorporating relevant keywords from the job description
                2. Quantifying achievements where possible
                3. Matching the language and terminology used in the JD
                4. Keeping it concise and impactful

                Resume:
                """ + resumeText + "\n\nJob Description:\n" + jobDescription +
                "\n\nProvide the tailored resume in a clean, professional format.";
        return geminiService.generateText(prompt);
    }
}
