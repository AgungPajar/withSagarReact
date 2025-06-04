
import axios from 'axios';

export const API_BASE_URL = 'http://localhost:8000'; // Ganti dengan base URL Railway kalau production
export const STORAGE_URL = `${API_BASE_URL}/storage`;

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: false,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;
