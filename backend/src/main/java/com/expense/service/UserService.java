package com.expense.service;

import com.expense.dto.AuthResponse;
import com.expense.dto.LoginRequest;
import com.expense.dto.RegisterRequest;
import com.expense.entity.User;
import com.expense.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Service managing User Authentication and Registration.
 * In accordance with project requirements, passwords are stored directly without hashing
 * for simplicity and easy inspection by beginners.
 */
@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Register a new user. Stores password directly without hashing.
     */
    public AuthResponse register(RegisterRequest request) {
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be empty");
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be empty");
        }

        String username = request.getUsername().trim().toLowerCase();

        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username '" + username + "' is already taken");
        }

        User newUser = new User();
        newUser.setUsername(username);
        // Stored without hashing as requested
        newUser.setPassword(request.getPassword().trim());
        newUser.setFullName(request.getFullName() != null ? request.getFullName().trim() : username);
        newUser.setEmail(request.getEmail() != null ? request.getEmail().trim() : "");

        User savedUser = userRepository.save(newUser);

        return new AuthResponse(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                "Registration successful"
        );
    }

    /**
     * Authenticate an existing user by comparing plain-text credentials.
     */
    public AuthResponse login(LoginRequest request) {
        if (request.getUsername() == null || request.getPassword() == null) {
            throw new IllegalArgumentException("Username and password are required");
        }

        String username = request.getUsername().trim().toLowerCase();
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("User not found with username '" + username + "'");
        }

        User user = userOptional.get();

        // Direct plain-text comparison (no hashing)
        if (!user.getPassword().equals(request.getPassword().trim())) {
            throw new IllegalArgumentException("Incorrect password");
        }

        return new AuthResponse(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getEmail(),
                "Login successful"
        );
    }

    /**
     * Find a user by their ID.
     */
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
}
