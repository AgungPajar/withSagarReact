import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  ListItem,
  Drawer,
  List,
  ListItemText,
  useMediaQuery,
  useTheme,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { useNavigate } from 'react-router-dom';
import EkskulSlider from '../components/EkskulSliderHome';

export default function Dashboard() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'white' }}>
      {/* Drawer for Mobile */}
      {isMobile && (
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          PaperProps={{
            sx: {
              width: 280,
              color: '#000',
              borderRight: '2px solid #97C1FF',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <Box display="flex" alignItems="center" px={2} py={2}>
                c
              </Box>
              <Divider sx={{ borderColor: '#97C1FF' }} />
              <List>
                <ListItem button onClick={() => { navigate('/'); setDrawerOpen(false); }}>
                  <HomeIcon sx={{ mr: 2 }} />
                  <ListItemText primary="Beranda" />
                </ListItem>
                <ListItem button onClick={() => { navigate('/login'); setDrawerOpen(false); }}>
                  <LoginIcon sx={{ mr: 2 }} />
                  <ListItemText primary="Login" />
                </ListItem>
                <ListItem button onClick={() => { navigate('/register-siswa'); setDrawerOpen(false); }}>
                  <GroupAddIcon sx={{ mr: 2 }} />
                  <ListItemText primary="Daftar Ekskul" />
                </ListItem>
                <ListItem button onClick={() => { navigate('/porest'); setDrawerOpen(false); }}>
                  <EventNoteIcon sx={{ mr: 2 }} />
                  <ListItemText primary="Daftar ClassMeet" />
                </ListItem>
              </List>
            </div>
            <Typography
              variant="caption"
              color="textSecondary"
              textAlign="center"
              sx={{ py: 2 }}
            >
              copyright OSSAGAR 59
            </Typography>
          </Box>
        </Drawer>
      )}

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
          <Box display="flex" alignItems="center" gap={2}>
            <img src="/smealogo.png" alt="Logo" style={{ height: '40px' }} />
            <Typography variant="h6" fontWeight="bold" color="#4D9CFF">
              OSSAGAR'59
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <IconButton
              edge="end"
              color="inherit"
              onClick={isMobile ? toggleDrawer(true) : handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>

            {/* Login Button only for desktop */}
            {!isMobile && (
              <button
                className="bg-blue-300 text-white px-4 py-1 rounded-md text-sm hover:bg-blue-400"
                onClick={() => navigate('/login')}
              >
                LOGIN
              </button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Menu Dropdown for Desktop */}
      {!isMobile && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => navigate('/')} disabled>
            Home
          </MenuItem>
          <MenuItem onClick={() => navigate('/login')}>Login</MenuItem>
          <MenuItem onClick={() => navigate('/register-siswa')} disabled>
            Daftar Ekstrakurikuler
          </MenuItem>
          <MenuItem onClick={() => navigate('/porest')}>Daftar Porest ClassMeet</MenuItem>
        </Menu>
      )}

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

      {/* Card Section */}
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
