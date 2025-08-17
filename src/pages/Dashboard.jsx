import React, { useState, useEffect } from 'react';
import { GlobalStyles, AppBar, Toolbar, Typography, Box, Link } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import EkskulSlider from '../components/EkskulSliderHome';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    setUser(savedUser);
    setLoading(false)

    const hasSeenALert = sessionStorage.getItem('infoAlertSeen')
    if (!hasSeenALert) {
      Swal.fire({
        title: 'OSSAGAR 59',
        text: 'guys maaf yaa karena ini masih tahap develop, kalau ada error kalian logout dulu terus refresh terus login lagi. Thanks GUYS',
        icon: 'info',
        confirmButtonText: 'Lanjutkan...',
        background: '#fff',
        color: '#333',
        customClass: {
          confirmButton: 'my-confirm-btn',
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
      sessionStorage.setItem('infoAlertSeen', 'true')
    }
  }, []);

  const clubId = user?.club_hash_id;
  const studentHashId = user?.student_hash_id;

  const inputGlobalStyles = (
    <GlobalStyles
      styles={{
        body: {
          backgroundColor: '#f0f2f5', // Warna dasar paling luar
        },
        '#root::before': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(ellipse at center, white 40%, transparent 80%)',
          zIndex: -1,
        },
      }}
    />
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'transparent',
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

      <Box sx={(theme) => ({
        minHeight: '74vh',
        width: '100%',
        maxWidth: '90vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        position: 'relative',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '16px',
        margin: '0 auto 2rem auto', 
        padding: { xs: '0 1rem', md: '0 2rem' },
        transition: 'background-image 1s ease-in-out',
        color: 'white',
        textShadow: '3px 3px 2px rgb(210, 227, 250)',

        '@keyframes verticalSlider': {
          '0%, 45%': {
            backgroundImage: 'url(/assets/bg/vertical1.jpeg)',
          },
          '50%, 95%': {
            backgroundImage: 'url(/assets/bg/vertical2.jpeg)',
          },
          '100%': {
            backgroundImage: 'url(/assets/bg/vertical1.jpeg)',
          },
        },
        '@keyframes horizontalSlider': {
          '0%, 45%': {
            backgroundImage: 'url(/assets/bg/horizontal1.png)',
          },
          '50%, 95%': {
            backgroundImage: 'url(/assets/bg/horizontal2.png)',
          },
          '100%': {
            backgroundImage: 'url(/assets/bg/horizontal1.png)',
          },
        },

        maskImage: 'radial-gradient(ellipse 80% 100% at center, white 60%, transparent)',
        maskSize: '100% 100%',
        maskRepeat: 'no-repeat',

        animation: 'verticalSlider 10s infinite',
        [theme.breakpoints.up('md')]: {
          animation: 'horizontalSlider 10s infinite',
        },
      })}>

        <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
          ORGANISASI <br /> & <br /> EKSTRAKURIKULER <br />
          <span style={{ color: '#333' }}>SMK NEGERI 1 GARUT</span>
        </Typography>
        <Typography variant="h6" color="textSecondary" translate="no">
          HIJI HATE, HIJI HARTI, NGAHIJI NGABAKTI
        </Typography>
      </Box>

      <EkskulSlider onLoadFinish={() => setLoading(false)} />

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
        className="fixed bottom-1 right-8 z-[9999] cursor-pointer"
      >
        <motion.img
          src="/ttslogo.png"
          alt="TTS"
          className="w-[6rem] h-[6rem] object-contain hover:scale-110 transition-transform duration-300 drop-shadow-xl"
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
