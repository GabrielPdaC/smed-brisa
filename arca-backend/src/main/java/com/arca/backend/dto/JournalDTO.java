package com.arca.backend.dto;

import java.time.LocalDate;

public class JournalDTO {
    private Long id;
    private String name;
    private Long repositoryId;
    private String repositoryName;
    private Long schoolId;
    private String schoolName;
    private Long userId;
    private String userName;
    private LocalDate openingDate;
    private LocalDate closingDate;
    private String status;

    public JournalDTO() {}

    public JournalDTO(Long id, String name, Long repositoryId, String repositoryName, Long schoolId, String schoolName,
                     Long userId, String userName, LocalDate openingDate, LocalDate closingDate, String status) {
        this.id = id;
        this.name = name;
        this.repositoryId = repositoryId;
        this.repositoryName = repositoryName;
        this.schoolId = schoolId;
        this.schoolName = schoolName;
        this.userId = userId;
        this.userName = userName;
        this.openingDate = openingDate;
        this.closingDate = closingDate;
        this.status = status;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Long getRepositoryId() { return repositoryId; }
    public void setRepositoryId(Long repositoryId) { this.repositoryId = repositoryId; }

    public String getRepositoryName() { return repositoryName; }
    public void setRepositoryName(String repositoryName) { this.repositoryName = repositoryName; }

    public Long getSchoolId() { return schoolId; }
    public void setSchoolId(Long schoolId) { this.schoolId = schoolId; }

    public String getSchoolName() { return schoolName; }
    public void setSchoolName(String schoolName) { this.schoolName = schoolName; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public LocalDate getOpeningDate() { return openingDate; }
    public void setOpeningDate(LocalDate openingDate) { this.openingDate = openingDate; }

    public LocalDate getClosingDate() { return closingDate; }
    public void setClosingDate(LocalDate closingDate) { this.closingDate = closingDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
