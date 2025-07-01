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
import apiClient, { STORAGE_URL, getCsrfToken } from '../../utils/axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';
import SidebarClub from '../../components/SidebarClub';

export default function EditProfile() {
  const navigate = useNavigate();
  const { clubId } = useParams(); // ambil dari URL
  const [club, setClub] = useState(null);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [password, setPassword] = useState('');
  const [logo, setLogo] = useState(null);
  const [groupLink, setGroupLink] = useState('');
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    if (clubId) {
      fetchClub(clubId);
    }
  }, [clubId]);
  const fetchClub = async (hashId) => {
    try {
      // Get CSRF token before fetching club data
      await getCsrfToken();
      const res = await apiClient.get(`/clubs/${hashId}`);
      const data = res.data;

      setClub(data);
      setUsername(data.username || '');
      setName(data.name || '');
      setDescription(data.description || '');
      setGroupLink(data.group_link || '');

      // Set preview logo jika belum upload baru
      if (!logo && data.logo_path) {
        setLogoPreview(`${STORAGE_URL}/${data.logo_path}?v=${new Date().getTime()}`);
      } else if (!logo) {
        setLogoPreview('/logoeks.png');
      }
    } catch (err) {
      console.error('Gagal memuat d ata klub', err);
    }
  };

  const handleBack = () => navigate(-1);

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

      const xsrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

      const formData = new FormData();
      formData.append('username', username);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('group_link', groupLink);
      if (password) formData.append('password', password);
      if (logo) formData.append('logo', logo);

      await apiClient.post('/profile/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...(xsrfToken && { 'X-XSRF-TOKEN': decodeURIComponent(xsrfToken) }), // 🔥 ini yang penting!
        },
        withCredentials: true,
      });

      alert('Profil berhasil diperbarui');
      setLogo(null); // reset logo
      setLogoPreview(null); // reset preview
      fetchClub(clubId); // reload data dari backend
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
      <SidebarClub/>

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
          label="Link Grup"
          fullWidth
          className="mb-4"
          value={groupLink}
          onChange={(e) => setGroupLink(e.target.value)}
          margin="normal"
        />

        <TextField
          label="Ubah Password (Input)"
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
