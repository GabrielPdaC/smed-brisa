package com.arca.backend.controller;

import com.arca.backend.dto.DocumentDTO;
import com.arca.backend.dto.DocumentCreateDTO;
import com.arca.backend.dto.DocumentUpdateDTO;
import com.arca.backend.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/documents")
public class DocumentController {
    
    @Autowired
    private DocumentService documentService;

    @GetMapping
    public ResponseEntity<List<DocumentDTO>> getAllDocuments() {
        List<DocumentDTO> documents = documentService.findAll();
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentDTO> getDocument(@PathVariable Long id) {
        try {
            DocumentDTO document = documentService.findById(id);
            return ResponseEntity.ok(document);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/school/{schoolId}")
    public ResponseEntity<List<DocumentDTO>> getDocumentsBySchool(@PathVariable Long schoolId) {
        List<DocumentDTO> documents = documentService.findBySchoolId(schoolId);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<DocumentDTO>> getDocumentsByUser(@PathVariable Long userId) {
        List<DocumentDTO> documents = documentService.findByUserId(userId);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/repository/{repositoryId}")
    public ResponseEntity<List<DocumentDTO>> getDocumentsByRepository(@PathVariable Long repositoryId) {
        List<DocumentDTO> documents = documentService.findByRepositoryId(repositoryId);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<DocumentDTO>> getDocumentsByCategory(@PathVariable Long categoryId) {
        List<DocumentDTO> documents = documentService.findByCategoryId(categoryId);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/school/{schoolId}/category/{categoryId}")
    public ResponseEntity<List<DocumentDTO>> getDocumentsBySchoolAndCategory(
            @PathVariable Long schoolId,
            @PathVariable Long categoryId) {
        List<DocumentDTO> documents = documentService.findBySchoolIdAndCategoryId(schoolId, categoryId);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/repository/{repositoryId}/category/{categoryId}")
    public ResponseEntity<List<DocumentDTO>> getDocumentsByRepositoryAndCategory(
            @PathVariable Long repositoryId,
            @PathVariable Long categoryId) {
        List<DocumentDTO> documents = documentService.findByRepositoryIdAndCategoryId(repositoryId, categoryId);
        return ResponseEntity.ok(documents);
    }

    @PostMapping
    public ResponseEntity<DocumentDTO> createDocument(@RequestBody DocumentCreateDTO dto) {
        try {
            DocumentDTO createdDocument = documentService.save(dto);
            return ResponseEntity.ok(createdDocument);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<DocumentDTO> updateDocument(@PathVariable Long id, @RequestBody DocumentUpdateDTO dto) {
        try {
            DocumentDTO updatedDocument = documentService.update(id, dto);
            return ResponseEntity.ok(updatedDocument);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        try {
            documentService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
