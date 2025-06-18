import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Box,
  Container
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

import EkskulSlider from '../components/EkskulSliderHome';

export default function Dashboard() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'white' }}>
      {/* Menu Hamburger */}
      <Menu open={Boolean(anchorEl)} onClose={handleMenuClose} anchorEl={anchorEl}>
        <MenuItem onClick={() => navigate('/')} disabled>Home</MenuItem>
        <MenuItem onClick={() => navigate('/login')}>Login</MenuItem>
        <MenuItem onClick={() => navigate('/register-siswa')} disabled>Daftar Ekstrakurikuler</MenuItem>
        <MenuItem onClick={() => navigate('/porest')}>Daftar Porest ClassMeet</MenuItem>
      </Menu>
      
      {/* Navbar */}
      <AppBar
        position="static"
        elevation={0}
        color="transparent"
        sx={{
          borderRadius: '16px',
          border: '1px solid #ccc',
          margin: '2rem auto',
          width: '90%',
          maxWidth: '1200px',
          backgroundColor: 'white',
          paddingX: 4,
        }}
      >
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <div className="flex items-center space-x-4">
            <img
              src="/smealogo.png"
              alt="Logo"
              style={{ height: '40px' }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: '#4D9CFF',
              }}
            >
              OSSAGAR'59
            </Typography>
          </div>
          <div className="flex items-center space-x-7">
            <IconButton edge="end" color="inherit" onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
            <button
              className="bg-blue-300 text-white px-4 py-1 rounded-md text-sm hover:bg-blue-400"
              onClick={() => navigate('/login')}
            >
              LOGIN
            </button>
          </div>
        </Toolbar>
      </AppBar>

      {/* Header Section */}
      <Box sx={{ bgcolor: '#ffffff', py: 4, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
          ORGANISASI & EKSTRAKURIKULER <br />
          <span style={{ color: '#333' }}>SMK NEGERI 1 GARUT</span>
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          HIJI HATE, HIJI HARTI, NGAEHIJI NGABAKTI
        </Typography>
      </Box>

      {/* Card Section Placeholder */}
      <EkskulSlider />

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
    </Box>
  );
}
