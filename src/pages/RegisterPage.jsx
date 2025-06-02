import React, {useEffect, useState} from 'react';
import {
  TextField,
  MenuItem,
  Button,
  Paper,
  Typography,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import apiClient from '../utils/axiosConfig';

const classOptions = [
  'X AKL 1', 'X AKL 2', 'X AKL 3', 'X MPL 1', 'X MPL 2', 'X MPL 3',
  'X PM 1', 'X PM 2', 'X TLG 1', 'X TLG 2', 'X TJK 1', 'X TJK 2', 'X TJK 3',
  'X DKV 1', 'X DKV 2', 'X DKV 3', 'X PPL 1', 'X PPL 2', 'X TET',
  'X TKF 1', 'X TKF 2', 'X TKF 3', 'X TLM 1', 'X TLM 2',
  'XI AKL 1', 'XI AKL 2', 'XI AKL 3', 'XI MPL 1', 'XI MPL 2', 'XI MPL 3',
  'XI PM 1', 'XI PM 2', 'XI TLG 1', 'XI TLG 2', 'XI TJK 1', 'XI TJK 2', 'XI TJK 3',
  'XI DKV 1', 'XI DKV 2', 'XI DKV 3', 'XI PPL 1', 'XI PPL 2', 'XI TET',
  'XI TKF 1', 'XI TKF 2', 'XI TKF 3', 'XI TLM 1', 'XI TLM 2',
];

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: '',
    full_name: '',
    username: '',
    class: '',
    club_id: '',
    password: '',
    confirm_password: '',
  });
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await apiClient.get('/clubs');
        setClubs(res.data);
      } catch (err) {
        console.error('Error fetching clubs:', err);
        alert('Gagal memuat daftar ekskul');
      }
    };
    
    fetchClubs();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (form.password !== form.confirm_password) {
      return alert('Password dan konfirmasi password tidak cocok');
    }
    
    try {
      await apiClient.post('/register-siswa', form);
      alert('Registrasi berhasil! Silakan masuk.');
      window.location.href = '/';
    } catch (err) {
      console.error('Error during registration:', err);
      alert('Gagal registrasi, silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6 flex items-center justify-center">
      <Paper className="w-full max-w-md shadow-lg rounded-lg p-6">
        <Typography variant="h5" align="center" gutterBottom>
          Daftar Ekstrakurikuler
        </Typography>

        <TextField 
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
          margin="mb-4"
        />

        <TextField 
          label="Nama Lengkap"
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          fullWidth
          margin="mb-4"
        />

        <TextField 
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          fullWidth
          margin="mb-4"
        />
        <FormControl fullWidth margin="mb-4">
          <InputLabel>Kelas</InputLabel>
          <Select
            name="class"
            value={form.class}
            onChange={handleChange}
            label="Kelas"
          >
            {classOptions.map((kelas) => (
              <MenuItem key={kelas} value={kelas}>
                {kelas}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl fullWidth margin="mb-4">
          <InputLabel>Pilih Ekstrakurikuler</InputLabel>
          <Select
            name="club_id"
            value={form.club_id}
            onChange={handleChange}
            label="Pilih Ekstrakurikuler"
          >
            {clubs.map((club) => (
              <MenuItem key={club.id} value={club.id}>
                {club.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          fullWidth
          margin="mb-4"
        />
        <TextField
          label="Konfirmasi Password"
          type="password"
          name="confirm_password"
          value={form.confirm_password}
          onChange={handleChange}
          fullWidth
          margin="mb-4"/>

        <Button
          variant="contained"
          fullWidth
          color="primary"
          onClick={handleSubmit}>
          Daftar
        </Button>
      
      </Paper>
    </div>
  )
}