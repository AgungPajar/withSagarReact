import React from "react";
import { Box, Button } from '@mui/material';
import { motion } from 'framer-motion';

const HeroSection = React.forwardRef(({ onScrollToEkskul }, ref) => {

  return (
    <Box ref={ref} sx={(theme) => ({
      minHeight: '90vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      position: 'relative',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: { xs: '0 1rem', md: '0 2rem' },
      transition: 'background-image 1s ease-in-out',
      color: 'white',
      pb: 20,

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

      <Box className="relative z-10 flex flex-col items-center justify-center text-center min-h-[80vh] sm:min-h-[90vh] p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm mb-4 border border-white/20"
        >
          OSSAGAR 59 | Hiji Hate, Hiji Harti, Ngahiji Ngabakti
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4"
          sx={{
            textShadow: '3px 3px 2px rgb(210, 227, 250)',
          }}
        >
          OSIS SMK NEGERI 1 GARUT | <span className="text-yellow-300">OSSAGAR'59</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-2xl mb-8 text-white/90"
        >
          Web Site Resmi Osis SMK Negeri 1 Garut yang menyajikan informasi Ekstrakurikuler, Program, Berita dan juga Pelayanan bagi Siswa/i.
        </motion.p>

      </Box>

    </Box>
  )
});

export default HeroSection;