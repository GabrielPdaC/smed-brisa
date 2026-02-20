package com.arca.backend.dto;

public class VideoCreateDTO {
    private String title;
    private String description;
    private String url;
    private String urlThumbnail;
    private Long repositoryId;
    private Long userId;
    private Long schoolId;

    public VideoCreateDTO() {}

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

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getSchoolId() { return schoolId; }
    public void setSchoolId(Long schoolId) { this.schoolId = schoolId; }
}