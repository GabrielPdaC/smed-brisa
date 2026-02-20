package com.arca.backend.service;

import com.arca.backend.dto.ArticleDTO;
import com.arca.backend.dto.ArticleCreateDTO;
import com.arca.backend.dto.ArticleUpdateDTO;
import com.arca.backend.model.Article;
import com.arca.backend.model.Journal;
import com.arca.backend.model.User;
import com.arca.backend.model.Comment;
import com.arca.backend.repository.ArticleRepository;
import com.arca.backend.repository.JournalRepository;
import com.arca.backend.repository.UserRepository;
import com.arca.backend.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ArticleService {

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private JournalRepository journalRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommentRepository commentRepository;

    public ArticleDTO save(ArticleCreateDTO dto) {
        Journal journal = journalRepository.findById(dto.getJournalId())
                .orElseThrow(() -> new RuntimeException("Journal not found with id: " + dto.getJournalId()));

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + dto.getUserId()));

        // Verificar se a revista está aberta para submissões
        if (!"OPEN".equals(journal.getStatus())) {
            throw new RuntimeException("Journal is not open for submissions");
        }

        Article article = new Article();
        article.setJournal(journal);
        article.setAuthors(dto.getAuthors());
        article.setTitle(dto.getTitle());
        article.setUrl(dto.getUrl());
        article.setUser(user);
        article.setStatus("PENDING"); // Status inicial sempre PENDING
        
        if (dto.getCommentId() != null) {
            Comment comment = commentRepository.findById(dto.getCommentId())
                    .orElseThrow(() -> new RuntimeException("Comment not found with id: " + dto.getCommentId()));
            article.setComment(comment);
        }

        Article saved = articleRepository.save(article);
        return convertToDTO(saved);
    }

    public ArticleDTO update(Long id, ArticleUpdateDTO dto) {
        Optional<Article> existing = articleRepository.findById(id);
        if (existing.isEmpty()) {
            throw new RuntimeException("Article not found with id: " + id);
        }

        Article article = existing.get();
        
        if (dto.getAuthors() != null) {
            article.setAuthors(dto.getAuthors());
        }
        if (dto.getTitle() != null) {
            article.setTitle(dto.getTitle());
        }
        if (dto.getUrl() != null) {
            article.setUrl(dto.getUrl());
        }
        // Status não pode ser alterado via update - usar rotas approve/reject
        if (dto.getCommentId() != null) {
            Comment comment = commentRepository.findById(dto.getCommentId())
                    .orElseThrow(() -> new RuntimeException("Comment not found with id: " + dto.getCommentId()));
            article.setComment(comment);
        }

        Article updated = articleRepository.save(article);
        return convertToDTO(updated);
    }

    public List<ArticleDTO> findAll() {
        return articleRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ArticleDTO findById(Long id) {
        Optional<Article> article = articleRepository.findById(id);
        if (article.isEmpty()) {
            throw new RuntimeException("Article not found with id: " + id);
        }
        return convertToDTO(article.get());
    }

    public List<ArticleDTO> findByJournalId(Long journalId) {
        return articleRepository.findByJournalId(journalId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ArticleDTO> findByUserId(Long userId) {
        return articleRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ArticleDTO> findByStatus(String status) {
        return articleRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ArticleDTO> findByJournalIdAndStatus(Long journalId, String status) {
        return articleRepository.findByJournalIdAndStatus(journalId, status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ArticleDTO> findPending() {
        return findByStatus("PENDING");
    }

    public boolean deleteById(Long id) {
        if (articleRepository.existsById(id)) {
            articleRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public long count() {
        return articleRepository.count();
    }

    public List<ArticleDTO> findApprovedArticlesInOpenJournals() {
        return articleRepository.findAll().stream()
                .filter(article -> "APPROVED".equals(article.getStatus()))
                .filter(article -> "OPEN".equals(article.getJournal().getStatus()))
                .map(this::convertToDTO)
                .collect(java.util.stream.Collectors.toList());
    }

    public ArticleDTO approve(Long id) {
        Optional<Article> existing = articleRepository.findById(id);
        if (existing.isEmpty()) {
            throw new RuntimeException("Article not found with id: " + id);
        }

        Article article = existing.get();
        article.setStatus("APPROVED");
        Article updated = articleRepository.save(article);
        return convertToDTO(updated);
    }

    public ArticleDTO reject(Long id, String reason) {
        Optional<Article> existing = articleRepository.findById(id);
        if (existing.isEmpty()) {
            throw new RuntimeException("Article not found with id: " + id);
        }

        Article article = existing.get();
        article.setStatus("REJECTED");
        
        // Se foi fornecido um motivo, criar um comentário
        if (reason != null && !reason.trim().isEmpty()) {
            Comment comment = new Comment();
            comment.setComment(reason);
            comment.setUser(article.getUser());
            Comment savedComment = commentRepository.save(comment);
            article.setComment(savedComment);
        }
        
        Article updated = articleRepository.save(article);
        return convertToDTO(updated);
    }

    private ArticleDTO convertToDTO(Article article) {
        return new ArticleDTO(
                article.getId(),
                article.getJournal().getId(),
                article.getAuthors(),
                article.getTitle(),
                article.getUrl(),
                article.getUser().getId(),
                article.getUser().getName(),
                article.getStatus(),
                article.getComment() != null ? article.getComment().getId() : null,
                article.getCreatedAt()
        );
    }
}
