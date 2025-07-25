import { useState, useEffect } from "react";
import { authApi } from "../services/authApi";
import { User, LoginRequest, RegisterRequest } from "../types/Auth";
import { AuthContextType, AuthContext } from "./AuthContext";


interface AuthProviderProps {
  children: React.ReactNode;
}


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await authApi.getCurrentUser();
      if (response.success && response.user) {
        setUser(response.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (request: LoginRequest) => {
    const response = await authApi.login(request);
    if (response.success && response.user) {
      setUser(response.user);
    } else {
      throw new Error(response.message || 'Login failed');
    }
  };

  const register = async (request: RegisterRequest) => {
    const response = await authApi.register(request);
    if (response.success && response.user) {
      setUser(response.user);
    } else {
      throw new Error(response.message || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
    } catch {
      // Even if logout fails on server, clear local user state
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
