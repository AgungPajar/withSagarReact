import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
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
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { motion } from 'framer-motion';

import SidebarClub from '@/components/ClubDetail/SidebarClub';
import Footer from '@/components/layouts/Footer';
import { useRecap } from '@/hooks/Clubs/useRecapAtten';


export default function RekapitulasiPage() {
  const [isExpanded, setIsExpanded] = useState(false)
  const { clubId } = useParams();

  const {
    tanggal, setTanggal,
    data,
    loading,
    openModal, setOpenModal,
    fromDate, setFromDate,
    toDate, setToDate,
    handleExport,
  } = useRecap(clubId);


  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarClub isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

      <div className="flex-1 flex flex-col">
        <motion.main
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={`flex-1 p-6 transition-all duration-300 mt-20 sm:mt-2 ${isExpanded ? 'md:ml-[17vw]' : 'md:ml-[7vw]'}`}
        >

          <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white rounded-xl shadow">
            <Typography variant="h5" className="font-bold text-center pb-6">Rekap Presensi</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Filter Tanggal"
                value={tanggal}
                onChange={setTanggal}
                format="DD MMMM YYYY"
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

          <Paper elevation={2} className='overflow-hidden rounded-xl'>
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
                        <CircularProgress size={24} sx={{ py: 4 }} />
                        Tunggu sebentar...
                      </TableCell>
                    </TableRow>
                  ) : data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
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

        </motion.main>
      </div>
      <Footer />


      {/* Modal Filter */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Export Bedasrkan Rentang Tanggal</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker label="Dari Tanggal" value={fromDate} onChange={setFromDate} format="DD/MM/YYYY" />
              <DatePicker label="Sampai Tanggal" value={toDate} onChange={setToDate} format="DD/MM/YYYY" />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Batal</Button>
          <Button onClick={() => handleExport('filtered', { from: fromDate, to: toDate })} variant="contained">
            Export
          </Button>
        </DialogActions>
      </Dialog>
    </div>


  );
}
