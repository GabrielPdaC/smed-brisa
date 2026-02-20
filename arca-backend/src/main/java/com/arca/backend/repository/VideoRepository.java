package com.arca.backend.repository;

import com.arca.backend.model.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface VideoRepository extends JpaRepository<Video, Long> {
    
    List<Video> findBySchoolId(Long schoolId);
    
    List<Video> findByUserId(Long userId);
    
    List<Video> findByRepositoryId(Long repositoryId);
    
    List<Video> findByStatus(String status);
    
    @Query("SELECT v FROM Video v WHERE v.school.id = :schoolId AND v.status = :status")
    List<Video> findBySchoolIdAndStatus(@Param("schoolId") Long schoolId, @Param("status") String status);
}