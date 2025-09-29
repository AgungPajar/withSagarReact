import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, IconButton, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Select, MenuItem, CircularProgress
} from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

import { STORAGE_URL } from '@/utils/axiosConfig';
import Footer from '@/components/layouts/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAttendance } from '@/hooks/Clubs/useAttendance';

export default function AttendancePage() {
  const { clubId } = useParams();
  const navigate = useNavigate();

  const { club, students, loading, sending, handleStatusChange, handleSubmit } = useAttendance(clubId)

  if (loading) {
    return <div className='min-h-screen flex justify-center items-center'><LoadingSpinner /></div>
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6">
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6'
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-black font-semibold mb-4 transition-colors">
          <ArrowLeft size={18} />
          Back
        </button>

        <div className='flex justify-center'>
          <Paper
            elevation={4}
            sx={{ p: { xs: 2, sm: 4 }, widht: '100%', maxWidth: 600, border: '2Apx solid #3b82f6', borderRadius: 3 }}
          >
            <img
              src={club?.logo_path ? `${STORAGE_URL}/${club.logo_path}` : '/logoeks.png'}
              alt="Logo"
              className='w-28 h28 mx-auto mb-4 rounded-full object-cover border-4 border-white shadow-md'
            />

            <Typography variant="h5" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
              Presensi {club ? club.name : 'Memuat...'}
            </Typography>

            <TableContainer component={Paper} sx={{ maxHeight: 400, border: '1px solid #eee' }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>No</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Kelas</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Nama</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '120px' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student, i) => (
                    <TableRow key={student.id} hover>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell className='line-clamp-2'>{student.name}</TableCell>
                      <TableCell>{`${student.class} ${student.jurusan_singkatan} ${student.rombel}`}</TableCell>
                      <TableCell>
                        <Select
                          value={student.status}
                          onChange={e => handleStatusChange(student.id, e.target.value)}
                          fullWidth
                          size="small"
                          sx={{ fontSize: '0.875rem' }}
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

            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, py: 1.5, fontWeight: 'bold' }}
              onClick={handleSubmit}
              disabled={sending}
            >
              {sending ? (
                <span className="flex items-center gap-2">
                  <CircularProgress size={20} color="inherit" /> Mengirim...
                </span>
              ) : (
                'Kirim Presensi'
              )}
            </Button>
          </Paper>
        </div>
      </motion.main>

    </div>
  );
}
