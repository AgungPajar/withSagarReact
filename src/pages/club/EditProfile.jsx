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
import Footer from '../../components/Footer';
import Swal from 'sweetalert2';
import { LoadingButton } from '@mui/lab';
import { motion } from 'framer-motion';
import LoadingSpinner from '../../components/LoadingSpinner';


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
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);


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
      console.error('Gagal memuat data klub', err);
    } finally {
      setLoading(false);
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

  const handleChangePassword = () => {
    Swal.fire({
      title: 'Ubah Password',
      html: `
      <div style="position: relative;">
        <input type="password" id="oldPassword" class="swal2-input" placeholder="Password Lama" />
        <span onclick="toggleVisibility('oldPassword', this)" style="position:absolute; right:30px; top:12px; cursor:pointer; font-size:12px;">Show</span>
      </div>
      <div style="position: relative;">
        <input type="password" id="newPassword" class="swal2-input" placeholder="Password Baru" />
        <span onclick="toggleVisibility('newPassword', this)" style="position:absolute; right:30px; top:12px; cursor:pointer; font-size:12px;">Show</span>
      </div>
      <div style="position: relative;">
        <input type="password" id="confirmPassword" class="swal2-input" placeholder="Konfirmasi Password Baru" />
        <span onclick="toggleVisibility('confirmPassword', this)" style="position:absolute; right:30px; top:12px; cursor:pointer; font-size:12px;">Show</span>
      </div>
    `,
      customClass: {
        confirmButton: 'swal2-confirm btn btn-outline-purple',
        cancelButton: 'swal2-cancel btn btn-outline-gray',
      },
      showCancelButton: true,
      confirmButtonText: 'Simpan',
      cancelButtonText: 'Batal',
      reverseButtons: true, // bikin simpan di kanan
      preConfirm: () => {
        const oldPassword = document.getElementById('oldPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!oldPassword || !newPassword || !confirmPassword) {
          Swal.showValidationMessage('Semua kolom harus diisi');
          return false;
        }

        if (newPassword !== confirmPassword) {
          Swal.showValidationMessage('Password baru tidak cocok');
          return false;
        }

        return { oldPassword, newPassword, confirmPassword };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          Swal.showLoading();
          await getCsrfToken();

          const token = localStorage.getItem('access_token');
          const xsrfToken = document.cookie
            .split(';')
            .find(row => row.startsWith('XSRF-TOKEN='))
            ?.split('=')[1];

          await apiClient.post('/profile/update', {
            old_password: result.value.oldPassword,
            new_password: result.value.newPassword,
            new_password_confirmation: result.value.confirmPassword,
          }, {
            headers: {
              ...(token && { Authorization: `Bearer ${token}` }),
              ...(xsrfToken && { 'X-XSRF-TOKEN': decodeURIComponent(xsrfToken) }),
            },
            withCredentials: true,
          });

          Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Password berhasil diperbarui',
            timer: 2000,
            showConfirmButton: false,
          });
        } catch (err) {
          console.error('Gagal ubah password:', err);
          Swal.fire({
            icon: 'error',
            title: 'Oops!',
            text: err?.response?.data?.message || 'Terjadi kesalahan saat mengubah password',
          });
        }
      }
    });
  };

  // Tambahkan script ini sekali di bawah app kamu (bisa di index.html atau satu kali saja di komponen utama)
  window.toggleVisibility = function (id, el) {
    const input = document.getElementById(id);
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    el.textContent = isHidden ? 'Hide' : 'Show';
  }


  const handleSubmit = async () => {
    setLoading2(true);
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
          ...(xsrfToken && { 'X-XSRF-TOKEN': decodeURIComponent(xsrfToken) }),
        },
        withCredentials: true,
      });

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Profil berhasil diperbarui',
        timer: 2000,
        showConfirmButton: false,
      });

      navigate(`/club/${clubId}`);

      setLogo(null);
      setLogoPreview(null);
      fetchClub(clubId);
    } catch (err) {
      console.error('Gagal update profil:', err);
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: err?.response?.data?.message || 'Terjadi kesalahan saat memperbarui profil',
      });
    } finally {
      setLoading2(false);
    }
  };


  return (
    <div>
      <div className="flex flex-col items-center justify-between min-h-screen bg-white text-gray-800 p-6">
        {/* Navbar */}
        <SidebarClub />

        <motion.main>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <Paper className="p-6 mt-24 w-full max-w-md">
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

                <Button
                  variant='outlined'
                  color="error"
                  fullWidth
                  className='mb-4 mt-8'
                  onClick={handleChangePassword}
                >
                  Ubah Password
                </Button>

                <LoadingButton
                  loading={loading2}
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleSubmit}
                >
                  Simpan Perubahan
                </LoadingButton>

              </Paper>
            </>
          )}
        </motion.main>
      </div>
      <Footer />
    </div>
  );
}
