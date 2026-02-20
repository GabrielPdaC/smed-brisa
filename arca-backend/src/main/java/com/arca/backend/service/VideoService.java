package com.arca.backend.service;

import com.arca.backend.model.Video;
import com.arca.backend.model.Repository;
import com.arca.backend.model.User;
import com.arca.backend.model.School;
import com.arca.backend.model.Comment;
import com.arca.backend.dto.VideoDTO;
import com.arca.backend.dto.VideoCreateDTO;
import com.arca.backend.dto.VideoUpdateDTO;
import com.arca.backend.repository.VideoRepository;
import com.arca.backend.repository.RepositoryRepository;
import com.arca.backend.repository.UserRepository;
import com.arca.backend.repository.SchoolRepository;
import com.arca.backend.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VideoService {
    
    @Autowired
    private VideoRepository videoRepository;
    
    @Autowired
    private RepositoryRepository repositoryRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private SchoolRepository schoolRepository;
    
    @Autowired
    private CommentRepository commentRepository;

    public VideoDTO save(VideoCreateDTO videoCreateDTO) {
        // Validar dados obrigatórios
        if (videoCreateDTO.getRepositoryId() == null || videoCreateDTO.getRepositoryId() <= 0) {
            throw new RuntimeException("Repository ID is required");
        }
        if (videoCreateDTO.getUserId() == null || videoCreateDTO.getUserId() <= 0) {
            throw new RuntimeException("User ID is required");
        }
        if (videoCreateDTO.getSchoolId() == null || videoCreateDTO.getSchoolId() <= 0) {
            throw new RuntimeException("School ID is required");
        }
        
        // Buscar as entidades relacionadas
        Repository repository = repositoryRepository.findById(videoCreateDTO.getRepositoryId())
                .orElseThrow(() -> new RuntimeException("Repository not found with id: " + videoCreateDTO.getRepositoryId()));
        
        User user = userRepository.findById(videoCreateDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + videoCreateDTO.getUserId()));
        
        School school = schoolRepository.findById(videoCreateDTO.getSchoolId())
                .orElseThrow(() -> new RuntimeException("School not found with id: " + videoCreateDTO.getSchoolId()));
        
        // Criar vídeo
        Video video = new Video();
        video.setTitle(videoCreateDTO.getTitle());
        video.setDescription(videoCreateDTO.getDescription());
        video.setUrl(videoCreateDTO.getUrl());
        video.setUrlThumbnail(videoCreateDTO.getUrlThumbnail());
        video.setStatus("PENDING"); // Status inicial sempre PENDING
        video.setRepository(repository);
        video.setUser(user);
        video.setSchool(school);
        
        Video savedVideo = videoRepository.save(video);
        return convertToDTO(savedVideo);
    }

    public VideoDTO update(Long id, VideoUpdateDTO videoUpdateDTO) {
        Optional<Video> existingVideo = videoRepository.findById(id);
        if (existingVideo.isEmpty()) {
            throw new RuntimeException("Video not found with id: " + id);
        }
        
        Video video = existingVideo.get();
        
        // Atualizar campos básicos (status NÃO pode ser alterado via update)
        video.setTitle(videoUpdateDTO.getTitle());
        video.setDescription(videoUpdateDTO.getDescription());
        video.setUrl(videoUpdateDTO.getUrl());
        video.setUrlThumbnail(videoUpdateDTO.getUrlThumbnail());
        // Status não pode ser alterado via update - usar rotas approve/reject
        
        // Atualizar repository se necessário
        if (videoUpdateDTO.getRepositoryId() != null) {
            Repository repository = repositoryRepository.findById(videoUpdateDTO.getRepositoryId())
                    .orElseThrow(() -> new RuntimeException("Repository not found with id: " + videoUpdateDTO.getRepositoryId()));
            video.setRepository(repository);
        }
        
        // Atualizar comment se necessário
        if (videoUpdateDTO.getCommentId() != null) {
            Comment comment = commentRepository.findById(videoUpdateDTO.getCommentId())
                    .orElseThrow(() -> new RuntimeException("Comment not found with id: " + videoUpdateDTO.getCommentId()));
            video.setComment(comment);
        }
        
        Video updatedVideo = videoRepository.save(video);
        return convertToDTO(updatedVideo);
    }

    public List<VideoDTO> findAll() {
        return videoRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public VideoDTO findById(Long id) {
        Optional<Video> video = videoRepository.findById(id);
        if (video.isEmpty()) {
            throw new RuntimeException("Video not found with id: " + id);
        }
        return convertToDTO(video.get());
    }

    public List<VideoDTO> findBySchoolId(Long schoolId) {
        return videoRepository.findBySchoolId(schoolId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<VideoDTO> findByUserId(Long userId) {
        return videoRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<VideoDTO> findByRepositoryId(Long repositoryId) {
        return videoRepository.findByRepositoryId(repositoryId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<VideoDTO> findByStatus(String status) {
        return videoRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<VideoDTO> findBySchoolIdAndStatus(Long schoolId, String status) {
        return videoRepository.findBySchoolIdAndStatus(schoolId, status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public boolean deleteById(Long id) {
        if (videoRepository.existsById(id)) {
            videoRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public long count() {
        return videoRepository.count();
    }

    public VideoDTO approve(Long id) {
        Optional<Video> existing = videoRepository.findById(id);
        if (existing.isEmpty()) {
            throw new RuntimeException("Video not found with id: " + id);
        }

        Video video = existing.get();
        video.setStatus("APPROVED");
        Video updated = videoRepository.save(video);
        return convertToDTO(updated);
    }

    public VideoDTO reject(Long id, String reason) {
        Optional<Video> existing = videoRepository.findById(id);
        if (existing.isEmpty()) {
            throw new RuntimeException("Video not found with id: " + id);
        }

        Video video = existing.get();
        video.setStatus("REJECTED");
        
        // Nota: se precisar adicionar o motivo da rejeição, 
        // será necessário adicionar um campo no modelo Video
        
        Video updated = videoRepository.save(video);
        return convertToDTO(updated);
    }

    // Método de conversão
    private VideoDTO convertToDTO(Video video) {
        VideoDTO dto = new VideoDTO();
        dto.setId(video.getId());
        dto.setTitle(video.getTitle());
        dto.setDescription(video.getDescription());
        dto.setUrl(video.getUrl());
        dto.setUrlThumbnail(video.getUrlThumbnail());
        dto.setStatus(video.getStatus());
        dto.setRepositoryId(video.getRepository().getId());
        dto.setRepositoryName(video.getRepository().getName());
        dto.setUserId(video.getUser().getId());
        dto.setUserName(video.getUser().getName());
        dto.setSchoolId(video.getSchool().getId());
        dto.setSchoolName(video.getSchool().getName());
        dto.setCommentId(video.getComment() != null ? video.getComment().getId() : null);
        dto.setUploadedAt(video.getUploadedAt());
        return dto;
    }
}