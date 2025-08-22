import { LoginRequest, RegisterRequest, AuthResponse } from '../types/Auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5116/api';

class AuthApiService {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `API Error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = await response.text() || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    return response.json();
  }

  async register(request: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for cookie authentication
      body: JSON.stringify(request),
    });
    return this.handleResponse<AuthResponse>(response);
  }

  async login(request: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for cookie authentication
      body: JSON.stringify(request),
    });
    return this.handleResponse<AuthResponse>(response);
  }

  async logout(): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include', // Important for cookie authentication
    });
    return this.handleResponse<AuthResponse>(response);
  }

  async getCurrentUser(): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      credentials: 'include', // Important for cookie authentication
    });
    return this.handleResponse<AuthResponse>(response);
  }
}

export const authApi = new AuthApiService();
