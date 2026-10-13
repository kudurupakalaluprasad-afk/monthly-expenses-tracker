import React from 'react';
import { WalletCards, LogOut, User } from 'lucide-react';

/**
 * Navbar Component
 * Renders the top brand header, authenticated user profile pill, and logout button.
 */
function Navbar({ currentUser, onLogout }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="navbar-icon-wrapper">
            <WalletCards size={22} className="brand-icon" />
          </div>
          <div>
            <h1 className="navbar-title">Expense Tracker</h1>
          </div>
        </div>

        {/* User status & Logout button */}
        {currentUser && (
          <div className="navbar-user-section">
            <div className="user-profile-badge" title={`Logged in as ${currentUser.username}`}>
              <div className="user-avatar-circle">
                <User size={16} />
              </div>
              <div className="user-details-text">
                <span className="user-display-name">{currentUser.fullName || currentUser.username}</span>
                <span className="user-handle text-muted">@{currentUser.username}</span>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-sm btn-outline btn-logout"
              onClick={onLogout}
              title="Sign out of your account"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
