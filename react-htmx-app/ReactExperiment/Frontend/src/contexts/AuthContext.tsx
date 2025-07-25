import { createContext } from 'react';
import { User, LoginRequest, RegisterRequest } from '../types/Auth';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (request: LoginRequest) => Promise<void>;
  register: (request: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);



