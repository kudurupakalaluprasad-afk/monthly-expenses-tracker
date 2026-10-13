package com.expense.repository;

import com.expense.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data JPA Repository for User Entity
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find a user by their unique username
    Optional<User> findByUsername(String username);

    // Check if a username is already taken
    boolean existsByUsername(String username);
}
