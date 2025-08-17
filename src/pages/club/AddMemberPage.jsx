import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  TextField,
  Button,
  MenuItem,
  Paper,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '@/utils/axiosConfig';

const kelasList = [
  'X AKL 1', 'X AKL 2', 'X AKL 3', 'X MPL 1', 'X MPL 2', 'X MPL 3',
  'X PM 1', 'X PM 2', 'X TLG 1', 'X TLG 2', 'X TJK 1', 'X TJK 2', 'X TJK 3',
  'X DKV 1', 'X DKV 2', 'X DKV 3', 'X PPL 1', 'X PPL 2', 'X TET',
  'X TKF 1', 'X TKF 2', 'X TKF 3', 'X TLM 1', 'X TLM 2',
  'XI AKL 1', 'XI AKL 2', 'XI AKL 3', 'XI MPL 1', 'XI MPL 2', 'XI MPL 3',
  'XI PM 1', 'XI PM 2', 'XI TLG 1', 'XI TLG 2', 'XI TJK 1', 'XI TJK 2', 'XI TJK 3',
  'XI DKV 1', 'XI DKV 2', 'XI DKV 3', 'XI PPL 1', 'XI PPL 2', 'XI TET',
  'XI TKF 1', 'XI TKF 2', 'XI TKF 3', 'XI TLM 1', 'XI TLM 2',
];

export default function AddMemberPage() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [nisn, setNisn] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [kelas, setKelas] = useState('');

  const handleBack = () => navigate(-1);

  const handleSubmit = async () => {
    try {
      await apiClient.post(`/clubs/${clubId}/members`, {
        nisn,
        name,
        class: kelas,
        phone,
      });
      alert('Anggota berhasil ditambahkan!');
      navigate(`/club/${clubId}/members`);
    } catch (error) {
      console.error('❌ Gagal tambah anggota:', error);
      alert('Gagal menambahkan anggota.');
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 px-4 py-6">
      {/* Navbar */}
      <AppBar
        position="static"
        color="inherit"
        style={{ boxShadow: 'none', border: '1px solid #97C1FF', borderRadius: 50 }}
      >
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleBack}>
            <ArrowBackIosNewIcon />
          </IconButton>
          <Typography variant="h6" component="div">
            Tambah Anggota
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Form */}
      <Paper
        elevation={3}
        className="mt-6 w-full max-w-md mx-auto p-4"
        sx={{ border: '1px solid #3b82f6', borderRadius: 3 }}
      >
        
        <Typography align="center" className="mb-4 text-lg font-semibold">
          Nama Ekstrakurikuler
        </Typography>

        <div className="space-y-4">
          <TextField
            label="NISN"
            variant="outlined"
            fullWidth
            value={nisn}
            onChange={(e) => setNisn(e.target.value)}
          />

          <TextField
            label="Nama Siswa"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            label="Nomo Wa/Telephone"
            variant="outlined"
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <TextField
            select
            label="Kelas"
            variant="outlined"
            fullWidth
            value={kelas}
            onChange={(e) => setKelas(e.target.value)}
          >
            {kelasList.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>
          

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      </Paper>

      <footer className="mt-10 text-center text-sm text-gray-600">
        © 2025 OSIS SMK NEGERI 1 GARUT
      </footer>
    </div>
  );
}
