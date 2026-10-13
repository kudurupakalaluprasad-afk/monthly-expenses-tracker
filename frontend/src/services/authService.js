import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const authClient = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Service for handling User Authentication (Login & Registration).
 */
export const authService = {
  /**
   * Log in an existing user with username and plain-text password.
   * POST /api/auth/login
   */
  login: async (username, password) => {
    const response = await authClient.post('/login', {
      username: username.trim(),
      password: password.trim(),
    });
    return response.data;
  },

  /**
   * Register a new user.
   * POST /api/auth/register
   */
  register: async (userData) => {
    const response = await authClient.post('/register', userData);
    return response.data;
  },

  /**
   * Get the currently saved user from localStorage.
   */
  getCurrentUser: () => {
    try {
      const stored = localStorage.getItem('expense_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  /**
   * Save the current user to localStorage upon login.
   */
  setCurrentUser: (user) => {
    localStorage.setItem('expense_user', JSON.stringify(user));
  },

  /**
   * Clear user session on logout.
   */
  logout: () => {
    localStorage.removeItem('expense_user');
  },
};

export default authService;
