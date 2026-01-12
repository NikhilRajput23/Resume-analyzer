import api from './api';

// Auth API service - ready to connect to Spring Boot backend
// Currently uses mock data, will work with real backend when available

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
  };
}

export const authService = {
  // Login user and get JWT token
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  // Register new user
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  // Validate current token
  validateToken: async (): Promise<AuthResponse['user']> => {
    const response = await api.get<AuthResponse['user']>('/auth/validate');
    return response.data;
  },

  // Refresh token
  refreshToken: async (): Promise<{ token: string }> => {
    const response = await api.post<{ token: string }>('/auth/refresh');
    return response.data;
  },
};
