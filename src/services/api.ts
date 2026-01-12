import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Base API URL - change this to your Spring Boot backend URL
const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token to all requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('resume_analyzer_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem('resume_analyzer_token');
      localStorage.removeItem('resume_analyzer_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
