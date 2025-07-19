import React, { useState, useEffect } from 'react';
import {
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
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useParams } from 'react-router-dom';
import apiClient from '../../utils/axiosConfig';
import dayjs from 'dayjs';
import SidebarClub from '../../components/SidebarClub';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Footer from '../../components/Footer';

const MySwal = withReactContent(Swal);

export default function RekapitulasiPage() {
  const { clubId } = useParams();
  const [tanggal, setTanggal] = useState(dayjs());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());

  const fetchRekap = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/rekapitulasi?date=${tanggal.format('YYYY-MM-DD')}&club_id=${clubId}`);
      setData(res.data);
    } catch (error) {
      MySwal.fire({
        icon: 'error',
        title: 'Gagal memuat data!',
        toast: true,
        timer: 3000,
        position: 'top-end',
        showConfirmButton: false
      });
    } finally {
      setLoading(false);
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
      MySwal.fire({
        icon: 'error',
        title: 'Gagal export Excel!',
        toast: true,
        timer: 3000,
        position: 'top-end',
        showConfirmButton: false
      });
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
      MySwal.fire({
        icon: 'error',
        title: 'Export filter gagal!',
        toast: true,
        timer: 3000,
        position: 'top-end',
        showConfirmButton: false
      });
    }
  };

  return (
    <div>
    <div className="flex">
      <SidebarClub />
      <motion.main
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex-1 p-10 pt-24 md:ml-64"
      >
        <Typography variant="h6" className="pb-14">Rekapitulasi Presensi</Typography>
        <div className="mb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
            <Button variant="outlined" onClick={() => setOpenModal(true)}>
              Rekap Filter
            </Button>
          </div>
        </div>

        <Paper elevation={2}>
          <TableContainer>
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                      Tunggu sebentar...
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
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
                      <TableCell>{item.student?.class} {item.student?.jurusan?.singkatan} {item.student?.rombel}</TableCell>
                      <TableCell>{item.status}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Modal Filter */}
        <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', color: '#1e3a8a' }}>
            Rekap Filter
          </DialogTitle>
          <DialogContent sx={{ backgroundColor: 'white', py: 3 }}>
            <Box sx={{ mb: 2 }}>
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
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={() => setOpenModal(false)} variant="outlined" color="secondary">
              Batal
            </Button>
            <Button onClick={handleExportFiltered} variant="contained" color="primary">
              Export
            </Button>
          </DialogActions>
        </Dialog>
      </motion.main>
    </div>
    <Footer/>
    </div>
  );
}
