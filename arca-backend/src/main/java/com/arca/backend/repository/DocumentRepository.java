package com.arca.backend.repository;

import com.arca.backend.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    
    List<Document> findBySchoolId(Long schoolId);
    
    List<Document> findByUserId(Long userId);
    
    List<Document> findByRepositoryId(Long repositoryId);
    
    List<Document> findByCategoryId(Long categoryId);
    
    @Query("SELECT d FROM Document d WHERE d.school.id = :schoolId AND d.category.id = :categoryId")
    List<Document> findBySchoolIdAndCategoryId(@Param("schoolId") Long schoolId, @Param("categoryId") Long categoryId);
    
    @Query("SELECT d FROM Document d WHERE d.repository.id = :repositoryId AND d.category.id = :categoryId")
    List<Document> findByRepositoryIdAndCategoryId(@Param("repositoryId") Long repositoryId, @Param("categoryId") Long categoryId);
}
