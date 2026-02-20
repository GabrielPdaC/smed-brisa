package com.arca.backend.dto;

public class DocumentCreateDTO {
    private Long userId;
    private String title;
    private String description;
    private String link;
    private Long categoryId;
    private Long schoolId;
    private Long repositoryId;

    public DocumentCreateDTO() {}

    public DocumentCreateDTO(Long userId, String title, String description, String link, 
                            Long categoryId, Long schoolId, Long repositoryId) {
        this.userId = userId;
        this.title = title;
        this.description = description;
        this.link = link;
        this.categoryId = categoryId;
        this.schoolId = schoolId;
        this.repositoryId = repositoryId;
    }

    // Getters and setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public Long getSchoolId() {
        return schoolId;
    }

    public void setSchoolId(Long schoolId) {
        this.schoolId = schoolId;
    }

    public Long getRepositoryId() {
        return repositoryId;
    }

    public void setRepositoryId(Long repositoryId) {
        this.repositoryId = repositoryId;
    }
}
