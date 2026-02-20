package com.arca.backend.repository;

import com.arca.backend.model.Journal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JournalRepository extends JpaRepository<Journal, Long> {
    List<Journal> findBySchoolId(Long schoolId);
    List<Journal> findByUserId(Long userId);
    List<Journal> findByRepositoryId(Long repositoryId);
    List<Journal> findByStatus(String status);
    List<Journal> findBySchoolIdAndStatus(Long schoolId, String status);
}
