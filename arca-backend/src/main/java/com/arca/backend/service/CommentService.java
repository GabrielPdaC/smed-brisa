package com.arca.backend.service;

import com.arca.backend.model.Comment;
import com.arca.backend.model.User;
import com.arca.backend.dto.CommentDTO;
import com.arca.backend.dto.CommentCreateDTO;
import com.arca.backend.dto.CommentUpdateDTO;
import com.arca.backend.repository.CommentRepository;
import com.arca.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CommentService {
    
    @Autowired
    private CommentRepository commentRepository;
    
    @Autowired
    private UserRepository userRepository;

    public CommentDTO save(CommentCreateDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + dto.getUserId()));
        
        Comment comment = new Comment();
        comment.setUser(user);
        comment.setComment(dto.getComment());
        
        if (dto.getNextCommentId() != null) {
            Comment nextComment = commentRepository.findById(dto.getNextCommentId())
                    .orElseThrow(() -> new RuntimeException("Next comment not found with id: " + dto.getNextCommentId()));
            comment.setNextComment(nextComment);
        }
        
        Comment savedComment = commentRepository.save(comment);
        return convertToDTO(savedComment);
    }

    public CommentDTO update(Long id, CommentUpdateDTO dto) {
        Optional<Comment> existingComment = commentRepository.findById(id);
        if (existingComment.isEmpty()) {
            throw new RuntimeException("Comment not found with id: " + id);
        }
        
        Comment comment = existingComment.get();
        
        if (dto.getComment() != null) {
            comment.setComment(dto.getComment());
        }
        
        if (dto.getNextCommentId() != null) {
            Comment nextComment = commentRepository.findById(dto.getNextCommentId())
                    .orElseThrow(() -> new RuntimeException("Next comment not found with id: " + dto.getNextCommentId()));
            comment.setNextComment(nextComment);
        }
        
        Comment updatedComment = commentRepository.save(comment);
        return convertToDTO(updatedComment);
    }

    public List<CommentDTO> findAll() {
        return commentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CommentDTO findById(Long id) {
        Optional<Comment> comment = commentRepository.findById(id);
        if (comment.isEmpty()) {
            throw new RuntimeException("Comment not found with id: " + id);
        }
        return convertToDTO(comment.get());
    }

    public List<CommentDTO> findByUserId(Long userId) {
        return commentRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public boolean deleteById(Long id) {
        if (commentRepository.existsById(id)) {
            commentRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<CommentDTO> getCommentChain(Long commentId) {
        List<CommentDTO> chain = new java.util.ArrayList<>();
        Long currentId = commentId;
        
        while (currentId != null) {
            final Long idToFind = currentId;
            Comment comment = commentRepository.findById(idToFind)
                    .orElseThrow(() -> new RuntimeException("Comment not found with id: " + idToFind));
            chain.add(convertToDTO(comment));
            currentId = comment.getNextComment() != null ? comment.getNextComment().getId() : null;
        }
        
        return chain;
    }

    private CommentDTO convertToDTO(Comment comment) {
        return new CommentDTO(
            comment.getId(),
            comment.getUser().getId(),
            comment.getUser().getName(),
            comment.getComment(),
            comment.getNextComment() != null ? comment.getNextComment().getId() : null,
            comment.getCreatedAt()
        );
    }
}
