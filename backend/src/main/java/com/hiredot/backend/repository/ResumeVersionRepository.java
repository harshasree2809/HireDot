package com.hiredot.backend.repository;

import com.hiredot.backend.model.ResumeVersion;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ResumeVersionRepository extends MongoRepository<ResumeVersion, String> {
    List<ResumeVersion> findByUserIdOrderByUploadedAtDesc(String userId);
}
