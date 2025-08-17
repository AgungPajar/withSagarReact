// src/pages/club/Report/ReportPage.jsx

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Paper, Typography, TextField, Button } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

import { STORAGE_URL } from '@/utils/axiosConfig';
import Footer from '@/components/layouts/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useReportForm } from '@/hooks/Clubs/useReportForm';
import { useClubData } from '@/hooks/Clubs/useClubData';

export default function ReportPage() {
  const { clubId } = useParams();
  const navigate = useNavigate();

  const { club, loading } = useClubData(clubId);
  const {
    tanggal,
    materi, setMateri,
    tempat, setTempat,
    photoDataUrl,
    submitting,
    handlePhotoChange,
    handleSubmit,
  } = useReportForm(clubId);

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center"><LoadingSpinner /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col justify-center items-center p-4 sm:pb-12"
      >
        <div className="w-full" style={{ maxWidth: 500 }}>
          <button
            onClick={() => navigate(-1)} // <-- Aksi buat kembali
            className="flex items-center gap-2 text-gray-600 hover:text-black font-semibold mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <Paper elevation={4} sx={{ p: 4, width: '100%', maxWidth: 500, borderRadius: 3 }}>
            <img
              src={club?.logo_path ? `${STORAGE_URL}/${club.logo_path}` : '/logoeks.png'}
              alt="Logo"
              className="w-28 h-28 mx-auto mb-4 rounded-full object-cover border-4 border-white shadow-md"
            />
            <Typography variant="h5" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
              Laporan Kegiatan {club?.name}
            </Typography>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Tanggal Kegiatan"
                value={tanggal}
                readOnly
                format="DD MMMM YYYY"
                slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
              />
            </LocalizationProvider>

            {photoDataUrl && (
              <img src={photoDataUrl} alt="Preview" className="w-full rounded-lg my-4" />
            )}

            <Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }}>
              Upload Foto Dokumentasi
              <input type="file" accept="image/*" hidden onChange={handlePhotoChange} />
            </Button>

            <TextField label="Materi Kegiatan" fullWidth margin="normal" value={materi} onChange={(e) => setMateri(e.target.value)} />
            <TextField label="Tempat" fullWidth margin="normal" value={tempat} onChange={(e) => setTempat(e.target.value)} />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, py: 1.5, fontWeight: 'bold' }}
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Mengirim...' : 'Kirim Laporan & Lanjut Presensi'}
            </Button>
          </Paper>
        </div>
      </motion.main>
      <Footer />
    </div>
  );
}