package com.arca.backend.dto;

import java.time.LocalDateTime;

public class VideoDTO {
    private Long id;
    private String title;
    private String description;
    private String url;
    private String urlThumbnail;
    private String status;
    private Long repositoryId;
    private String repositoryName;
    private Long userId;
    private String userName;
    private Long schoolId;
    private String schoolName;
    private Long commentId;
    private LocalDateTime uploadedAt;

    public VideoDTO() {}

    public VideoDTO(Long id, String title, String description, String url, String urlThumbnail, String status, 
                   Long repositoryId, String repositoryName, Long userId, String userName,
                   Long schoolId, String schoolName, Long commentId, LocalDateTime uploadedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.url = url;
        this.urlThumbnail = urlThumbnail;
        this.status = status;
        this.repositoryId = repositoryId;
        this.repositoryName = repositoryName;
        this.userId = userId;
        this.userName = userName;
        this.schoolId = schoolId;
        this.schoolName = schoolName;
        this.commentId = commentId;
        this.uploadedAt = uploadedAt;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getUrlThumbnail() { return urlThumbnail; }
    public void setUrlThumbnail(String urlThumbnail) { this.urlThumbnail = urlThumbnail; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getRepositoryId() { return repositoryId; }
    public void setRepositoryId(Long repositoryId) { this.repositoryId = repositoryId; }

    public String getRepositoryName() { return repositoryName; }
    public void setRepositoryName(String repositoryName) { this.repositoryName = repositoryName; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public Long getSchoolId() { return schoolId; }
    public void setSchoolId(Long schoolId) { this.schoolId = schoolId; }

    public String getSchoolName() { return schoolName; }
    public void setSchoolName(String schoolName) { this.schoolName = schoolName; }

    public Long getCommentId() { return commentId; }
    public void setCommentId(Long commentId) { this.commentId = commentId; }

    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
}