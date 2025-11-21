import axios from 'axios';

/**
 * Cliente HTTP configurado para comunicação com a API do backend.
 * 
 * Características:
 * - Base URL configurada via variável de ambiente VITE_API_URL
 * - Interceptor que injeta automaticamente o token JWT do localStorage
 * - Header Authorization: Bearer <token> adicionado em todas as requisições
 */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token de autenticação em todas as requisições
api.interceptors.request.use(
  (config) => {
    // Busca o token do localStorage
    const token = localStorage.getItem('auth_token');
    
    // Se existir token, adiciona o header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de respostas (opcional, para lidar com erros de autenticação)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se receber 401 (Unauthorized), pode limpar o token e redirecionar para login
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      // Opcional: redirecionar para página de login
      // window.location.href = '/auth';
    }
    
    return Promise.reject(error);
  }
);

export default api;
