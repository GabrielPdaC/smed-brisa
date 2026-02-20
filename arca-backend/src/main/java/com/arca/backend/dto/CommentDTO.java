package com.arca.backend.dto;

import java.time.LocalDateTime;

public class CommentDTO {
    private Long id;
    private Long userId;
    private String userName;
    private String comment;
    private Long nextCommentId;
    private LocalDateTime createdAt;

    public CommentDTO() {}

    public CommentDTO(Long id, Long userId, String userName, String comment, 
                     Long nextCommentId, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.comment = comment;
        this.nextCommentId = nextCommentId;
        this.createdAt = createdAt;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public Long getNextCommentId() { return nextCommentId; }
    public void setNextCommentId(Long nextCommentId) { this.nextCommentId = nextCommentId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
