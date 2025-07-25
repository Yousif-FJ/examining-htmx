import React from 'react';
import { useAuth } from '../hooks/useAuthUser';

const UserHeader: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded">
      <div>
        <span className="text-muted">Welcome, </span>
        <strong>{user.firstName} {user.lastName}</strong>
        <small className="text-muted d-block">{user.email}</small>
      </div>
      <button 
        className="btn btn-outline-secondary btn-sm"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default UserHeader;
