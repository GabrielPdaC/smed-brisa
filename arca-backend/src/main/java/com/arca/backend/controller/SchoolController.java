package com.arca.backend.controller;

import com.arca.backend.dto.SchoolDTO;
import com.arca.backend.dto.SchoolCreateDTO;
import com.arca.backend.dto.SchoolUpdateDTO;
import com.arca.backend.service.SchoolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/schools")
public class SchoolController {
    
    @Autowired
    private SchoolService schoolService;

    @GetMapping
    public ResponseEntity<List<SchoolDTO>> getAllSchools() {
        List<SchoolDTO> schools = schoolService.findAll();
        return ResponseEntity.ok(schools);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SchoolDTO> getSchool(@PathVariable Long id) {
        try {
            SchoolDTO school = schoolService.findById(id);
            return ResponseEntity.ok(school);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<SchoolDTO> createSchool(@RequestBody SchoolCreateDTO dto) {
        try {
            SchoolDTO createdSchool = schoolService.save(dto);
            return ResponseEntity.ok(createdSchool);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<SchoolDTO> updateSchool(@PathVariable Long id, @RequestBody SchoolUpdateDTO dto) {
        try {
            SchoolDTO updatedSchool = schoolService.update(id, dto);
            return ResponseEntity.ok(updatedSchool);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchool(@PathVariable Long id) {
        boolean deleted = schoolService.deleteById(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
