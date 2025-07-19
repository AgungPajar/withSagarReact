import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Link } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import EkskulSlider from '../components/EkskulSliderHome';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { clubId } = useParams();
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const users = JSON.parse(localStorage.getItem('user'));
  const studentHashId = users?.student_hash_id;

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);
  

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'white',
        overflowX: 'hidden',
      }}
    >
      {loading && <LoadingSpinner />}

      {/* Navbar */}
      <AppBar
        position="static"
        elevation={0}
        color="transparent"
        sx={{
          borderRadius: '24px',
          border: '2px solid #3B82F6',
          boxShadow: '0 8px 12px rgba(0, 0, 0, 0.3)',
          margin: '2rem auto',
          width: '90%',
          maxWidth: '1200px',
          backgroundColor: 'white',
          paddingX: 3,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo + Judul */}
          <Box display="flex" alignItems="center" gap={2}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                color: '#3B82F6',
                fontSize: '1.2rem',
              }}
            >
              OSSAGAR'59
            </Typography>
          </Box>

          {/* Tombol Login */}
          {user ? (
            <button
              onClick={() => {
                if (user.role === 'osis') return navigate('/admin/dashboard');
                if (user.role === 'mpk') return navigate('/mpk/dashboard');
                if (user.role === 'club_pengurus') return navigate(`/club/${clubId}`);
                if (user.role === 'student') return navigate(`/student/${studentHashId}`);
              }}
              className="bg-green-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-green-600 transition duration-200"
            >
              LANJUT
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-600 transition duration-200"
            >
              LOGIN
            </button>
          )}
        </Toolbar>
      </AppBar>



      {/* Header Text */}
      <Box sx={{ bgcolor: '#ffffff', py: 4, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
          ORGANISASI <br /> & <br /> EKSTRAKURIKULER <br />
          <span style={{ color: '#333' }}>SMK NEGERI 1 GARUT</span>
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" translate="no">
          HIJI HATE, HIJI HARTI, NGAEHIJI NGABAKTI
        </Typography>
      </Box>

      {/* Slider Ekskul */}
      <EkskulSlider onLoadFinish={() => setLoading(false)} />

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          textAlign: 'center',
          py: 2,
          fontSize: 14,
          color: '#666',
          borderTop: '1px solid #ddd',
        }}
      >
        © 2025 OSIS SMK NEGERI 1 GARUT
      </Box>
      <a
        href="/ttsform"
        className="fixed bottom-2 right-8 z-[9999] cursor-pointer"
      >
        <motion.img
          src="/ttslogo.png"
          alt="TTS"
          className="w-40 h-40 object-contain hover:scale-110 transition-transform duration-300 drop-shadow-xl"
          animate={{ y: [60, -60, 60] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </a>

    </Box >
  );
}
