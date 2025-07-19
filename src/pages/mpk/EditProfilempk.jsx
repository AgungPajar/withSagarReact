import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Paper,
  Typography,
  Avatar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apiClient, { STORAGE_URL, getCsrfToken } from '../../utils/axiosConfig';
import SidebarAdminMPK from '../../components/SidebarMPK';
import Footer from '../../components/Footer';

export default function EditAdminProfile() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [description, setDescription] = useState('');
  const [groupLink, setGroupLink] = useState('');
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      await getCsrfToken();
      const res = await apiClient.get('/admin/profile');
      const data = res.data;

      setName(data.name || '');
      setUsername(data.username || '');

      if (data.club) {
        setDescription(data.club.description || '');
        setGroupLink(data.club.group_link || '');
        setLogoPreview(
          data.club.logo_path
            ? `${STORAGE_URL}/${data.club.logo_path}?v=${Date.now()}`
            : '/logoeks.png'
        );
      }
    } catch (err) {
      console.error('Gagal fetch profile:', err);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      await getCsrfToken();
      const token = localStorage.getItem('access_token');

      const formData = new FormData();
      formData.append('name', name);
      formData.append('username', username);
      if (password) formData.append('password', password);
      if (logo) formData.append('logo', logo);
      formData.append('description', description);
      formData.append('group_link', groupLink);

      await apiClient.post('/admin/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      alert('Profil berhasil diperbarui!');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Update error:', err);
      alert('Gagal update profile!');
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center min-h-screen p-6 bg-gray-50">
        <SidebarAdminMPK />

        <Paper className="p-6 mt-24 w-full max-w-md">
          <Typography variant="h6" className="mb-4 text-center">
            Edit Profil Admin
          </Typography>

          <div className="flex flex-col items-center mb-4">
            <Avatar
              src={logoPreview}
              sx={{ width: 100, height: 100, mb: 2 }}
            />
            <Button variant="outlined" component="label">
              UBAH LOGO
              <input hidden accept="image/*" type="file" onChange={handleLogoChange} />
            </Button>
          </div>

          <TextField
            label="Nama Ekstrakurikuler"
            fullWidth
            className="mb-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
          />

          <TextField
            label="Username"
            fullWidth
            className="mb-4"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
          />

          <TextField
            label="Bio"
            fullWidth
            className="mb-4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
          />

          <TextField
            label="Link Grup"
            fullWidth
            className="mb-4"
            value={groupLink}
            onChange={(e) => setGroupLink(e.target.value)}
            margin="normal"
          />

          <TextField
            label="Ubah Password (opsional)"
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
      </div>
      <Footer />
    </div>
  );
}
