package com.arca.backend.dto;

import java.time.LocalDateTime;

public class ArticleDTO {
    private Long id;
    private Long journalId;
    private String authors;
    private String title;
    private String url;
    private Long userId;
    private String userName;
    private String status;
    private Long commentId;
    private LocalDateTime createdAt;

    public ArticleDTO() {}

    public ArticleDTO(Long id, Long journalId, String authors, String title, String url, Long userId, 
                     String userName, String status, Long commentId, LocalDateTime createdAt) {
        this.id = id;
        this.journalId = journalId;
        this.authors = authors;
        this.title = title;
        this.url = url;
        this.userId = userId;
        this.userName = userName;
        this.status = status;
        this.commentId = commentId;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getJournalId() { return journalId; }
    public void setJournalId(Long journalId) { this.journalId = journalId; }

    public String getAuthors() { return authors; }
    public void setAuthors(String authors) { this.authors = authors; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getCommentId() { return commentId; }
    public void setCommentId(Long commentId) { this.commentId = commentId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
