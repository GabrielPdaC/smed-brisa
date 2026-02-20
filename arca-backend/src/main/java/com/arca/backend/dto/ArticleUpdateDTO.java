package com.arca.backend.dto;

public class ArticleUpdateDTO {
    private String authors;
    private String title;
    private String url;
    private Long commentId;

    public ArticleUpdateDTO() {}

    // Getters and setters
    public String getAuthors() { return authors; }
    public void setAuthors(String authors) { this.authors = authors; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public Long getCommentId() { return commentId; }
    public void setCommentId(Long commentId) { this.commentId = commentId; }
}
