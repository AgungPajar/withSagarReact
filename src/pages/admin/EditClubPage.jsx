import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppBar,Toolbar, IconButton,InputAdornment, TextField, Button, Typography, Paper } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import apiClient, { STORAGE_URL } from '../../utils/axiosConfig';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function EditClubPage() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleBack = () => navigate(-1);
  
  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const [form, setForm] = useState({
    name: '',
    description: '',
    logo: null,
    username: '',
    password: '',
  });
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const res = await apiClient.get(`/clubs/${clubId}`);
        setForm((prev) => ({
          ...prev,
          name: res.data.name || '',
          description: res.data.description || '',
          username: res.data.username || '',
          logo: null,
        }));
        if (res.data.logo_path) {
          setLogoPreview(`${STORAGE_URL}/${res.data.logo_path}`);
        }
      } catch (err) {
        alert('Gagal memuat data ekskul');
      }
    };
    fetchClub();
  }, [clubId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, logo: file }));
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('username', form.username);
      if (form.password) {
        formData.append('password', form.password);
      }
      if (form.logo) {
        formData.append('logo', form.logo);
      }
      formData.append('_method', 'PUT');

      await apiClient.post(`/admin/clubs/${clubId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Ekskul berhasil diperbarui');
      navigate('/admin/clubs');
    } catch (err) {
      console.error(err);
      alert('Gagal update ekskul');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
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
            Edit Ekstrakurikuler
          </Typography>
          <div></div>
        </Toolbar>
      </AppBar>

      <Paper className="p-6 space-y-4 mt-5">

        <TextField
          fullWidth
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          label="Nama Ekstrakurikuler"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Deskripsi"
          name="description"
          value={form.description}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          type={showPassword ? 'text' : 'password'}
          label="Password (isi jika ingin mengganti)"
          name="password"
          value={form.password || ''}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />


        <div>
          {logoPreview && <img src={logoPreview} alt="Preview" className="w-24 h-24 object-cover rounded mb-2" />}
          <Button variant="outlined" component="label">
            Ganti Logo
            <input type="file" hidden accept="image/*" onChange={handleLogoChange} />
          </Button>
        </div>

        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Simpan Perubahan
        </Button>
      </Paper>
    </div>
  );
}
