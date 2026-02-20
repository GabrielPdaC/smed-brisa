package com.arca.backend.controller;

import com.arca.backend.dto.ArticleDTO;
import com.arca.backend.dto.ArticleCreateDTO;
import com.arca.backend.dto.ArticleUpdateDTO;
import com.arca.backend.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/articles")
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @GetMapping
    public ResponseEntity<List<ArticleDTO>> getAllArticles() {
        List<ArticleDTO> articles = articleService.findAll();
        return ResponseEntity.ok(articles);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArticleDTO> getArticle(@PathVariable Long id) {
        try {
            ArticleDTO article = articleService.findById(id);
            return ResponseEntity.ok(article);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/journal/{journalId}")
    public ResponseEntity<List<ArticleDTO>> getArticlesByJournal(@PathVariable Long journalId) {
        List<ArticleDTO> articles = articleService.findByJournalId(journalId);
        return ResponseEntity.ok(articles);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ArticleDTO>> getArticlesByUser(@PathVariable Long userId) {
        List<ArticleDTO> articles = articleService.findByUserId(userId);
        return ResponseEntity.ok(articles);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<ArticleDTO>> getArticlesByStatus(@PathVariable String status) {
        List<ArticleDTO> articles = articleService.findByStatus(status);
        return ResponseEntity.ok(articles);
    }

    @GetMapping("/journal/{journalId}/status/{status}")
    public ResponseEntity<List<ArticleDTO>> getArticlesByJournalAndStatus(
            @PathVariable Long journalId, 
            @PathVariable String status) {
        List<ArticleDTO> articles = articleService.findByJournalIdAndStatus(journalId, status);
        return ResponseEntity.ok(articles);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<ArticleDTO>> getPendingArticles() {
        List<ArticleDTO> articles = articleService.findPending();
        return ResponseEntity.ok(articles);
    }

    @PostMapping
    public ResponseEntity<?> createArticle(@RequestBody ArticleCreateDTO dto) {
        try {
            ArticleDTO created = articleService.save(dto);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ArticleDTO> updateArticle(@PathVariable Long id, @RequestBody ArticleUpdateDTO dto) {
        try {
            ArticleDTO updated = articleService.update(id, dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<ArticleDTO> approveArticle(@PathVariable Long id) {
        try {
            ArticleDTO approved = articleService.approve(id);
            return ResponseEntity.ok(approved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ArticleDTO> rejectArticle(@PathVariable Long id, @RequestBody(required = false) String reason) {
        try {
            ArticleDTO rejected = articleService.reject(id, reason);
            return ResponseEntity.ok(rejected);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticle(@PathVariable Long id) {
        boolean deleted = articleService.deleteById(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
