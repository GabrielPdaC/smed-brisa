package com.arca.backend.dto;

public class CommentUpdateDTO {
    private String comment;
    private Long nextCommentId;

    public CommentUpdateDTO() {}

    public CommentUpdateDTO(String comment, Long nextCommentId) {
        this.comment = comment;
        this.nextCommentId = nextCommentId;
    }

    // Getters and setters
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public Long getNextCommentId() { return nextCommentId; }
    public void setNextCommentId(Long nextCommentId) { this.nextCommentId = nextCommentId; }
}
