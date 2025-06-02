import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  Select,
  MenuItem
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import apiClient from '../utils/axiosConfig';
import dayjs from 'dayjs';

export default function AttendancePage() {
  const navigate = useNavigate();
  const { clubId } = useParams();
  const [club, setClub] = useState(null);
  const [students, setStudents] = useState([]);
  const [tanggal, setTanggal] = useState(dayjs());

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const response = await apiClient.get(`/clubs/${clubId}`);
        setClub(response.data);
      } catch {
        alert('Gagal memuat data ekskul');
      }
    };

    const fetchStudents = async () => {
      try {
        const res = await apiClient.get(`/clubs/${clubId}/students`);
        setStudents(res.data.map(s => ({ ...s, status: 'hadir' })));
      } catch {
        alert('Gagal memuat daftar siswa');
      }
    };

    if (clubId) {
      fetchClub();
      fetchStudents();
    }
  }, [clubId]);

  const handleBack = () => navigate(-1);

  const handleStatusChange = (id, status) => {
    setStudents(prev => prev.map(s => (s.id === id ? { ...s, status } : s)));
  };

  const handleSubmit = async () => {
    console.log('📤 Data dikirim ke /attendances:', {
      data: students.map(s => ({
        student_id: s.id,
        club_id: clubId,
        status: s.status,
        date: tanggal.format('YYYY-MM-DD'),
      }))
    });


    try {
      const attendanceData = students.map(student => ({
        student_id: student.id,
        club_id: clubId,
        status: student.status,
        date: tanggal.format('YYYY-MM-DD'),
      }));

      console.log('Data presensi dikirim:', { data: attendanceData });

      await apiClient.post('/attendances', { data: attendanceData }, {
        headers: { 'Content-Type': 'application/json' }
      });

      alert('Presensi berhasil dikirim!');
      navigate(`/club/${clubId}`);
    } catch (error) {
      console.error('Gagal mengirim presensi:', error);
      alert('Gagal mengirim presensi');
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      <AppBar
        position="static"
        color="inherit"
        style={{ boxShadow: 'none', borderRadius: 50, border: '1px solid #97C1FF' }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <IconButton edge="start" color="inherit" onClick={handleBack}>
            <ArrowBackIosNewIcon />
          </IconButton>
          <Typography variant="h6">Presensi Siswa</Typography>
          <div />
        </Toolbar>
      </AppBar>

      <Paper
        elevation={3}
        sx={{ p: 4, mt: 6, maxWidth: 480, mx: 'auto', border: '1px solid #3b82f6', borderRadius: 3 }}
      >
        <img
          src={
            club?.logo_path
              ? `http://localhost:8000/storage/${club.logo_path}`
              : '/logoeks.png'
          }
          alt="Logo"
          style={{ width: 160, height: 160, margin: 'auto', display: 'block', marginBottom: 16 }}
        />

        <Typography variant="body1" align="center" sx={{ mb: 2 }}>
          {club ? club.name : 'Memuat...'}
        </Typography>

        <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Kelas</TableCell>
                <TableCell>Nama</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student, i) => (
                <TableRow key={student.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>
                    <Select
                      value={student.status}
                      onChange={e => handleStatusChange(student.id, e.target.value)}
                      fullWidth
                      size="small"
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

        <Button variant="contained" color="primary" fullWidth sx={{ mt: 3 }} onClick={handleSubmit}>
          Kirim Presensi
        </Button>
      </Paper>

      <footer style={{ marginTop: 32, textAlign: 'center', fontSize: 12, color: '#555' }}>
        © 2025 OSIS SMK NEGERI 1 GARUT
      </footer>
    </div>
  );
}
