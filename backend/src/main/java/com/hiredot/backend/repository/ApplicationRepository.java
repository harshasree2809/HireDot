package com.hiredot.backend.repository;

import com.hiredot.backend.model.Application;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ApplicationRepository extends MongoRepository<Application, String> {
    List<Application> findByUserIdOrderByAppliedAtDesc(String userId);
    List<Application> findByUserIdAndStatus(String userId, String status);
    long countByUserIdAndStatus(String userId, String status);
}
