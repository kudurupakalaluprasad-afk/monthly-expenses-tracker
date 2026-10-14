package com.expense.controller;

import com.expense.entity.Expense;
import com.expense.service.ExpenseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller exposing CRUD endpoints for Expense management.
 * Base path: /api/expenses
 * 
 * Supports user-specific filtering so distinct users have distinct expenditures.
 * CORS is enabled for Vite development server (http://localhost:5173).
 */
@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = {
    "https://monthly-expenses-tracker-swart.vercel.app"
})
public class ExpenseController {

    private final ExpenseService expenseService;

    // Constructor injection
    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    /**
     * GET /api/expenses?userId=1&search=grocery
     * Retrieves expenses for a specific user (or all if userId is omitted),
     * with optional search filtering by title.
     */
    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String search) {
        List<Expense> expenses = expenseService.getExpenses(userId, search);
        return ResponseEntity.ok(expenses);
    }

    /**
     * GET /api/expenses/{id}
     * Retrieves a single expense by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Expense> getExpenseById(@PathVariable Long id) {
        return expenseService.getExpenseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/expenses
     * Creates a new expense associated with the specified user.
     */
    @PostMapping
    public ResponseEntity<Expense> createExpense(@RequestBody Expense expense) {
        Expense createdExpense = expenseService.createExpense(expense);
        return new ResponseEntity<>(createdExpense, HttpStatus.CREATED);
    }

    /**
     * PUT /api/expenses/{id}
     * Updates an existing expense.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable Long id, @RequestBody Expense expense) {
        return expenseService.updateExpense(id, expense)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * DELETE /api/expenses/{id}
     * Deletes an expense by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        boolean deleted = expenseService.deleteExpense(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
