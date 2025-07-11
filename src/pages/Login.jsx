import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient, { getCsrfToken } from '../utils/axiosConfig';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Mencegah reload halaman

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
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/smeab.jpg')" }}>
      <div className="bg-blue-200 bg-opacity-70 p-6 rounded-lg shadow-md w-full max-w-sm mx-auto">
        <img src="/smealogo.png" alt="Logo" className="w-24 h-24 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-center mb-6">Login to Continue</h2>

        {/* Form Login */}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
}