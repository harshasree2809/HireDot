package com.hiredot.backend.repository;

import com.hiredot.backend.model.MasterProfile;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface MasterProfileRepository extends MongoRepository<MasterProfile, String> {
    Optional<MasterProfile> findByUserId(String userId);
}
