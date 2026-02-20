package com.arca.backend.dto;

public class VideoUpdateDTO {
    private String title;
    private String description;
    private String url;
    private String urlThumbnail;
    private Long repositoryId;
    private Long commentId;

    public VideoUpdateDTO() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getUrlThumbnail() { return urlThumbnail; }
    public void setUrlThumbnail(String urlThumbnail) { this.urlThumbnail = urlThumbnail; }

    public Long getRepositoryId() { return repositoryId; }
    public void setRepositoryId(Long repositoryId) { this.repositoryId = repositoryId; }

    public Long getCommentId() { return commentId; }
    public void setCommentId(Long commentId) { this.commentId = commentId; }
}