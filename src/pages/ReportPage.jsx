import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Button, Paper, TextField } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import apiClient, { STORAGE_URL } from '../utils/axiosConfig';

export default function ReportPage() {
  const navigate = useNavigate();
  const { clubId } = useParams();

  const [club, setClub] = useState(null);
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
      }
    };
    if (clubId) fetchClub();
  }, [clubId]);

  const handleBack = () => navigate(-1);

  // Fungsi foto bisa kamu pindah atau custom sesuai yang kamu punya, 
  // supaya tetap bisa ambil foto dan preview, contoh sederhana:
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoBlob(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoDataUrl(reader.result);
    reader.readAsDataURL(file);
    setPhotoTaken(true);
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
    <div className="min-h-screen bg-white text-gray-800 p-6 pt-10">
      {/* Navbar */}
      <AppBar position="static" color="inherit" style={{ boxShadow: 'none', borderRadius: 50, border: '1px solid #97C1FF' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <IconButton edge="start" color="inherit" onClick={handleBack}>
            <ArrowBackIosNewIcon />
          </IconButton>
          <Typography variant="h6">Laporan Kegiatan</Typography>
          <div />
        </Toolbar>
      </AppBar>

      {/* Konten utama */}
      <Paper elevation={3} sx={{ p: 4, mt: 6, maxWidth: 480, mx: 'auto', border: '1px solid #3b82f6', borderRadius: 3 }}>
        <img
          src={
            club?.logo_path
              ? `${STORAGE_URL}/${club.logo_path}`
              : '/logoeks.png'
          }
          alt="Logo"
          style={{ width: 160, height: 160, margin: 'auto', display: 'block', marginBottom: 16, borderRadius: '50%', objectFit: 'cover', border: '3px solid #ccc' }}
        />
        <Typography variant="body1" align="center" sx={{ mb: 2 }}>
          {club ? club.name : 'Memuat...'}
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Tanggal Kegiatan"
            value={tanggal}
            onChange={() => { }} // blok perubahan
            format="YYYY-MM-DD"
            readOnly
            slotProps={{
              textField: {
                fullWidth: true,
                margin: 'dense',
                InputProps: {
                  readOnly: true
                }
              }
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
          onChange={e => setMateri(e.target.value)}
        />
        <TextField
          label="Tempat"
          fullWidth
          margin="dense"
          value={tempat}
          onChange={e => setTempat(e.target.value)}
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

      <footer style={{ marginTop: 32, textAlign: 'center', fontSize: 12, color: '#555' }}>
        © 2025 OSIS SMK NEGERI 1 GARUT
      </footer>
    </div>
  );
}
