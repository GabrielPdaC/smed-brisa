package com.arca.backend.dto;

public class CommentCreateDTO {
    private Long userId;
    private String comment;
    private Long nextCommentId;

    public CommentCreateDTO() {}

    public CommentCreateDTO(Long userId, String comment, Long nextCommentId) {
        this.userId = userId;
        this.comment = comment;
        this.nextCommentId = nextCommentId;
    }

    // Getters and setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public Long getNextCommentId() { return nextCommentId; }
    public void setNextCommentId(Long nextCommentId) { this.nextCommentId = nextCommentId; }
}
