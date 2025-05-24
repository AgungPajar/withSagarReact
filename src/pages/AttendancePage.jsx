import React from 'react';
import axios from 'axios';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, TextField, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Select } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

export default function Attendance() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const clubId = searchParams.get('club') || 1;

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleBack = () => {
    navigate('/club');
  };

  const handleSubmit = async () => {
    try {
      const attendanceData = students.map(student => ({
        student_id: student.id,
        club_id: parseInt(clubId),
        status: student.status || 'hadir',
        date: '2025-05-21',
        club_id: 1 // bisa ambil dari params atau state
      }));
  
      const response = await axios.post('http://localhost:8000/api/attendances', attendanceData);
  
      console.log('Presensi berhasil dikirim:', response.data);
  
      // Redirect ke halaman Club
      navigate('/club');
    } catch (error) {
      console.error('Error saat mengirim presensi:', error);
      alert('Gagal mengirim presensi. Silakan coba lagi.');
    }
  };

  const handleStatusChange = (id, status) => {
    const updatedStudents = students.map(student =>
      student.id === id ? { ...student, status } : student
    );
    setStudents(updatedStudents);
  };

  const [students, setStudents] = React.useState([
    { id: 1, class: 'XI PPL 2', name: 'Agung Pajar' },
  ]);

  return (
    <div className="flex flex-col justify-between min-h-screen bg-white text-gray-800 p-6">
      {/* navbar */}
      <AppBar
        position="static"
        color="inherit"
        style={{
          boxShadow: 'none',
          border: '1px solid #97C1FF',
          borderRadius: '50px',
        }}
        className="bg-white">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleBack}>
            <ArrowBackIosNewIcon />
          </IconButton>
          <Typography variant="h6" component="div">
            Presensi
          </Typography>
          <div></div>
        </Toolbar>
      </AppBar>

      {/* Bagian Utama */}
      <Paper 
        elevation={3} 
        className="bg-white p-4 rounded-lg shadow-md mb-6 mt-10 border border-blue-500 max-w-md mx-auto" 
        style={{ width: '85vw' }}
      >
        <img 
          src="/smealogo.png" 
          alt="Logo" 
          className="w-40 h-40 object-contain mb-4 mx-auto"
        />

        <Typography variant="body1" component="div" sx={{ mb: 2, textAlign: 'center' }} >
          Nama Ekstrakurikuler
        </Typography>

        <div className="flex justify-evenly">
          <Button variant="contained" color="primary">15:10</Button>
          <span>--</span>
          <Button variant="contained" color="primary">17:00</Button>
        </div>
      </Paper>

      <div className="mt-6 mb-5 max-w-md">
        <p className="mb-2">Rabu, 21 Mei 2025</p>
        <Button variant="contained" color="primary">TAKE PHOTO</Button>
        <span className="ml-2">SUCCESS</span>
      </div>

      {/* Form Presensi */}
      <div className="mt-1 ">
        <TextField sx={{ mb: 1 }} label="Materi Kegiatan" fullWidth />
        <TextField label="Tempat" fullWidth />
      </div>

      {/* Tabel Siswa */}
      <TableContainer component={Paper} className="mt-5 mb-5">
        <Table>
          <TableHead>
            <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Kelas</TableCell>
                <TableCell>Nama</TableCell>
                <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.id}</TableCell>
                <TableCell>{student.class}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>
                  <Select 
                    // defaultValue="hadir"
                    value={student.status || 'hadir'}
                    onChange={(e) => handleStatusChange(student.id, e.target.value)}
                    fullWidth
                  >
                    <MenuItem value="hadir">Hadir</MenuItem>
                    <MenuItem value="tidak hadir">Tidak Hadir</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Submit */}
      <div className="mb-10">
        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
          Button
        </Button>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full text-center py-3 text-sm text-black bg-gray-50" >
        © 2025 OSIS SMK NEGERI 1 GARUT
      </footer>
    </div>
  )
}