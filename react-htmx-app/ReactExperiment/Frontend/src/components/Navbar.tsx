import React from 'react';
import { useAuth } from '../hooks/useAuthUser';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="navbar navbar-expand-sm navbar-light bg-light border-bottom mb-3">
      <div className="container">
        <span className="navbar-brand mb-0 h1">React Experiment</span>
        <div className="navbar-nav ms-auto">
          {user && (
            <div className="d-flex align-items-center">
              <span className="navbar-text me-3">
                Welcome, <strong>{user.email}</strong>
              </span>
              <button 
                className="btn btn-outline-secondary btn-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
