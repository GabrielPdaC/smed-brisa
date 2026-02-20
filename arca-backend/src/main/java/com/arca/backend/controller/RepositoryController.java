package com.arca.backend.controller;

import com.arca.backend.dto.RepositoryDTO;
import com.arca.backend.service.RepositoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/repositories")
public class RepositoryController {
    
    @Autowired
    private RepositoryService repositoryService;

    @GetMapping
    public ResponseEntity<List<RepositoryDTO>> getAllRepositories(@RequestParam(required = false) String type) {
        List<RepositoryDTO> repositories;
        if (type != null && !type.isEmpty()) {
            repositories = repositoryService.findByType(type);
        } else {
            repositories = repositoryService.findAll();
        }
        return ResponseEntity.ok(repositories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RepositoryDTO> getRepository(@PathVariable Long id) {
        try {
            RepositoryDTO repository = repositoryService.findById(id);
            return ResponseEntity.ok(repository);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<RepositoryDTO> createRepository(@RequestBody RepositoryDTO dto) {
        try {
            RepositoryDTO createdRepository = repositoryService.save(dto);
            return ResponseEntity.ok(createdRepository);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<RepositoryDTO> updateRepository(@PathVariable Long id, @RequestBody RepositoryDTO dto) {
        try {
            RepositoryDTO updatedRepository = repositoryService.update(id, dto);
            return ResponseEntity.ok(updatedRepository);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRepository(@PathVariable Long id) {
        boolean deleted = repositoryService.deleteById(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}