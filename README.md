# 💰 Monthly Expense Tracker (Full-Stack)

A clean, beginner-friendly full-stack **Monthly Expense Tracker** web application built with **React + Vite** on the frontend, **Spring Boot 3 (Java)** on the backend, and **MySQL** for persistent database storage.

Features **User Authentication (Login & Register)** with **distinct expenditures per user**, **Daily Expense Trend visualization**, and a **Circular Donut Visual** calculating total usage and percentage breakdown for every type of transaction (by Category and Payment Method).

---

## 📁 Project Structure

```text
monthly-expense-tracker/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx                      # Top navbar with user profile & logout
│   │   │   ├── ExpenseForm.jsx                 # Reusable form for Adding & Editing expenses
│   │   │   ├── ExpenseList.jsx                 # Table view with search, edit, delete actions
│   │   │   ├── DailyExpenseChart.jsx           # Visualization of spending for every day
│   │   │   └── TransactionDistributionChart.jsx# Circular donut visual calculating type usage
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx                   # User dashboard with summary cards & visuals
│   │   │   └── AuthPage.jsx                    # Login & Register page with demo user buttons
│   │   ├── services/
│   │   │   ├── expenseService.js               # Centralized Axios client for user expenses
│   │   │   └── authService.js                  # Axios client for Login & Registration
│   │   ├── App.jsx                             # Auth routing between AuthPage & Dashboard
│   │   ├── main.jsx                            # React root renderer
│   │   └── index.css                           # Professional CSS design system (preserved UI)
│   ├── .env                                    # Frontend environment variables (API URL)
│   ├── index.html                              # HTML entry point with Inter typography
│   └── package.json                            # Dependencies (React, Axios, Lucide)
│
├── backend/
│   ├── src/main/java/com/expense/
│   │   ├── ExpenseTrackerApplication.java      # Spring Boot main application entry
│   │   ├── entity/
│   │   │   ├── User.java                       # User entity (password without hashing)
│   │   │   └── Expense.java                    # Expense entity with user_id mapping
│   │   ├── dto/
│   │   │   ├── LoginRequest.java               # DTO for user login
│   │   │   ├── RegisterRequest.java            # DTO for user registration
│   │   │   └── AuthResponse.java               # DTO returned on login/register
│   │   ├── repository/
│   │   │   ├── UserRepository.java             # JPA repository for users
│   │   │   └── ExpenseRepository.java          # JPA repository with user-scoped queries
│   │   ├── service/
│   │   │   ├── UserService.java                # Authentication logic (no hashing)
│   │   │   └── ExpenseService.java             # Business logic layer with constructor injection
│   │   └── controller/
│   │       ├── AuthController.java             # REST API for /api/auth (register, login)
│   │       └── ExpenseController.java          # REST API for /api/expenses with userId filter
│   ├── src/main/resources/
│   │   └── application.properties              # MySQL datasource and Hibernate configuration
│   └── pom.xml                                 # Maven project definition and dependencies
│
├── database/
│   └── schema.sql                              # MySQL setup (users + user-scoped expenses)
└── README.md                                   # Comprehensive documentation
```

---

## 👥 Multi-User Support (Distinct Expenditures)

Every user has their own distinct records and visualizations:
- When **Alex** logs in, only Alex's expenses and statistics appear.
- When **Jordan** logs in, only Jordan's expenses and statistics appear.
- When a new user **registers**, they start with a clean account and manage their own expenses.

### 🔑 Pre-Seeded Demo Accounts (Stored without hashing as requested)

| Username | Password | Full Name | Seeded Records |
| :--- | :--- | :--- | :--- |
| `alex` | `123456` | Alex Rivera | 6 expenses (Groceries, Utilities, Metro, etc.) |
| `jordan` | `123456` | Jordan Smith | 4 expenses (Rent, Gym, Books, Dinner) |

You can also click the quick demo buttons on the login page to sign in with one click.

---

## 📊 Visualizations

1. **Daily Spending Trend (`DailyExpenseChart.jsx`)**:
   - Visualizes spending for every recorded day with vertical bars.
   - Highlights the **Peak Spending Day**, **Daily Average**, and active days count.
   - Interactive hover cards showing date, amount, and transaction count.

2. **Circular Donut Visual (`TransactionDistributionChart.jsx`)**:
   - Displays a clean SVG donut ring chart.
   - Calculates **total usage** and **percentage breakdown** for every type of transaction.
   - Toggle seamlessly between **By Category** (Food, Utilities, Housing, etc.) and **By Payment Method** (Credit Card, UPI, Debit Card, Cash).
   - Side breakdown legend displaying the color dot, type name, transaction count, usage amount, and percentage pill.

---

## 🚀 Running the Application

Both servers are currently active:

### 1. Spring Boot Backend
- URL: `http://localhost:8080`
- To run from terminal:
  ```powershell
  cd backend
  mvn spring-boot:run
  ```
- Or import into **Eclipse / Spring Tool Suite** via **File ➔ Import ➔ Existing Maven Projects**.

### 2. React + Vite Frontend
- URL: `http://localhost:5173`
- To run from terminal:
  ```powershell
  cd frontend
  npm run dev
  ```

---

## 📡 REST API Reference

### Authentication Endpoints (`/api/auth`)
- `POST /api/auth/register` — Register a new account (`username`, `password`, `fullName`, `email`)
- `POST /api/auth/login` — Sign in with plain-text credentials (`username`, `password`)

### Expense Endpoints (`/api/expenses`)
- `GET /api/expenses?userId={id}` — Get expenses for a specific user
- `GET /api/expenses/{id}` — Get single expense
- `POST /api/expenses` — Create expense (scoped to `userId`)
- `PUT /api/expenses/{id}` — Update expense
- `DELETE /api/expenses/{id}` — Delete expense
