import { useNavigate } from 'react-router-dom';
import {
  Button,
  Paper,
  Typography,
  Box,
} from '@mui/material';

export default function RegisterPage() {

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white px-4 py-6 flex flex-col items-center justify-center"
      style={{
        backgroundImage: "url('lombabg.jpg')",  // Ganti dengan URL gambar kamu
        filter: 'brightness(1)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#f5f5f5', // Fallback warna jika gambar gagal dimuat
        backgroundAttachment: 'fixed', // Optional: agar efek parallax saat scroll
      }}
    >

      <Paper
        className="p-6 mt-10 w-full max-w-md"
        sx={{
          borderRadius: '20px',
          border: '2px solid #90caf9', // Biru muda
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', // Box shadow hitam
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
          Pendaftaran Lomba PORES 2025
          <br />
          (Pekan OLAHRAGA DARI EKSTRAKURIKULER)
        </Typography>

        {/* Batas Akhir Pendaftaran */}
        <Typography variant="body1" align="center" sx={{ mt: 2 }}>
          Pendaftaran Telah Berhasil!!
        </Typography>

        <Typography variant="body1" align="start" sx={{ mt: 2 }}>
          Silakan Masuk Grup
          <br />
          Sesuai Lomba yang Dipilih : 
          <Button
            variant="contained"
            color="primary"
            href="https://chat.whatsapp.com/KSbiaCbtwZvLMYSOfayZOr"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              textTransform: 'none',
              backgroundColor: '#737791',
              '&:hover': {
                backgroundColor: '#62688f',
              },
              borderRadius: '20px',
              border: '2px solid #fff',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
              mt: 2
            }}
            fullWidth
          >
            Grup Futsal Putra
          </Button>
          <Button
            variant="contained"
            color="primary"
            href="https://chat.whatsapp.com/JNiyzpzl0SICrDY4m8LLyz"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              textTransform: 'none',
              backgroundColor: '#737791',
              '&:hover': {
                backgroundColor: '#62688f',
              },
              borderRadius: '20px',
              border: '2px solid #fff',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
              mt: 2
            }}
            fullWidth
          >
            Grup Badminton
          </Button>
          <Button
            variant="contained"
            color="primary"
            href="https://chat.whatsapp.com/BnIfh8OWk0S43LisDlhTpR"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              textTransform: 'none',
              backgroundColor: '#737791',
              '&:hover': {
                backgroundColor: '#62688f',
              },
              borderRadius: '20px',
              border: '2px solid #fff',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
              mt: 2
            }}
            fullWidth
          >
            Catur
          </Button>
          <Button
            variant="contained"
            color="primary"
            href="https://chat.whatsapp.com/GV3iubhtQ5U8uhJ8SKSUVm"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              textTransform: 'none',
              backgroundColor: '#737791',
              '&:hover': {
                backgroundColor: '#62688f',
              },
              borderRadius: '20px',
              border: '2px solid #fff',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
              mt: 2
            }}
            fullWidth
          >
            Tarik Tambang
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{
              textTransform: 'none',
              backgroundColor: '#90caf9',
              '&:hover': {
                backgroundColor: '#36a4fe',
              },
              mt: 6,
              mb: 2
            }}
          >
            Kembali
          </Button>
        </Typography>
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
}
