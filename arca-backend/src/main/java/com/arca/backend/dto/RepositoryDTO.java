package com.arca.backend.dto;

import java.time.LocalDateTime;

public class RepositoryDTO {
    private Long id;
    private String name;
    private String description;
    private String type;
    private LocalDateTime createdAt;

    public RepositoryDTO() {}

    public RepositoryDTO(Long id, String name, String description, String type, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.type = type;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}