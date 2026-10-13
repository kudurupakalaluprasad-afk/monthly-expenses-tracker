import axios from 'axios';

// Retrieve backend API base URL from Vite environment variables, falling back to local port 8080
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Create an Axios instance with standard configurations
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/expenses`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Service object containing all HTTP request operations for Expenses.
 * Supports distinct users via userId query parameter.
 */
export const expenseService = {
  /**
   * Fetch expenses for a specific user.
   * GET /api/expenses?userId=1&search=coffee
   */
  getAllExpenses: async (userId = null, search = '') => {
    const params = {};
    if (userId) params.userId = userId;
    if (search && search.trim()) params.search = search.trim();

    const response = await apiClient.get('', { params });
    return response.data;
  },

  /**
   * Fetch a single expense by ID.
   * GET /api/expenses/{id}
   */
  getExpenseById: async (id) => {
    const response = await apiClient.get(`/${id}`);
    return response.data;
  },

  /**
   * Create a new expense.
   * POST /api/expenses
   */
  createExpense: async (expenseData) => {
    const response = await apiClient.post('', expenseData);
    return response.data;
  },

  /**
   * Update an existing expense by ID.
   * PUT /api/expenses/{id}
   */
  updateExpense: async (id, expenseData) => {
    const response = await apiClient.put(`/${id}`, expenseData);
    return response.data;
  },

  /**
   * Delete an expense by ID.
   * DELETE /api/expenses/{id}
   */
  deleteExpense: async (id) => {
    const response = await apiClient.delete(`/${id}`);
    return response.data;
  },
};

export default expenseService;
