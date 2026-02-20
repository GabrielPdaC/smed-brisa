package com.arca.backend.repository;

import com.arca.backend.model.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
    List<Article> findByJournalId(Long journalId);
    List<Article> findByUserId(Long userId);
    List<Article> findByStatus(String status);
    List<Article> findByJournalIdAndStatus(Long journalId, String status);
    int countByJournalId(Long journalId);
}
