import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/axiosConfig';

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
      const res = await apiClient.post('/login', {
        username,
        password,
      });

      // Simpan token ke localStorage
      localStorage.setItem('access_token', res.data.access_token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

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
    <div className="min-h-screen bg-[#FFF4E0] flex flex-col items-center justify-center font-mono text-black selection:bg-pink-400 p-4">
      <div className="bg-cyan-300 border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-md relative">
        {/* Header Ribbon */}
        <div className="absolute -top-6 -right-6 bg-yellow-300 border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-3">
          <h1 className="font-black text-2xl uppercase tracking-widest">LOGIN</h1>
        </div>

        <img src="/smealogo.png" alt="Logo" className="w-24 h-24 mx-auto mb-6 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-2 rounded-full" />
        
        <h2 className="text-2xl font-black text-center mb-8 bg-white border-4 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-1">
          MASUK KE SISTEM
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="flex flex-col space-y-2">
            <label className="font-bold text-black uppercase">Username</label>
            <input 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full border-4 border-black p-3 bg-white font-bold outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px] transition-all"
            />
          </div>

          <div className="flex flex-col space-y-2 relative">
            <label className="font-bold text-black uppercase">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border-4 border-black p-3 bg-white font-bold outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px] transition-all pr-16"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 border-2 border-black bg-pink-400 text-black px-2 py-1 font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              >
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500 border-4 border-black text-white font-bold p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center animate-bounce">
              {error}
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-lime-400 text-black border-4 border-black py-4 px-6 font-black text-xl uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-lime-500 hover:shadow-none hover:translate-x-[8px] hover:translate-y-[8px] transition-all flex items-center justify-center gap-3 ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}
            >
              {isLoading ? 'LOADING...' : 'GAS LOGIN!'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}