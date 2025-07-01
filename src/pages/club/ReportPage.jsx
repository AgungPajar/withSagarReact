import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Button, Paper, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import imageCompression from 'browser-image-compression';

import apiClient, { STORAGE_URL } from '../../utils/axiosConfig';
import SidebarClub from '../../components/SidebarClub';
import Footer from '../../components/Footer';

export default function ReportPage() {
  const navigate = useNavigate();
  const { clubId } = useParams();

  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tanggal, setTanggal] = useState(dayjs());
  const [materi, setMateri] = useState('');
  const [tempat, setTempat] = useState('');
  const [photoBlob, setPhotoBlob] = useState(null);
  const [photoDataUrl, setPhotoDataUrl] = useState(null);
  const [photoTaken, setPhotoTaken] = useState(false);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const response = await apiClient.get(`/clubs/${clubId}`);
        setClub(response.data);
      } catch (error) {
        alert('Gagal memuat data ekskul');
      } finally {
        setLoading(false);
      }
    };
    if (clubId) fetchClub();
  }, [clubId]);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024; // batas maksimum 2MB

    const options = {
      maxSizeMB: 1, // target max 1MB
      maxWidthOrHeight: 1080,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);

      if (compressedFile.size > maxSize) {
        alert('Foto yang anda Upload masih melebihi 2 MB setelah dikompres');
        return;
      }

      setPhotoBlob(compressedFile);

      const reader = new FileReader();
      reader.onloadend = () => setPhotoDataUrl(reader.result);
      reader.readAsDataURL(compressedFile);
      setPhotoTaken(true);
    } catch (err) {
      alert('Gagal mengompres foto');
      console.error(err);
    }
  };


  const handleSubmit = async () => {
    if (!materi || !tempat) {
      alert('Materi dan tempat harus diisi');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('date', tanggal.format('YYYY-MM-DD'));
      formData.append('materi', materi);
      formData.append('tempat', tempat);
      if (photoBlob) {
        const fileName = `photo_${clubId}_${tanggal.format('YYYYMMDD')}.png`;
        const file = new File([photoBlob], fileName, { type: 'image/png' });
        formData.append('photo', file);
      }
      await apiClient.post(`/clubs/${clubId}/activity-reports`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Laporan berhasil dikirim! Lanjut ke presensi.');
      navigate(`/attendance/${clubId}/attendance`);
    } catch (error) {
      alert('Gagal kirim laporan');
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-white text-gray-800 pl-6 pr-6">
        <SidebarClub />

        <motion.main
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="min-h-screen pt-1 md:pt-1 md:ml-64 flex justify-center items-center"
        >
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <motion.div
                className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              />
            </div>
          ) : (
            <Paper
              elevation={3}
              sx={{
                p: 4,
                width: '100%',
                maxWidth: 480,
                border: '1px solid #3b82f6',
                borderRadius: 3,
              }}
            >
              <img
                src={club?.logo_path ? `${STORAGE_URL}/${club.logo_path}` : '/logoeks.png'}
                alt="Logo"
                style={{
                  width: 160,
                  height: 160,
                  margin: 'auto',
                  display: 'block',
                  marginBottom: 16,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #ccc',
                }}
              />
              <Typography variant="body1" align="center" sx={{ mb: 2 }}>
                {club?.name}
              </Typography>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Tanggal Kegiatan"
                  value={tanggal}
                  onChange={() => { }} // diset readOnly
                  format="YYYY-MM-DD"
                  readOnly
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: 'dense',
                      InputProps: { readOnly: true },
                    },
                  }}
                />
              </LocalizationProvider>

              <div style={{ marginTop: 16 }}>
                <Button variant="contained" component="label" fullWidth sx={{ mb: 2 }}>
                  Upload Foto
                  <input type="file" accept="image/*" hidden onChange={handlePhotoChange} />
                </Button>
                {photoTaken && (
                  <img src={photoDataUrl} alt="Preview" style={{ width: '100%', borderRadius: 8, marginBottom: 16 }} />
                )}
              </div>

              <TextField
                label="Materi Kegiatan"
                fullWidth
                margin="dense"
                value={materi}
                onChange={(e) => setMateri(e.target.value)}
              />
              <TextField
                label="Tempat"
                fullWidth
                margin="dense"
                value={tempat}
                onChange={(e) => setTempat(e.target.value)}
              />

              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3 }}
                onClick={handleSubmit}
              >
                Next: Isi Presensi
              </Button>
            </Paper>
          )}
        </motion.main>

      </div>
      <Footer />
    </div>
  );
}
