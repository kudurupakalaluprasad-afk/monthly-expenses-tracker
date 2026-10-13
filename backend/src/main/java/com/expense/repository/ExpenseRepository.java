package com.expense.repository;

import com.expense.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA Repository for the Expense entity.
 * Supports filtering expenses by user ID so distinct users have distinct expenditures.
 */
@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    // Retrieve all expenses for a specific user, sorted by date descending (latest first)
    List<Expense> findByUserIdOrderByExpenseDateDesc(Long userId);

    // Search a specific user's expenses by title (case-insensitive)
    List<Expense> findByUserIdAndTitleContainingIgnoreCase(Long userId, String title);

    // Retrieve all expenses across all users (admin / fallback)
    List<Expense> findAllByOrderByExpenseDateDesc();

    // Global title search (fallback)
    List<Expense> findByTitleContainingIgnoreCase(String title);
}
