
import axios from 'axios';

export const API_BASE_URL = process.env.REACT_APP_API_URL 
  ? process.env.REACT_APP_API_URL.replace(/\/api$/, '') 
  : 'http://localhost:8000';
export const STORAGE_URL = `${API_BASE_URL}/storage`;

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Accept': 'application/json',
    // 'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;
