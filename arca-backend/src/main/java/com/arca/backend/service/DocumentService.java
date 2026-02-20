package com.arca.backend.service;

import com.arca.backend.model.Document;
import com.arca.backend.model.User;
import com.arca.backend.model.Category;
import com.arca.backend.model.School;
import com.arca.backend.model.Repository;
import com.arca.backend.dto.DocumentDTO;
import com.arca.backend.dto.DocumentCreateDTO;
import com.arca.backend.dto.DocumentUpdateDTO;
import com.arca.backend.repository.DocumentRepository;
import com.arca.backend.repository.UserRepository;
import com.arca.backend.repository.CategoryRepository;
import com.arca.backend.repository.SchoolRepository;
import com.arca.backend.repository.RepositoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DocumentService {
    
    @Autowired
    private DocumentRepository documentRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private SchoolRepository schoolRepository;
    
    @Autowired
    private RepositoryRepository repositoryRepository;

    public DocumentDTO save(DocumentCreateDTO documentCreateDTO) {
        User user = userRepository.findById(documentCreateDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + documentCreateDTO.getUserId()));
        
        Category category = categoryRepository.findById(documentCreateDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + documentCreateDTO.getCategoryId()));
        
        Repository repository = repositoryRepository.findById(documentCreateDTO.getRepositoryId())
                .orElseThrow(() -> new RuntimeException("Repository not found with id: " + documentCreateDTO.getRepositoryId()));
        
        School school = null;
        if (documentCreateDTO.getSchoolId() != null) {
            school = schoolRepository.findById(documentCreateDTO.getSchoolId())
                    .orElseThrow(() -> new RuntimeException("School not found with id: " + documentCreateDTO.getSchoolId()));
        }
        
        Document document = new Document();
        document.setUser(user);
        document.setTitle(documentCreateDTO.getTitle());
        document.setDescription(documentCreateDTO.getDescription());
        document.setLink(documentCreateDTO.getLink());
        document.setCategory(category);
        document.setSchool(school);
        document.setRepository(repository);
        
        Document savedDocument = documentRepository.save(document);
        return convertToDTO(savedDocument);
    }

    public DocumentDTO update(Long id, DocumentUpdateDTO documentUpdateDTO) {
        Optional<Document> existingDocument = documentRepository.findById(id);
        if (existingDocument.isEmpty()) {
            throw new RuntimeException("Document not found with id: " + id);
        }
        
        Document document = existingDocument.get();
        
        document.setTitle(documentUpdateDTO.getTitle());
        document.setDescription(documentUpdateDTO.getDescription());
        document.setLink(documentUpdateDTO.getLink());
        
        if (documentUpdateDTO.getCategoryId() != null) {
            Category category = categoryRepository.findById(documentUpdateDTO.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + documentUpdateDTO.getCategoryId()));
            document.setCategory(category);
        }
        
        if (documentUpdateDTO.getSchoolId() != null) {
            School school = schoolRepository.findById(documentUpdateDTO.getSchoolId())
                    .orElseThrow(() -> new RuntimeException("School not found with id: " + documentUpdateDTO.getSchoolId()));
            document.setSchool(school);
        } else {
            document.setSchool(null);
        }
        
        if (documentUpdateDTO.getRepositoryId() != null) {
            Repository repository = repositoryRepository.findById(documentUpdateDTO.getRepositoryId())
                    .orElseThrow(() -> new RuntimeException("Repository not found with id: " + documentUpdateDTO.getRepositoryId()));
            document.setRepository(repository);
        }
        
        Document updatedDocument = documentRepository.save(document);
        return convertToDTO(updatedDocument);
    }

    public void delete(Long id) {
        Optional<Document> document = documentRepository.findById(id);
        if (document.isEmpty()) {
            throw new RuntimeException("Document not found with id: " + id);
        }
        documentRepository.deleteById(id);
    }

    public DocumentDTO findById(Long id) {
        Optional<Document> document = documentRepository.findById(id);
        if (document.isEmpty()) {
            throw new RuntimeException("Document not found with id: " + id);
        }
        return convertToDTO(document.get());
    }

    public List<DocumentDTO> findAll() {
        List<Document> documents = documentRepository.findAll();
        return documents.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<DocumentDTO> findBySchoolId(Long schoolId) {
        List<Document> documents = documentRepository.findBySchoolId(schoolId);
        return documents.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<DocumentDTO> findByUserId(Long userId) {
        List<Document> documents = documentRepository.findByUserId(userId);
        return documents.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<DocumentDTO> findByRepositoryId(Long repositoryId) {
        List<Document> documents = documentRepository.findByRepositoryId(repositoryId);
        return documents.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<DocumentDTO> findByCategoryId(Long categoryId) {
        List<Document> documents = documentRepository.findByCategoryId(categoryId);
        return documents.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<DocumentDTO> findBySchoolIdAndCategoryId(Long schoolId, Long categoryId) {
        List<Document> documents = documentRepository.findBySchoolIdAndCategoryId(schoolId, categoryId);
        return documents.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<DocumentDTO> findByRepositoryIdAndCategoryId(Long repositoryId, Long categoryId) {
        List<Document> documents = documentRepository.findByRepositoryIdAndCategoryId(repositoryId, categoryId);
        return documents.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private DocumentDTO convertToDTO(Document document) {
        return new DocumentDTO(
                document.getId(),
                document.getUser().getId(),
                document.getUser().getName(),
                document.getTitle(),
                document.getDescription(),
                document.getLink(),
                document.getCategory().getId(),
                document.getCategory().getName(),
                document.getSchool() != null ? document.getSchool().getId() : null,
                document.getSchool() != null ? document.getSchool().getName() : null,
                document.getRepository().getId(),
                document.getRepository().getName(),
                document.getCreatedAt()
        );
    }
}
