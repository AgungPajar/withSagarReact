import React, { useEffect, useState } from 'react';
import apiClient from '../../utils/axiosConfig';
import {
  Typography,
  TextField,
  Paper,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Box,
  Container,
} from '@mui/material';

const DataPores = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    try {
      const res = await apiClient.get('/pendaftaran');
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = data.filter((item) =>
    item.cabang_olahraga.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        backgroundImage: "url('/lombabg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        width: '100%',
        paddingTop: '80px',
        paddingBottom: '40px',
      }}
    >
      <Container maxWidth="lg">
        <Paper sx={{ p: 3, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
            DATA PENDAFTARAN PORES 2025
          </Typography>

          {/* Search dan total */}
          <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
            <TextField
              placeholder="Cari Matlomb..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              sx={{ width: '200px', mb: 1 }}
            />
            <Typography variant="subtitle1">
              Total Pendaftar: {filtered.length}
            </Typography>
          </Box>

          <Box sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>Nama</TableCell>
                  <TableCell>Kelas</TableCell>
                  <TableCell>No_Hp</TableCell>
                  <TableCell>MataLomba</TableCell>
                  <TableCell>Nama Tim</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.nama}</TableCell>
                    <TableCell>{item.kelas}</TableCell>
                    <TableCell>{item.nomor_hp}</TableCell>
                    <TableCell>{item.cabang_olahraga}</TableCell>
                    <TableCell>{item.nama_tim || '-'}</TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Loading Brooo...
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default DataPores;
