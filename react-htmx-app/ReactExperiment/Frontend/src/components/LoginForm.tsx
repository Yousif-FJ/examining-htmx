import React, { useState } from 'react';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSwitchToRegister: () => void;
  loading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onSwitchToRegister, loading = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="h4 mb-4 text-center">Sign In</h2>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          type="email"
          className="form-control"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="password" className="form-label">Password</label>
        <input
          type="password"
          className="form-control"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
        />
      </div>
      
      <button 
        type="submit" 
        className="btn btn-primary w-100 mb-3"
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Signing In...
          </>
        ) : (
          'Sign In'
        )}
      </button>
      
      <div className="text-center">
        <span className="text-muted">Don't have an account? </span>
        <button 
          type="button" 
          className="btn btn-link p-0"
          onClick={onSwitchToRegister}
          disabled={loading}
        >
          Sign Up
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
