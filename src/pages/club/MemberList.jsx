import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../utils/axiosConfig';
import {
  AppBar,
  Toolbar,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Typography,
  Paper
} from '@mui/material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import SidebarClub from '../../components/SidebarClub';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import LoadingSpinner from '../../components/LoadingSpinner';
import Footer from '../../components/Footer';

export default function MemberList() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');

  const kelasOrder = { X: 1, XI: 2, XII: 3 };

  const filteredMembers = [...members]
    .filter((m) => m.name.toLowerCase().includes(searchName.toLowerCase()))
    .sort((a, b) => {
      const kelasA = kelasOrder[a.class] || 99;
      const kelasB = kelasOrder[b.class] || 99;
      if (kelasA !== kelasB) return kelasA - kelasB;
      const rombelA = parseInt(a.rombel) || 0;
      const rombelB = parseInt(b.rombel) || 0;
      if (rombelA !== rombelB) return rombelA - rombelB;
      return a.name.localeCompare(b.name);
    });

  const handleSeleksi = async () => {
    if (pendingRequests.length === 0) {
      Swal.fire({
        title: 'Info',
        text: 'Nothing Requested',
        icon: 'info',
        confirmButtonText: 'OK',
        toast: true,
        position: 'top-end',
      });
      return;
    }

    const tableRows = pendingRequests.map((member, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${member.name}</td>
        <td>${member.class}</td>
        <td>
          <button class="btn-accept" data-id="${member.id}">Terima</button>
          <button class="btn-reject" data-id="${member.id}">Tolak</button>
        </td>
      </tr>
    `).join('');

    const htmlContent = `
  <style>
  .swal-scroll-wrapper {
    overflow-x: auto;
    max-width: 100%;
  }
  .custom-swal-table {
    min-width: 400px;
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
  }
  .custom-swal-table th,
  .custom-swal-table td {
    border: 1px solid #ddd;
    padding: 8px;
    font-size: 14px;
    text-align: left;
    white-space: nowrap;
  }
  .custom-swal-table th.aksi-col,
  .custom-swal-table td.aksi-col {
    width: 140px;
    text-align: center;
  }
  .btn-accept {
    background-color: #4CAF50;
    color: white;
    padding: 6px 10px;
    border-radius: 4px;
    margin-right: 4px;
    border: none;
    cursor: pointer;
    font-size: 12px;
  }
  .btn-reject {
    background-color: #f44336;
    color: white;
    padding: 6px 10px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    font-size: 12px;
  }
    .no-col, .nama-col, .kelas-col, .aksi-col {
  text-align: center;
  vertical-align: middle;
}

.no-col {
  width: 40px;
}

.nama-col {
  width: 250px;
}

.kelas-col {
  width: 90px;
}

.aksi-col {
  width: 70px;
}


</style>

  <div class="swal-scroll-wrapper">
    <table class="custom-swal-table">
  <thead>
    <tr>
      <th class="no-col">No</th>
      <th class="nama-col">Nama</th>
      <th class="kelas-col">Kelas</th>
      <th class="aksi-col">Aksi</th>
    </tr>
  </thead>
  <tbody>
    ${pendingRequests.map((member, index) => `
      <tr>
        <td class="no-col">${index + 1}</td>
        <td class="nama-col">${member.name}</td>
        <td class="kelas-col">${member.class} ${member.jurusan_singkatan} ${member.rombel}</td>
        <td class="aksi-col">
          <button class="btn-accept" data-id="${member.id}">Terima</button>
          <button class="btn-reject" data-id="${member.id}">Tolak</button>
        </td>
      </tr>
    `).join('')}
  </tbody>
</table>

  </div>`;


    Swal.fire({
      title: 'Konfirmasi Anggota',
      html: htmlContent,
      showConfirmButton: false,
      showCloseButton: true,
      width: '70%',
      didOpen: () => {
        const swalEl = Swal.getPopup();
        swalEl.querySelectorAll('.btn-accept').forEach(btn => {
          btn.addEventListener('click', async () => {
            const id = btn.getAttribute('data-id');
            await updateStatus(id, 'accepted');
            // Swal.close();
            fetchData();
          });
        });
        swalEl.querySelectorAll('.btn-reject').forEach(btn => {
          btn.addEventListener('click', async () => {
            const id = btn.getAttribute('data-id');
            await updateStatus(id, 'rejected');
            // Swal.close();
            fetchData();
          });
        });
      }
    });
  };

  const updateStatus = async (requestId, status) => {
    try {
      await apiClient.post(`/clubs/${clubId}/requests/${requestId}/confirm`, { status });

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Anggota telah ${status === 'accepted' ? 'diterima' : 'ditolak'}`,
        showConfirmButton: false,
        timer: 2000,
      });

      setPendingRequests(prev => prev.filter(m => m.id !== parseInt(requestId)));

      await fetchData();
      Swal.close();

    } catch (err) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Gagal update status',
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  const fetchData = async () => {
    try {
      const resMembers = await apiClient.get(`/clubs/${clubId}/members`);
      setMembers(resMembers.data);
      const resRequests = await apiClient.get(`/clubs/${clubId}/requests`);
      setPendingRequests(resRequests.data);
    } catch (error) {
      alert('Gagal memuat data ekskul: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [clubId]);


  const handleDelete = async (requestId) => {
    const confirm = await Swal.fire({
      title: 'Yakin?',
      text: 'Ingin menghapus anggota ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus',
      cancelButtonText: 'Batal'
    });
    if (confirm.isConfirmed) {
      try {
        await apiClient.delete(`/clubs/${clubId}/requests/${requestId}`);
        setMembers(prev => prev.filter(s => s.request_id !== requestId));
        Swal.fire({
          toast: true,
          icon: 'success',
          title: 'Anggota berhasil dihapus!',
          position: 'top-end',
          timer: 2000,
          showConfirmButton: false
        });
      } catch {
        Swal.fire({
          toast: true,
          icon: 'error',
          title: 'Gagal menghapus anggota',
          position: 'top-end',
          timer: 2000,
          showConfirmButton: false
        });
      }
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-white text-gray-800 p-4 pt-5">
        <div className="flex flex-col items-center justify-center w-full max-w-md md:max-w-full">
          <SidebarClub />
          <motion.main
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex-1 p-4 pt-20 md:pt-16 md:ml-64 w-full"
          >
            {loading ? (
              <LoadingSpinner />
            ) : (
              <Paper className="mt-6 w-full max-w-6xl mx-auto p-4">
                <Typography variant="h6" className="mb-10">Daftar Anggota Ekskul</Typography>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                  <input
                    type="text"
                    placeholder="Cari nama..."
                    className="border px-3 py-1 rounded text-sm"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                  />
                  <Button disabled variant="contained" onClick={() => navigate(`/club/${clubId}/members/add`)}>
                    + Add Anggota
                  </Button>
                  <Button variant="contained" color="secondary" onClick={handleSeleksi}>
                    Seleksi
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <Table size="small">
                    <TableHead>
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
                            <Button size="small" variant="outlined" onClick={() => handleDelete(student.id)}>Hapus</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Paper>
            )}
          </motion.main>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// Nah ini bro di handleSeleksi nya itu ga responsive buat hp, terus kalau semisal udah di pencet Terima atau Tolak itu halamannya otomatis ngerefresh