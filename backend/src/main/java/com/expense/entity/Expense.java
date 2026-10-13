package com.expense.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * JPA Entity representing an individual Expense record.
 * Maps to the 'expenses' table in MySQL.
 * Includes userId so distinct users have distinct expenditures.
 */
@Entity
@Table(name = "expenses")
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false)
    private String category;

    @Column(name = "expense_date", nullable = false)
    private LocalDate expenseDate;

    @Column(name = "payment_method", nullable = false)
    private String paymentMethod;

    @Column(columnDefinition = "TEXT")
    private String notes;

    // Default no-argument constructor required by JPA
    public Expense() {
    }

    // Parameterized constructor
    public Expense(Long id, Long userId, String title, BigDecimal amount, String category, 
                   LocalDate expenseDate, String paymentMethod, String notes) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.amount = amount;
        this.category = category;
        this.expenseDate = expenseDate;
        this.paymentMethod = paymentMethod;
        this.notes = notes;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public LocalDate getExpenseDate() {
        return expenseDate;
    }

    public void setExpenseDate(LocalDate expenseDate) {
        this.expenseDate = expenseDate;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    @Override
    public String toString() {
        return "Expense{" +
                "id=" + id +
                ", userId=" + userId +
                ", title='" + title + '\'' +
                ", amount=" + amount +
                ", category='" + category + '\'' +
                ", expenseDate=" + expenseDate +
                ", paymentMethod='" + paymentMethod + '\'' +
                ", notes='" + notes + '\'' +
                '}';
    }
}
