package com.arca.backend.service;

import com.arca.backend.model.Repository;
import com.arca.backend.dto.RepositoryDTO;
import com.arca.backend.repository.RepositoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RepositoryService {
    
    @Autowired
    private RepositoryRepository repositoryRepository;

    public RepositoryDTO save(RepositoryDTO repositoryDTO) {
        Repository repository = new Repository();
        repository.setName(repositoryDTO.getName());
        repository.setDescription(repositoryDTO.getDescription());
        repository.setType(repositoryDTO.getType() != null ? repositoryDTO.getType() : "CEDOC");
        
        Repository savedRepository = repositoryRepository.save(repository);
        return convertToDTO(savedRepository);
    }

    public RepositoryDTO update(Long id, RepositoryDTO repositoryDTO) {
        Optional<Repository> existingRepository = repositoryRepository.findById(id);
        if (existingRepository.isEmpty()) {
            throw new RuntimeException("Repository not found with id: " + id);
        }
        
        Repository repository = existingRepository.get();
        repository.setName(repositoryDTO.getName());
        repository.setDescription(repositoryDTO.getDescription());
        if (repositoryDTO.getType() != null) {
            repository.setType(repositoryDTO.getType());
        }
        
        Repository updatedRepository = repositoryRepository.save(repository);
        return convertToDTO(updatedRepository);
    }

    public List<RepositoryDTO> findAll() {
        return repositoryRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public RepositoryDTO findById(Long id) {
        Optional<Repository> repository = repositoryRepository.findById(id);
        if (repository.isEmpty()) {
            throw new RuntimeException("Repository not found with id: " + id);
        }
        return convertToDTO(repository.get());
    }

    public boolean deleteById(Long id) {
        if (repositoryRepository.existsById(id)) {
            repositoryRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public long count() {
        return repositoryRepository.count();
    }

    public List<RepositoryDTO> findByType(String type) {
        return repositoryRepository.findByType(type).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Método de conversão
    private RepositoryDTO convertToDTO(Repository repository) {
        RepositoryDTO dto = new RepositoryDTO();
        dto.setId(repository.getId());
        dto.setName(repository.getName());
        dto.setDescription(repository.getDescription());
        dto.setType(repository.getType());
        dto.setCreatedAt(repository.getCreatedAt());
        return dto;
    }
}