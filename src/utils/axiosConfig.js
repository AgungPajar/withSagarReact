
import axios from 'axios';

export const API_BASE_URL = 'https://coba.smknegeri1garut.sch.id'; 
// export const API_BASE_URL = 'http://127.0.0.1:8000'; 
export const STORAGE_URL = `${API_BASE_URL}/storage`;

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true, // Changed to true to allow cookies
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Function to get CSRF cookie
export const getCsrfToken = () => {
  return axios.get(`${API_BASE_URL}/sanctum/csrf-cookie`, {
    withCredentials: true
  });
};

apiClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Get CSRF token from cookie
  const xsrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];

  if (xsrfToken) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;
