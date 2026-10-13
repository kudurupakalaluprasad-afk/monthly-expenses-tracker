import React, { useState } from 'react';
import authService from '../services/authService';
import { WalletCards, LogIn, UserPlus, AlertCircle, CheckCircle, ArrowRight, UserCheck } from 'lucide-react';

/**
 * AuthPage Component
 * Provides clean, tabbed Login and Registration interfaces for users.
 * Features quick-fill demo buttons to immediately test distinct user expenditures.
 */
function AuthPage({ onAuthSuccess }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.username.trim()) {
      setErrorMessage('Please enter your username.');
      return;
    }
    if (!formData.password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      if (isRegisterMode) {
        // Register flow
        const registeredUser = await authService.register({
          username: formData.username.trim(),
          password: formData.password,
          fullName: formData.fullName.trim() || formData.username.trim(),
          email: formData.email.trim(),
        });
        setSuccessMessage('Account created successfully! Logging you in...');
        authService.setCurrentUser(registeredUser);
        setTimeout(() => {
          onAuthSuccess(registeredUser);
        }, 800);
      } else {
        // Login flow
        const user = await authService.login(formData.username.trim(), formData.password);
        authService.setCurrentUser(user);
        onAuthSuccess(user);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      const backendError = error.response?.data?.error;
      setErrorMessage(
        backendError ||
        (isRegisterMode
          ? 'Registration failed. The username might already exist.'
          : 'Invalid username or password. Please verify your credentials.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Quick fill helper for demo accounts
  const handleQuickDemoLogin = async (username, password) => {
    setFormData({
      username,
      password,
      fullName: '',
      email: '',
    });
    setErrorMessage('');
    setIsLoading(true);
    try {
      const user = await authService.login(username, password);
      authService.setCurrentUser(user);
      onAuthSuccess(user);
    } catch (error) {
      console.error('Quick login error:', error);
      setErrorMessage('Failed to connect to backend. Please ensure the Spring Boot server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        {/* Brand Header */}
        <div className="auth-brand-header">
          <div className="navbar-icon-wrapper auth-logo-icon">
            <WalletCards size={28} />
          </div>
          <h1 className="auth-main-title">Expense Tracker</h1>
          <p className="auth-tagline">
            Manage your personal budget, daily transactions, and category metrics
          </p>
        </div>

        {/* Auth Card */}
        <div className="card auth-card">
          {/* Tabs: Sign In vs Register */}
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${!isRegisterMode ? 'active' : ''}`}
              onClick={() => {
                setIsRegisterMode(false);
                setErrorMessage('');
              }}
            >
              <LogIn size={16} /> Sign In
            </button>
            <button
              type="button"
              className={`auth-tab ${isRegisterMode ? 'active' : ''}`}
              onClick={() => {
                setIsRegisterMode(true);
                setErrorMessage('');
              }}
            >
              <UserPlus size={16} /> Create Account
            </button>
          </div>

          <div className="auth-body">
            {/* Feedback Alerts */}
            {errorMessage && (
              <div className="alert alert-error" role="alert">
                <AlertCircle size={18} />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="alert alert-success" role="alert">
                <CheckCircle size={18} />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              {/* Full Name (Only on Registration) */}
              {isRegisterMode && (
                <div className="form-group">
                  <label htmlFor="fullName" className="form-label">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Alex Rivera"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>
              )}

              {/* Username */}
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Username <span className="required">*</span>
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  className="form-input"
                  placeholder="e.g. alex"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email (Optional on Registration) */}
              {isRegisterMode && (
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address (Optional)
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-input"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              )}

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password <span className="required">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className="form-input"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={isLoading}
              >
                {isLoading ? (
                  'Processing...'
                ) : isRegisterMode ? (
                  <>
                    <UserPlus size={18} /> Create Account
                  </>
                ) : (
                  <>
                    <LogIn size={18} /> Sign In <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Login Shortcuts */}
            <div className="demo-accounts-section">
              <div className="demo-divider">
                <span>Quick Demo Accounts</span>
              </div>
              <div className="demo-buttons-grid">
                <button
                  type="button"
                  className="demo-user-btn"
                  onClick={() => handleQuickDemoLogin('alex', '123456')}
                  disabled={isLoading}
                >
                  <UserCheck size={16} className="text-blue" />
                  <div>
                    <strong>Alex Rivera</strong>
                    <span className="demo-subtitle">alex / 123456</span>
                  </div>
                </button>
                <button
                  type="button"
                  className="demo-user-btn"
                  onClick={() => handleQuickDemoLogin('jordan', '123456')}
                  disabled={isLoading}
                >
                  <UserCheck size={16} className="text-purple" />
                  <div>
                    <strong>Jordan Smith</strong>
                    <span className="demo-subtitle">jordan / 123456</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AuthPage;
