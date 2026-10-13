package com.expense.service;

import com.expense.entity.Expense;
import com.expense.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service layer containing the business logic for managing expenses.
 * Supports filtering expenses per user so distinct users have distinct expenditures.
 */
@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    // Constructor injection
    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    /**
     * Get expenses for a specific user, ordered by date descending.
     * If userId is null, returns all expenses.
     */
    public List<Expense> getExpenses(Long userId, String search) {
        if (userId != null) {
            if (search != null && !search.trim().isEmpty()) {
                return expenseRepository.findByUserIdAndTitleContainingIgnoreCase(userId, search.trim());
            }
            return expenseRepository.findByUserIdOrderByExpenseDateDesc(userId);
        }

        // Fallback for global search / all expenses
        if (search != null && !search.trim().isEmpty()) {
            return expenseRepository.findByTitleContainingIgnoreCase(search.trim());
        }
        return expenseRepository.findAllByOrderByExpenseDateDesc();
    }

    /**
     * Get a single expense by ID.
     */
    public Optional<Expense> getExpenseById(Long id) {
        return expenseRepository.findById(id);
    }

    /**
     * Create and save a new expense with associated userId.
     */
    public Expense createExpense(Expense expense) {
        expense.setId(null);
        // Default to user 1 if not specified
        if (expense.getUserId() == null) {
            expense.setUserId(1L);
        }
        return expenseRepository.save(expense);
    }

    /**
     * Update an existing expense by its ID.
     */
    public Optional<Expense> updateExpense(Long id, Expense updatedExpense) {
        return expenseRepository.findById(id).map(existingExpense -> {
            existingExpense.setTitle(updatedExpense.getTitle());
            existingExpense.setAmount(updatedExpense.getAmount());
            existingExpense.setCategory(updatedExpense.getCategory());
            existingExpense.setExpenseDate(updatedExpense.getExpenseDate());
            existingExpense.setPaymentMethod(updatedExpense.getPaymentMethod());
            existingExpense.setNotes(updatedExpense.getNotes());
            if (updatedExpense.getUserId() != null) {
                existingExpense.setUserId(updatedExpense.getUserId());
            }
            return expenseRepository.save(existingExpense);
        });
    }

    /**
     * Delete an expense by its ID.
     */
    public boolean deleteExpense(Long id) {
        if (expenseRepository.existsById(id)) {
            expenseRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
