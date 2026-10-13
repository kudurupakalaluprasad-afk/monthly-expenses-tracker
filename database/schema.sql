-- ========================================================
-- Monthly Expense Tracker - Database Setup Script
-- With User Management & Multi-User Support
-- ========================================================

-- Step 1: Create the database if it doesn't already exist
CREATE DATABASE IF NOT EXISTS expensetracker;
USE expensetracker;

-- Step 2: Create the 'users' table
-- Passwords stored without hashing as requested for beginner learning/inspection
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(150),
    email VARCHAR(150)
);

-- Step 3: Create the 'expenses' table with 'user_id' reference
CREATE TABLE IF NOT EXISTS expenses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    expense_date DATE NOT NULL,
    payment_method VARCHAR(100) NOT NULL,
    notes TEXT,
    CONSTRAINT fk_expenses_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Step 4: Seed sample users (passwords stored without hashing)
INSERT INTO users (id, username, password, full_name, email) VALUES
(1, 'alex', '123456', 'Alex Rivera', 'alex@example.com'),
(2, 'jordan', '123456', 'Jordan Smith', 'jordan@example.com')
ON DUPLICATE KEY UPDATE 
    password=VALUES(password), 
    full_name=VALUES(full_name), 
    email=VALUES(email);

-- Step 5: Seed sample expenses for Alex (user_id = 1) across multiple months
INSERT INTO expenses (id, user_id, title, amount, category, expense_date, payment_method, notes) VALUES
(1, 1, 'Grocery Shopping', 125.50, 'Food & Dining', '2026-10-02', 'Credit Card', 'Weekly supermarket groceries'),
(2, 1, 'Electric Bill', 85.00, 'Utilities', '2026-10-05', 'UPI / Bank Transfer', 'Electricity bill for September'),
(3, 1, 'Metro Monthly Pass', 45.00, 'Transportation', '2026-10-06', 'Debit Card', 'Subway / Metro transit pass'),
(4, 1, 'Internet Subscription', 60.00, 'Utilities', '2026-10-08', 'Credit Card', 'High-speed broadband fiber'),
(5, 1, 'Movie & Snacks', 32.75, 'Entertainment', '2026-10-10', 'Cash', 'Weekend movie outing with friends'),
(6, 1, 'Coffee & Pastry', 9.50, 'Food & Dining', '2026-10-12', 'Cash', 'Morning cafe work session'),
-- Past month: September 2026
(7, 1, 'Supermarket Stockup', 145.20, 'Food & Dining', '2026-09-08', 'Credit Card', 'Monthly bulk groceries'),
(8, 1, 'Water & Gas Utility', 52.00, 'Utilities', '2026-09-15', 'Debit Card', 'Quarterly water utility bill'),
(9, 1, 'Software License', 29.99, 'Education', '2026-09-22', 'Credit Card', 'Developer tools annual sub'),
-- Past month: August 2026
(10, 1, 'Office Supplies', 68.40, 'Shopping', '2026-08-14', 'Credit Card', 'Desk lamp and notebooks'),
(11, 1, 'Dining Out with Family', 88.00, 'Food & Dining', '2026-08-27', 'Cash', 'Weekend family dinner')
ON DUPLICATE KEY UPDATE 
    user_id=VALUES(user_id),
    title=VALUES(title),
    amount=VALUES(amount),
    category=VALUES(category),
    expense_date=VALUES(expense_date),
    payment_method=VALUES(payment_method),
    notes=VALUES(notes);

-- Step 6: Seed sample expenses for Jordan (user_id = 2) - distinct expenditure
INSERT INTO expenses (id, user_id, title, amount, category, expense_date, payment_method, notes) VALUES
(12, 2, 'Apartment Rent', 750.00, 'Housing & Rent', '2026-10-01', 'UPI / Bank Transfer', 'Monthly room rental'),
(13, 2, 'Gym Membership', 40.00, 'Healthcare & Medical', '2026-10-03', 'Credit Card', 'Fitness center monthly fee'),
(14, 2, 'Bookstore Purchase', 28.50, 'Education', '2026-10-07', 'Debit Card', 'Programming algorithms book'),
(15, 2, 'Dinner with Colleagues', 54.00, 'Food & Dining', '2026-10-11', 'Credit Card', 'Team team dinner'),
-- Past month: September 2026
(16, 2, 'Apartment Rent', 750.00, 'Housing & Rent', '2026-09-01', 'UPI / Bank Transfer', 'Monthly room rental'),
(17, 2, 'Concert Ticket', 85.00, 'Entertainment', '2026-09-18', 'Debit Card', 'Music festival pass')
ON DUPLICATE KEY UPDATE 
    user_id=VALUES(user_id),
    title=VALUES(title),
    amount=VALUES(amount),
    category=VALUES(category),
    expense_date=VALUES(expense_date),
    payment_method=VALUES(payment_method),
    notes=VALUES(notes);

