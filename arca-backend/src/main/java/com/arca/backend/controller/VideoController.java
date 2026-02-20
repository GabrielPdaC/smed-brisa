package com.arca.backend.controller;

import com.arca.backend.dto.VideoDTO;
import com.arca.backend.dto.VideoCreateDTO;
import com.arca.backend.dto.VideoUpdateDTO;
import com.arca.backend.service.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/videos")
public class VideoController {
    
    @Autowired
    private VideoService videoService;

    @GetMapping
    public ResponseEntity<List<VideoDTO>> getAllVideos() {
        List<VideoDTO> videos = videoService.findAll();
        return ResponseEntity.ok(videos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VideoDTO> getVideo(@PathVariable Long id) {
        try {
            VideoDTO video = videoService.findById(id);
            return ResponseEntity.ok(video);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/school/{schoolId}")
    public ResponseEntity<List<VideoDTO>> getVideosBySchool(@PathVariable Long schoolId) {
        List<VideoDTO> videos = videoService.findBySchoolId(schoolId);
        return ResponseEntity.ok(videos);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<VideoDTO>> getVideosByUser(@PathVariable Long userId) {
        List<VideoDTO> videos = videoService.findByUserId(userId);
        return ResponseEntity.ok(videos);
    }

    @GetMapping("/repository/{repositoryId}")
    public ResponseEntity<List<VideoDTO>> getVideosByRepository(@PathVariable Long repositoryId) {
        List<VideoDTO> videos = videoService.findByRepositoryId(repositoryId);
        return ResponseEntity.ok(videos);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<VideoDTO>> getVideosByStatus(@PathVariable String status) {
        List<VideoDTO> videos = videoService.findByStatus(status);
        return ResponseEntity.ok(videos);
    }

    @GetMapping("/school/{schoolId}/status/{status}")
    public ResponseEntity<List<VideoDTO>> getVideosBySchoolAndStatus(
            @PathVariable Long schoolId, 
            @PathVariable String status) {
        List<VideoDTO> videos = videoService.findBySchoolIdAndStatus(schoolId, status);
        return ResponseEntity.ok(videos);
    }

    @PostMapping
    public ResponseEntity<?> createVideo(@RequestBody VideoCreateDTO dto) {
        try {
            VideoDTO createdVideo = videoService.save(dto);
            return ResponseEntity.ok(createdVideo);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of(
                "error", "Erro ao criar vídeo",
                "message", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of(
                "error", "Erro inesperado",
                "message", e.getMessage()
            ));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<VideoDTO> updateVideo(@PathVariable Long id, @RequestBody VideoUpdateDTO dto) {
        try {
            VideoDTO updatedVideo = videoService.update(id, dto);
            return ResponseEntity.ok(updatedVideo);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<VideoDTO> approveVideo(@PathVariable Long id) {
        try {
            VideoDTO approved = videoService.approve(id);
            return ResponseEntity.ok(approved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<VideoDTO> rejectVideo(@PathVariable Long id, @RequestBody(required = false) String reason) {
        try {
            VideoDTO rejected = videoService.reject(id, reason);
            return ResponseEntity.ok(rejected);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVideo(@PathVariable Long id) {
        boolean deleted = videoService.deleteById(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}