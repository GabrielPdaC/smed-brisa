package com.arca.backend.dto;

import java.time.LocalDate;

public class JournalCreateDTO {
    private String name;
    private Long repositoryId;
    private Long schoolId;
    private Long userId;
    private LocalDate openingDate;
    private LocalDate closingDate;
    private String status;

    public JournalCreateDTO() {}

    public JournalCreateDTO(String name, Long repositoryId, Long schoolId, Long userId, LocalDate openingDate, LocalDate closingDate, String status) {
        this.name = name;
        this.repositoryId = repositoryId;
        this.schoolId = schoolId;
        this.userId = userId;
        this.openingDate = openingDate;
        this.closingDate = closingDate;
        this.status = status;
    }

    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Long getRepositoryId() { return repositoryId; }
    public void setRepositoryId(Long repositoryId) { this.repositoryId = repositoryId; }

    public Long getSchoolId() { return schoolId; }
    public void setSchoolId(Long schoolId) { this.schoolId = schoolId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public LocalDate getOpeningDate() { return openingDate; }
    public void setOpeningDate(LocalDate openingDate) { this.openingDate = openingDate; }

    public LocalDate getClosingDate() { return closingDate; }
    public void setClosingDate(LocalDate closingDate) { this.closingDate = closingDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
