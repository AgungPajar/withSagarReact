import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
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
  Button,
} from '@mui/material';

const DataAgustusan = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    try {
      const res = await apiClient.get('/students/pendaftar-agustusan');
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = data.filter((item) =>
    item.cabang_lomba.toLowerCase().includes(search.toLowerCase())
  );

  // Fungsi buat nampilin SweetAlert list anggota
  const showAnggota = (tim) => {
    const anggotaList = tim.members
      .map((m, i) => `${i + 1}. ${m.student?.name || '-'} - ${m.student?.kelas_lengkap || '-'}`)
      .join('<br/>');

    Swal.fire({
      title: `Tim: ${tim.nama_tim || '-'}`,
      html: `
      <div style="text-align: left;">
        <strong>Anggota:</strong><br/>
        ${anggotaList || 'Tidak ada anggota'}
      </div>
    `,
      icon: 'info',
      confirmButtonText: 'Oke',
      customClass: {
        confirmButton: 'my-confirm-btn'
      }
    });
  };


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
            DATA PENDAFTARAN AGUSTUSAN 2025
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
            <Typography variant="subtitle1">Total Pendaftar: {filtered.length}</Typography>
          </Box>

          <Box sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>Nama Tim</TableCell>
                  <TableCell>Lihat Anggota</TableCell>
                  <TableCell>Cabang Lomba</TableCell>
                  <TableCell>Jurusan</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.nama_tim || '-'}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => showAnggota(item)}
                      >
                        Lihat Anggota
                      </Button>

                    </TableCell>
                    <TableCell>{item.cabang_lomba}</TableCell>
                    <TableCell>
                      {item.members && item.members[0]?.jurusan
                        ? item.members[0].jurusan.nama
                        : '-'}
                    </TableCell>
                    <TableCell></TableCell>
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

export default DataAgustusan;
