import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../utils/axiosConfig';
import dayjs from 'dayjs';

export default function RekapitulasiPage() {
  const navigate = useNavigate();
  const { clubId } = useParams();
  const [tanggal, setTanggal] = useState(dayjs());
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());


  const handleBack = () => navigate(-1);

  const fetchRekap = async () => {
    try {
      const res = await apiClient.get(`/rekapitulasi?date=${tanggal.format('YYYY-MM-DD')}&club_id=${clubId}`);
      setData(res.data);
    } catch (error) {
      console.error('❌ Gagal fetch rekap:', error);
      alert('Gagal memuat data rekap');
    }
  };

  useEffect(() => {
    if (clubId) fetchRekap();
  }, [tanggal, clubId]);

  const handleExport = async (type) => {
    try {
      const formattedDate = tanggal.format('YYYY-MM-DD');
      const formattedMonth = tanggal.format('YYYY-MM');

      const url =
        type === 'daily'
          ? `/export/harian?date=${formattedDate}&club_id=${clubId}`
          : `/export/bulanan?month=${formattedMonth}&club_id=${clubId}`;

      const res = await apiClient.get(url, { responseType: 'blob' });

      const blob = new Blob([res.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download =
        type === 'daily'
          ? `rekap-${formattedDate}.xlsx`
          : `rekap-bulanan-${formattedMonth}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('❌ Gagal export:', error);
      alert('Gagal export Excel');
    }
  };

  const handleExportFiltered = async () => {
    try {
      const from = fromDate.format('YYYY-MM-DD');
      const to = toDate.format('YYYY-MM-DD');

      const url = `/rekap/export/monthly?club_id=${clubId}&from_date=${from}&to_date=${to}`;
      const res = await apiClient.get(url, { responseType: 'blob' });

      const blob = new Blob([res.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `rekap-filter-${from}_to_${to}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setOpenModal(false);
    } catch (error) {
      console.error('❌ Gagal export:', error);
      alert('Gagal mengunduh rekap filter tanggal');
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      {/* ✅ Navbar */}
      <AppBar
        position="static"
        color="inherit"
        style={{ boxShadow: 'none', borderRadius: 50, border: '1px solid #97C1FF' }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <IconButton edge="start" color="inherit" onClick={handleBack}>
            <ArrowBackIosNewIcon />
          </IconButton>
          <Typography variant="h6">Rekapitulasi Presensi</Typography>
          <div />
        </Toolbar>
      </AppBar>

      {/* 🔍 Filter + Export */}
      <div className="flex items-center justify-between my-5 gap-4 flex-wrap">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Filter Tanggal"
            value={tanggal}
            onChange={(newValue) => setTanggal(newValue)}
            format="YYYY-MM-DD"
            slotProps={{ textField: { fullWidth: false } }}
          />
        </LocalizationProvider>

        <div className="flex gap-2">
          <Button variant="outlined" onClick={() => handleExport('daily')}>
            Export Harian
          </Button>
          <Button size="small" variant="outlined" onClick={() => setOpenModal(true)}>
            Rekap Filter
          </Button>
        </div>
      </div>

      {/* 📊 Tabel Rekap */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Nama</TableCell>
              <TableCell>Kelas</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Tidak ada data
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.student?.name}</TableCell>
                  <TableCell>{item.student?.class}</TableCell>
                  <TableCell>{item.status}</TableCell> 
                  {/* Jika Hadir berwarna hijau jika tidak berwarna merah */}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer */}
      <footer style={{ marginTop: 32, textAlign: 'center', fontSize: 12, color: '#555' }}>
        © 2025 OSIS SMK NEGERI 1 GARUT
      </footer>

      {/* modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            color: '#1e3a8a',
            borderBottom: '1px solid #90caf9',
            backgroundColor: 'white',
            marginBottom: 2,
          }}
        >
          Rekap Filter
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: 'white', py: 3 }}>
          <Box sx={{ mb: 2, mt: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Dari Tanggal"
                value={fromDate}
                onChange={(newValue) => setFromDate(newValue)}
                format="YYYY-MM-DD"
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Box>
          <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Sampai Tanggal"
                value={toDate}
                onChange={(newValue) => setToDate(newValue)}
                format="YYYY-MM-DD"
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 3, py: 2, backgroundColor: 'white' }}>
          <Button onClick={() => setOpenModal(false)} variant="outlined" color="secondary">
            Batal
          </Button>
          <Button onClick={handleExportFiltered} variant="contained" color="primary">
            Export
          </Button>
        </DialogActions>
      </Dialog>

    </div>

  );

}

