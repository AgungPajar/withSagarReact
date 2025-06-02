import React, { useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white text-gray-800 p-6 pt-10">
      {/* Navbar */}
      <AppBar
        position="static"
        color="inherit"
        style={{
          boxShadow: 'none',
          border: '1px solid #97C1FF',
          borderRadius: '50px',
        }}
        className="bg-white"
      >
        <Toolbar>
          <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
            OSSAGAR 59
          </Typography>
          <IconButton edge="end" color="inherit" onClick={handleMenuOpen}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <div style={{ marginTop: '10vh', gap: '16vh' }} className="flex flex-col items-center justify-center w-full max-w-md">
        {/* Menu Hamburger */}
        <Menu open={Boolean(anchorEl)} onClose={handleMenuClose} anchorEl={anchorEl}>
          <MenuItem onClick={() => navigate('/')}>Home</MenuItem>
          <MenuItem onClick={() => navigate('/login')}>Login</MenuItem>
          <MenuItem onClick={() => navigate('/register-siswa')}>Daftar Ekstrakurikuler</MenuItem>
        </Menu>

        {/* Bagian Utama */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-blue-500 mb-2 border-b border-blue-500">E - OSSAGAR</h1>
          <h2 className="text-lg font-bold mb-2">ORGANISASI & EKSTRAKURIKULER</h2>
          <h2 className="text-lg font-bold mb-6">SMK NEGERI 1 GARUT</h2>
        </div>

        {/* Logo */}
        <div className="flex justify-center">
          <img
            src="/smealogo.png"
            alt="Mockup UI Presensi"
            className="w-40 h-40 object-contain"
          />
        </div>

        {/* Tagline */}
        <div className="text-center mb-10 px-4">
          <p className="text-base leading-relaxed">
            OSSAGAR'59<br />
            HIJI HATE, HIJI HARTI<br />
            NGAHJI NGABAKTI
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full text-center py-3 text-sm text-gray-500 border-t border-gray-200 bg-gray-50">
        © 2025 OSIS SMK NEGERI 1 GARUT
      </footer>
    </div>
  );
}
