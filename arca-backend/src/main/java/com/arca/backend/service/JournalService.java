package com.arca.backend.service;

import com.arca.backend.model.Journal;
import com.arca.backend.model.Repository;
import com.arca.backend.model.School;
import com.arca.backend.model.User;
import com.arca.backend.dto.JournalDTO;
import com.arca.backend.dto.JournalCreateDTO;
import com.arca.backend.dto.JournalUpdateDTO;
import com.arca.backend.repository.JournalRepository;
import com.arca.backend.repository.RepositoryRepository;
import com.arca.backend.repository.SchoolRepository;
import com.arca.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class JournalService {
    
    @Autowired
    private JournalRepository journalRepository;
    
    @Autowired
    private RepositoryRepository repositoryRepository;
    
    @Autowired
    private SchoolRepository schoolRepository;
    
    @Autowired
    private UserRepository userRepository;

    public JournalDTO save(JournalCreateDTO dto) {
        Repository repository = repositoryRepository.findById(dto.getRepositoryId())
                .orElseThrow(() -> new RuntimeException("Repository not found with id: " + dto.getRepositoryId()));
        
        School school = schoolRepository.findById(dto.getSchoolId())
                .orElseThrow(() -> new RuntimeException("School not found with id: " + dto.getSchoolId()));
        
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + dto.getUserId()));
        
        Journal journal = new Journal();
        journal.setName(dto.getName());
        journal.setRepository(repository);
        journal.setSchool(school);
        journal.setUser(user);
        journal.setOpeningDate(dto.getOpeningDate() != null ? dto.getOpeningDate() : java.time.LocalDate.now());
        journal.setClosingDate(dto.getClosingDate());
        journal.setStatus(dto.getStatus() != null ? dto.getStatus() : "OPEN");
        
        Journal savedJournal = journalRepository.save(journal);
        return convertToDTO(savedJournal);
    }

    public JournalDTO update(Long id, JournalUpdateDTO dto) {
        Optional<Journal> existingJournal = journalRepository.findById(id);
        if (existingJournal.isEmpty()) {
            throw new RuntimeException("Journal not found with id: " + id);
        }
        
        Journal journal = existingJournal.get();
        
        if (dto.getName() != null) {
            journal.setName(dto.getName());
        }
        
        if (dto.getRepositoryId() != null) {
            Repository repository = repositoryRepository.findById(dto.getRepositoryId())
                    .orElseThrow(() -> new RuntimeException("Repository not found with id: " + dto.getRepositoryId()));
            journal.setRepository(repository);
        }
        
        if (dto.getStatus() != null) {
            journal.setStatus(dto.getStatus());
        }
        
        if (dto.getClosingDate() != null) {
            journal.setClosingDate(dto.getClosingDate());
        }
        
        Journal updatedJournal = journalRepository.save(journal);
        return convertToDTO(updatedJournal);
    }

    public List<JournalDTO> findAll() {
        return journalRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public JournalDTO findById(Long id) {
        Optional<Journal> journal = journalRepository.findById(id);
        if (journal.isEmpty()) {
            throw new RuntimeException("Journal not found with id: " + id);
        }
        return convertToDTO(journal.get());
    }

    public List<JournalDTO> findBySchoolId(Long schoolId) {
        return journalRepository.findBySchoolId(schoolId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<JournalDTO> findByUserId(Long userId) {
        return journalRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<JournalDTO> findByRepositoryId(Long repositoryId) {
        return journalRepository.findByRepositoryId(repositoryId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<JournalDTO> findByStatus(String status) {
        return journalRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<JournalDTO> findBySchoolIdAndStatus(Long schoolId, String status) {
        return journalRepository.findBySchoolIdAndStatus(schoolId, status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public boolean deleteById(Long id) {
        if (journalRepository.existsById(id)) {
            journalRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public long count() {
        return journalRepository.count();
    }

    private JournalDTO convertToDTO(Journal journal) {
        return new JournalDTO(
            journal.getId(),
            journal.getName(),
            journal.getRepository().getId(),
            journal.getRepository().getName(),
            journal.getSchool().getId(),
            journal.getSchool().getName(),
            journal.getUser().getId(),
            journal.getUser().getName(),
            journal.getOpeningDate(),
            journal.getClosingDate(),
            journal.getStatus()
        );
    }
}
