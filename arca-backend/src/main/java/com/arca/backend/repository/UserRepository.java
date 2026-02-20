package com.arca.backend.repository;

import com.arca.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByContactEmail(String email);
    boolean existsByContactEmail(String email);
}
