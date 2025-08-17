import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box, Select, MenuItem } from '@mui/material';
import apiClient from '../../../../utils/axiosConfig';
import SearchNisnModal from './../SearchNisnModal';

const BuntutNaga = () => {
  const [form, setForm] = useState({
    anggota: [
      { student_id: null },
      { student_id: null },
      { student_id: null },
      { student_id: null },
      { student_id: null },
    ],
    nomor_hp: '',
    cabang_lomba: 'Buntut Naga',
    nama_tim: '',
    id_jurusan: null,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const [jurusans, setJurusans] = useState([]);

  const [currentAnggotaIndex, setCurrentAnggotaIndex] = useState(null);

  const handleOpenModal = (index) => {
    setCurrentAnggotaIndex(index);
    setModalOpen(true);
  };

  useEffect(() => {
    apiClient.get('/jurusans').then(res => {
      setJurusans(res.data);
    });
  }, []);

  const handleJurusanChange = (e) => {
    setForm(prev => ({
      ...prev,
      id_jurusan: e.target.value,
    }));
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectMember = (member) => {
    if (form.anggota.some((a) => a.student_id === member.id)) {
      alert('Anggota ini sudah dipilih, bro!');
      return;
    }

    const updatedAnggota = [...form.anggota];
    updatedAnggota[currentAnggotaIndex] = {
      student_id: member.id,
      id_jurusan: member.jurusan?.id || null,
      nama: member.nama,
      kelas: member.kelas,
    };
    setForm({ ...form, anggota: updatedAnggota });
    setModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const semuaTerisi = form.anggota.every(a => a.student_id !== null);
    if (!semuaTerisi) {
      alert('Semua anggota harus dipilih dulu ya bro');
      return;
    }

    if (!form.nomor_hp) {
      alert('Nomor HP wajib diisi');
      return;
    }

    try {
      await apiClient.post('/students/register-agustus', {
        anggota: form.anggota,
        cabang_lomba: form.cabang_lomba,
        nama_tim: form.nama_tim,
        nomor_hp: form.nomor_hp,
        id_jurusan: form.id_jurusan
      });
      navigate('/sukses');
    } catch (error) {
      console.error(error);
      alert('Gagal mendaftar, coba lagi nanti.');
    }
  };

  return (
    <div
      className="min-h-screen bg-white px-4 py-6 flex flex-col items-center justify-center"
      style={{
        backgroundImage: "url('/lombabg.jpg')",
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
        <Typography variant="h4" align="center" gutterBottom>
          OSSAGAR 59
        </Typography>
        <Typography variant="h6" align="center" gutterBottom>
          Pendaftaran Lomba Agustusan 2025
          <br />
        </Typography>
      </Paper>

      <Paper
        component="form"
        onSubmit={handleSubmit}
        className="p-6 mt-10 w-full max-w-md"
        sx={{
          borderRadius: '20px',
          border: '2px solid #90caf9',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Buntut Naga
        </Typography>

        {form.anggota.map((a, i) => (
          <Button
            key={i}
            variant="outlined"
            fullWidth
            onClick={() => handleOpenModal(i)}
            sx={{ mb: 3, textTransform: 'none' }}
          >
            {a.nama ? `${a.nama} (${a.kelas})` : `Pilih Anggota ${i + 1}`}
          </Button>
        ))}

        {/* Input Nama Tim / Jurusan */}
        <TextField
          label="Nama Tim / Jurusan"
          name="nama_tim"
          value={form.nama_tim}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 3 }}
          placeholder="Nama Tim / Jurusan"
        />

        {/* Nomor HP wajib */}
        <TextField
          label="Nomor HP"
          name="nomor_hp"
          value={form.nomor_hp}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 3 }}
          placeholder="08123456789"
          required
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          color="primary"
          sx={{
            textTransform: 'none',
            backgroundColor: '#90caf9',
            '&:hover': {
              backgroundColor: '#36a4fe',
            },
            mb: 2,
          }}
        >
          DAFTAR
        </Button>
      </Paper>

      {/* Footer */}
      <Box sx={{ mt: 2, mb: 5 }}>
        <Typography variant="body2" align="center">
          2025 © OSIS SMKN 1 GARUT
        </Typography>
        <Typography variant="body1" align="center" sx={{ mt: 2 }}>
          by{' '}
          <a
            href="https://www.instagram.com/jarss_pajar"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#1976d2',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            JARSS
          </a>
        </Typography>
      </Box>

      <SearchNisnModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelectMember={handleSelectMember}
      />
    </div>
  );
};

export default BuntutNaga;
