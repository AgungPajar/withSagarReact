import React, { useState } from 'react';
import { useNavigate, useParams, } from 'react-router-dom';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Typography,
  Paper
} from '@mui/material';
import { motion } from 'framer-motion';
import { useMembers } from '@/hooks/Clubs/useMembers';
import SidebarClub from '@/components/ClubDetail/SidebarClub';
import LoadingSpinner from '@/components/LoadingSpinner';
import Footer from '@/components/layouts/Footer';
import AddMemberDialog from './AddMemberDialog'

export default function MemberList() {
  const { clubId } = useParams();
  const navigate = useNavigate();

  const {
    loading,
    searchName,
    setSearchName,
    openAddDialog,
    setOpenAddDialog,
    filteredMembers,
    filteredAvailableStudents,
    handleSeleksi,
    handleDeleteMember,
    handleAddStudent,
  } = useMembers(clubId);

  const [isExpanded, setIsExpanded] = useState(false);
  if (loading) {
    return <div className="min-h-screen flex justify-center items-center"><LoadingSpinner /></div>;
  }

  // Ganti seluruh return() dengan ini

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarClub isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

      <div className="flex-1 flex flex-col w-full overflow-hidden">
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex-1 p-4 sm:p-6 transition-all duration-300 mt-20 sm:mt-2 ${isExpanded ? 'md:ml-[17vw]' : 'md:ml-[7vw]'}`}
        >
          <Paper className="p-4 sm:p-6 rounded-xl shadow-lg w-full">
            <Typography variant="h5" className="font-bold text-center pb-10">Daftar Anggota Ekskul</Typography>

            <div className="flex flex-col justify-between sm:flex-row items-stretch sm:items-center gap-3 mb-4">
              <input
                type="text"
                placeholder="Cari nama..."
                className="border px-4 sm:px-7 py-2 rounded-lg text-sm w-full sm:w-auto"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
              <div className='flex flex-col sm:flex-row gap-3'>
              <Button variant="contained" onClick={() => setOpenAddDialog(true)} className="w-full sm:w-auto">+ Tambah Anggota</Button>
              <Button variant="contained" color="secondary" onClick={handleSeleksi} className="w-full sm:w-auto">Seleksi Pendaftar</Button>
              </div>
            </div>

            {/* Div pembungkus tabel ini udah bener */}
            <div className="overflow-x-auto">
              <Table size="small">
                <TableHead className='border-t-2 border-gray-300'>
                  <TableRow>
                    <TableCell>No</TableCell>
                    <TableCell>NISN</TableCell>
                    <TableCell>Nama</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Kelas</TableCell>
                    <TableCell>Aksi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredMembers.map((student, index) => (
                    <TableRow key={student.request_id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{student.nisn}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.phone}</TableCell>
                      <TableCell>{student.class} {student.jurusan_singkatan} {student.rombel}</TableCell>
                      <TableCell>
                        <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteMember(student.id)}>Hapus</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Paper>
        </motion.main>

        <Footer />
      </div>

      {/* Dialog tidak ada perubahan */}
      <AddMemberDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        searchName={searchName}
        setSearchName={setSearchName}
        students={filteredAvailableStudents}
        onAdd={handleAddStudent}
      />
    </div>
  );
}