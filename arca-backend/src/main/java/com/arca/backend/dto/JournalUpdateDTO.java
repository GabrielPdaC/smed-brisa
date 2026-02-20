package com.arca.backend.dto;

import java.time.LocalDate;

public class JournalUpdateDTO {
    private String name;
    private Long repositoryId;
    private String status;
    private LocalDate closingDate;

    public JournalUpdateDTO() {}

    public JournalUpdateDTO(String name, Long repositoryId, String status, LocalDate closingDate) {
        this.name = name;
        this.repositoryId = repositoryId;
        this.status = status;
        this.closingDate = closingDate;
    }

    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Long getRepositoryId() { return repositoryId; }
    public void setRepositoryId(Long repositoryId) { this.repositoryId = repositoryId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getClosingDate() { return closingDate; }
    public void setClosingDate(LocalDate closingDate) { this.closingDate = closingDate; }
}
