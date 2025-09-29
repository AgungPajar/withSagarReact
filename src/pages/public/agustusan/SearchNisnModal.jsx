import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import apiClient from '../../../utils/axiosConfig';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

const SearchNisnModal = ({ open, onClose, onSelectMember }) => {
  const [search, setSearch] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = () => {
    if (!search.trim()) {
      setError('Masukkan Nama atau Nisn');
      return;
    }
    setError('');
    setLoading(true);

    apiClient.get(`/students/search-agustus?keyword=${encodeURIComponent(search)}`)
      .then(res => {
        setMembers(res.data || []);
      })
      .catch(err => {
        console.error(err);
        setMembers([]);
      })
      .finally(() => setLoading(false));

  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>Cari Anggota</Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            placeholder="Masukkan Nama atau Nisn..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            disabled={loading}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading}
          >
            Cari
          </Button>
        </Box>

        {error && <Typography color="error" mb={1}>{error}</Typography>}

        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <List sx={{ maxHeight: 300, overflowY: 'auto' }}>
            {members.map((member) => (
              <ListItem key={member.id} disablePadding>
                <ListItemButton onClick={() => { onSelectMember(member); onClose(); }}>
                  <ListItemText
                    primary={`${member.nama} - ${member.kelas}`}
                    secondary={`NISN: ${member.nisn}`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
            {members.length === 0 && !loading && (
              <Typography color="text.secondary">Tidak ada hasil</Typography>
            )}
          </List>
        )}
      </Box>
    </Modal>
  );
};

export default SearchNisnModal;
