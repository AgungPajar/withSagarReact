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
  MenuItem,
  CircularProgress
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import apiClient, { STORAGE_URL } from '../../utils/axiosConfig';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';

export default function AttendancePage() {
  const navigate = useNavigate();
  const { clubId } = useParams();
  const [club, setClub] = useState(null);
  const [students, setStudents] = useState([]);
  const [tanggal, setTanggal] = useState(dayjs());
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

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
        const res = await apiClient.get(`/clubs/${clubId}/members`);
        const kelasOrder = { X: 1, XI: 2, XII: 3 };

        const sorted = res.data
          .map(s => ({ ...s, status: 'hadir' }))
          .sort((a, b) => {
            const kelasA = kelasOrder[a.class] || 99;
            const kelasB = kelasOrder[b.class] || 99;

            if (kelasA !== kelasB) return kelasA - kelasB;

            const rombelA = parseInt(a.rombel) || 0;
            const rombelB = parseInt(b.rombel) || 0;

            if (rombelA !== rombelB) return rombelA - rombelB;

            return a.name.localeCompare(b.name);
          });

        setStudents(sorted);
      } catch {
        alert('Gagal memuat daftar siswa');
      } finally {
        setLoading(false);
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
    setSending(true);
    try {
      const attendanceData = students.map(student => ({
        student_id: student.id,
        club_id: clubId,
        status: student.status,
        date: tanggal.format('YYYY-MM-DD'),
      }));

      await apiClient.post('/attendances', { data: attendanceData }, {
        headers: { 'Content-Type': 'application/json' }
      });

      Swal.fire({
        toast: true,
        icon: 'success',
        title: 'Presensi berhasil dikirim!',
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
      });

      navigate(`/club/${clubId}`);
    } catch (error) {
      Swal.fire({
        toast: true,
        icon: 'error',
        title: 'Gagal mengirim presensi',
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
      });
    } finally {
      setSending(false);
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
          src={club?.logo_path ? `${STORAGE_URL}/${club.logo_path}` : '/logoeks.png'}
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2" sx={{ py: 2 }}>
                      Tunggu sebentar...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student, i) => (
                  <TableRow key={student.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{student.class} {student.jurusan_singkatan} {student.rombel}</TableCell>
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
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleSubmit}
          disabled={sending}
        >
          {sending ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <CircularProgress size={20} color="inherit" /> Mengirim...
            </span>
          ) : (
            'Kirim Presensi'
          )}
        </Button>
      </Paper>

      <footer style={{ marginTop: 32, textAlign: 'center', fontSize: 12, color: '#555' }}>
        © 2025 OSIS SMK NEGERI 1 GARUT
      </footer>
    </div>
  );
}
