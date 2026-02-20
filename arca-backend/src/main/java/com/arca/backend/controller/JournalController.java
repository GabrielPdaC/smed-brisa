package com.arca.backend.controller;

import com.arca.backend.dto.JournalDTO;
import com.arca.backend.dto.JournalCreateDTO;
import com.arca.backend.dto.JournalUpdateDTO;
import com.arca.backend.service.JournalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/journals")
public class JournalController {
    
    @Autowired
    private JournalService journalService;

    @GetMapping
    public ResponseEntity<List<JournalDTO>> getAllJournals() {
        List<JournalDTO> journals = journalService.findAll();
        return ResponseEntity.ok(journals);
    }

    @GetMapping("/{id}")
    public ResponseEntity<JournalDTO> getJournal(@PathVariable Long id) {
        try {
            JournalDTO journal = journalService.findById(id);
            return ResponseEntity.ok(journal);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/school/{schoolId}")
    public ResponseEntity<List<JournalDTO>> getJournalsBySchool(@PathVariable Long schoolId) {
        List<JournalDTO> journals = journalService.findBySchoolId(schoolId);
        return ResponseEntity.ok(journals);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<JournalDTO>> getJournalsByUser(@PathVariable Long userId) {
        List<JournalDTO> journals = journalService.findByUserId(userId);
        return ResponseEntity.ok(journals);
    }

    @GetMapping("/repository/{repositoryId}")
    public ResponseEntity<List<JournalDTO>> getJournalsByRepository(@PathVariable Long repositoryId) {
        List<JournalDTO> journals = journalService.findByRepositoryId(repositoryId);
        return ResponseEntity.ok(journals);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<JournalDTO>> getJournalsByStatus(@PathVariable String status) {
        List<JournalDTO> journals = journalService.findByStatus(status);
        return ResponseEntity.ok(journals);
    }

    @GetMapping("/school/{schoolId}/status/{status}")
    public ResponseEntity<List<JournalDTO>> getJournalsBySchoolAndStatus(
            @PathVariable Long schoolId, 
            @PathVariable String status) {
        List<JournalDTO> journals = journalService.findBySchoolIdAndStatus(schoolId, status);
        return ResponseEntity.ok(journals);
    }

    @PostMapping
    public ResponseEntity<JournalDTO> createJournal(@RequestBody JournalCreateDTO dto) {
        try {
            JournalDTO createdJournal = journalService.save(dto);
            return ResponseEntity.ok(createdJournal);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<JournalDTO> updateJournal(@PathVariable Long id, @RequestBody JournalUpdateDTO dto) {
        try {
            JournalDTO updatedJournal = journalService.update(id, dto);
            return ResponseEntity.ok(updatedJournal);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJournal(@PathVariable Long id) {
        boolean deleted = journalService.deleteById(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
