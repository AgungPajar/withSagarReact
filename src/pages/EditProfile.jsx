import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  TextField,
  Button,
  Avatar,
  Paper,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import apiClient, { STORAGE_URL } from '../utils/axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditProfile() {
  const navigate = useNavigate();
  const { clubId } = useParams(); // ambil dari URL
  const [club, setClub] = useState(null);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [password, setPassword] = useState('');
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    if (clubId) {
      fetchClub(clubId);
    }
  }, [clubId]);

  const fetchClub = async (hashId) => {
    try {
      const res = await apiClient.get(`/clubs/${hashId}`);
      const data = res.data;

      setClub(data);
      setUsername(data.username || '');
      setName(data.name || '');
      setDescription(data.description || '');

      // Set preview logo jika belum upload baru
      if (!logo && data.logo_path) {
        setLogoPreview(`${data.logo_path}`);
      } else if (!logo) {
        setLogoPreview('/logoeks.png');
      }
    } catch (err) {
      console.error('Gagal memuat data klub', err);
    }
  };

  const handleBack = () => navigate(-1);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file)); // preview lokal
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('name', name);
      formData.append('description', description);
      if (password) formData.append('password', password);
      if (logo) formData.append('logo', logo);

      await apiClient.post('/profile/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Profil berhasil diperbarui');
      fetchClub(clubId); // ambil ulang data setelah update (tanpa reload)
    } catch (err) {
      console.error('Gagal update profil:', err);
      if (err.response) {
        console.error('Respon:', err.response.data);
        alert(`Gagal memperbarui profil: ${err.response.data.message || 'Terjadi kesalahan'}`);
      } else {
        alert('Gagal memperbarui profil: Tidak ada respon dari server');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-white text-gray-800 p-6">
      {/* Navbar */}
      <AppBar
        position="static"
        color="inherit"
        style={{
          boxShadow: 'none',
          border: '1px solid #97C1FF',
          borderRadius: '50px',
        }}
        className="bg-white"
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <IconButton edge="start" color="inherit" onClick={handleBack}>
            <ArrowBackIosNewIcon />
          </IconButton>
          <Typography variant="body1" component="div">
            {club ? club.name : 'memuat...'}
          </Typography>
          <div></div>
        </Toolbar>
      </AppBar>

      <Paper className="p-6 mt-10 w-full max-w-md">
        <Typography variant="h6" className="mb-4 text-center">
          Edit Profil
        </Typography>

        <div className="flex flex-col items-center mb-4">
          <Avatar
            src={logoPreview || '/logoeks.png'}
            sx={{ width: 100, height: 100, mb: 2 }}
          />
          <Button variant="outlined" component="label">
            UBAH LOGO
            <input hidden accept="image/*" type="file" onChange={handleLogoChange} />
          </Button>
        </div>

        <TextField
          label="Username"
          fullWidth
          className="mb-4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
        />

        <TextField
          label="Nama"
          fullWidth
          className="mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
        />

        <TextField
          label="Deskripsi"
          fullWidth
          className="mb-4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
        />

        <TextField
          label="Password"
          fullWidth
          type="password"
          className="mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />

        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
          Simpan Perubahan
        </Button>
      </Paper>

      <footer className="mt-10 text-center text-sm text-gray-600">
        © 2025 OSIS SMK NEGERI 1 GARUT
      </footer>
    </div>
  );
}
