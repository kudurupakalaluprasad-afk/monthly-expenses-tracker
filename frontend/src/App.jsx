import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';
import authService from './services/authService';

/**
 * Root Application Component
 * Manages user authentication state and routes between AuthPage and Dashboard.
 */
function App() {
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return <Dashboard currentUser={currentUser} onLogout={handleLogout} />;
}

export default App;
