import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';
import apiClient, { getCsrfToken } from '../utils/axiosConfig';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get CSRF cookie first
      await getCsrfToken();

      const res = await apiClient.post('/login', {
        username,
        password,
      });

      // Simpan token ke localStorage
      localStorage.setItem('access_token', res.data.access_token);

      // Simpan data user ke localStorage
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Redirect sesuai role
      // Redirect sesuai role
      if (res.data.user.role === 'osis') {
        navigate('/admin/dashboard');
      } else if (res.data.user.role === 'club_pengurus' && res.data.user.club_hash_id) {
        navigate(`/club/${res.data.user.club_hash_id}`);
      } else if (res.data.user.role === 'student' && res.data.user.student_hash_id) {
        navigate(`/student/${res.data.user.student_hash_id}`);
      } else if (res.data.user.role === 'mpk') {
        navigate(`/mpk/dashboard`);
      } else {
        alert('User tidak memiliki peran atau ID yang valid');
      }

    } catch (err) {
      console.error(err); // Lihat error lengkap di console

      // Cek apakah error dari API
      if (err.response?.status === 401 || err.response?.data?.message === 'Invalid credentials') {
        setError('Username atau password salah');
      } else {
        setError('Gagal login. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-cyan-200 via-sky-300 to-indigo-300 ">
      <div className="bg-blue-200 bg-opacity-70 p-6 px-8 rounded-lg shadow-md w-full max-w-sm mx-auto">
        <img src="/smealogo.png" alt="Logo" className="w-24 h-24 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-center mb-6">Login to Continue</h2>

        {/* Form Login */}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <TextField
              label="Username"
              fullWidth
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </div>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Loading...
              </>
            ) : (
              'LOGIN'
            )}
          </button>

        </form>
      </div>
    </div>
  );
}