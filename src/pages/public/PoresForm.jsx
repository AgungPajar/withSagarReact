import React, { useState } from 'react';
import apiClient from '../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  MenuItem,
  Button,
  Paper,
  Typography,
  Select,
  InputLabel,
  FormControl,
  Box,
} from '@mui/material';

const PorestForm = () => {
  const [form, setForm] = useState({
    nama: '',
    kelas: '',
    nomor_hp: '',
    cabang_olahraga: '',
    nama_tim: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('daftar-lomba', form);
      navigate('/sukses');
    } catch (error) {
      console.error(error);
      alert('Gagal mendaftar, coba lagi nanti.');
    }
  };

  const caborOptions = [
    'Futsal Putra', 'Badminton', 'Tarik Tambang', 'Catur'
  ];

  return (
    <div className="min-h-screen bg-white px-4 py-6 flex flex-col items-center justify-center"
      style={{
        backgroundImage: "url('lombabg.jpg')",
        filter: 'brightness(1)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#f5f5f5',
        backgroundAttachment: 'fixed',
      }}
    >

      <Paper
        className="p-6 mt-10 w-full max-w-md"
        sx={{
          borderRadius: '20px',
          border: '2px solid #90caf9',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Logo */}
        <Box align="center" sx={{ mb: 2 }}>
          <img
            src="smealogo.png"
            alt="Logo OSSAGAR"
            style={{
              width: '100px',
              height: 'auto',
            }}
          />
        </Box>

        {/* Judul OSSAGAR 59 */}
        <Typography variant="h4" align="center" gutterBottom>
          OSSAGAR 59
        </Typography>

        {/* Subjudul (Pendaftaran Lomba POREST 2025) */}
        <Typography variant="h6" align="center" gutterBottom>
          Pendaftaran Lomba Agustusan 2025
          <br />
          (Pekan OLAHRAGA DAN ESPORT)
        </Typography>

        {/* Deskripsi Pendaftaran */}
        <Typography variant="body1" align="start" sx={{ mt: 2 }}>
          Halo, Sobat SAGAR! 👋<br />
          Selamat datang di formulir pendaftaran lomba Pekan Olahraga dari Ekstrakurikuler untuk Siswa  
          "PORES 2025".<br />
          Acara ini bertujuan untuk mempererat semangat sportivitas dan kekompakan
          antar siswa.<br />
          Silakan isi formulir di bawah ini dengan lengkap dan benar.
        </Typography>

        {/* Batas Akhir Pendaftaran */}
        <Typography variant="body1" align="start" sx={{ mt: 2 }}>
          ⏰ Batas akhir pendaftaran: 18 Juni 2025
        </Typography>

        <Typography variant="body1" align="start" sx={{ mt: 2 }}>
          📔 GUIDE BOOK PERLOMBAAN
          <br />
          <Button
            variant="contained"
            color="primary"
            href="https://drive.google.com/drive/folders/1TuR40dNPGASyPTOMztYLnDQfk_PXp8P_?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              textTransform: 'none',
              backgroundColor: '#90caf9',
              '&:hover': {
                backgroundColor: '#36a4fe',
              },
              mt: 2
            }}
          >
            Buka Guide Book Lomba
          </Button>
        </Typography>
      </Paper>

      <Paper className="p-6 mt-10 w-full max-w-md" sx={{
        borderRadius: '20px',
        border: '2px solid #90caf9',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
      }}>

        <Typography variant="h5" align="center" gutterBottom>
          FORM FUTSAL PUTRA
        </Typography>

        <TextField
          label="*Nama"
          name="nama"
          value={form.nama}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          placeholder="contoh : Ananda Agung"
        />

        <TextField
          label="*Kelas"
          name="kelas"
          value={form.kelas}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          placeholder="contoh : XI TKJ 4"
        />

        <TextField
          label="*Nomo Hp/Wa"
          name="nomor_hp"
          value={form.nomor_hp}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          placeholder="Contoh : 08123456789"
        />

        <FormControl fullWidth sx={{ mb: 2 }}
        >
          <InputLabel>*Cabang Lomba</InputLabel>
          <Select
            name="cabang_olahraga"
            value={form.cabang_olahraga}
            onChange={handleChange}
            label="cabang_olahraga"
          >
            {caborOptions.map((cabor) => (
              <MenuItem key={cabor} value={cabor}>
                {cabor}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Nama Tim ( Bagi Lomba Futsal dan Tarik Tambang )"
          name="nama_tim"
          value={form.nama_tim}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 5 }}
          placeholder="Nama Tidak Berunsur SARA"
        />

        <Button
          variant="contained"
          fullWidth
          color="primary"
          onClick={handleSubmit}
          sx={{
            textTransform: 'none',
            backgroundColor: '#90caf9',
            '&:hover': {
              backgroundColor: '#36a4fe',
            },
            mb: 2
          }}
        >
          DAFTAR
        </Button>
      </Paper>

      {/* Footer */}
      <Box sx={{ mt: 2, mb: 5 }}>
        {/* Tahun dan Copyright */}
        <Typography variant="body2" align="center">
          2025 © OSIS SMKN 1 GARUT
        </Typography>

        {/* Crafted with ❤️ by PPLG */}
        <Typography variant="body1" align="center" sx={{ mt: 2 }}>
          by{' '}
          <a
            href="https://www.instagram.com/jarss_pajar"  // Ganti dengan URL Instagram sebenarnya
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#1976d2', // Biru untuk PPLG
              textDecoration: 'underline', // Garis bawah
              cursor: 'pointer', // Menunjukkan pointer saat dihover
            }}
          >
            JARSS
          </a>
        </Typography>
      </Box>

    </div>
  );
};

export default PorestForm;
