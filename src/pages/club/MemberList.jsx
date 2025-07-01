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


export default function MemberList() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  const handleDownloadTemplate = () => {
    const worksheetData = [
      ['DAFTAR ANGGOTA'],
      [],
      ['NO', 'NISN', 'Nama', 'Kelas'],
    ];

    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Anggota');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'template_anggota.xlsx');
  };

  const handleExcelUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }).slice(3);

      try {
        for (const row of rows) {
          await apiClient.post(`/clubs/${clubId}/members`, {
            nisn: row[1]?.toString(),
            name: row[2],
            class: row[3] || '',
          });
        }
        alert('Data anggota berhasil ditambahkan!');
        window.location.reload();
      } catch (error) {
        console.error('Error upload:', error);
        alert('Gagal upload data anggota.');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSeleksi = async () => {
    if (pendingRequests.length === 0) {
      Swal.fire({
        title: 'Info',
        text: 'Belum ada anggota yang bisa diseleksi',
        icon: 'info',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'swal2-confirm',
        }
      });
      return;
    }

    const tableRows = pendingRequests.map((member, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${member.name}</td>
      <td>${member.class}</td>
      <td>${member.nisn}</td>
      <td>
        <button class="btn-accept" data-id="${member.id}">Terima</button>
        <button class="btn-reject" data-id="${member.id}">Tolak</button>
      </td>
    </tr>
  `).join('');

    const htmlContent = `
    <style>
      .custom-swal-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 1rem;
      }
      .custom-swal-table th, .custom-swal-table td {
        border: 1px solid #ddd;
        padding: 8px;
        font-size: 14px;
      }
      .custom-swal-table th {
        background-color: #f2f2f2;
        font-weight: bold;
      }
      .btn-accept {
        background-color: #4CAF50;
        color: white;
        border: none;
        padding: 6px 12px;
        margin-right: 5px;
        cursor: pointer;
        border-radius: 4px;
      }
      .btn-reject {
        background-color: #f44336;
        color: white;
        border: none;
        padding: 6px 12px;
        cursor: pointer;
        border-radius: 4px;
      }
    </style>

    <table class="custom-swal-table">
      <thead>
        <tr>
          <th>No</th>
          <th>Nama</th>
          <th>Kelas</th>
          <th>NISN</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>${tableRows}</tbody>
    </table>
  `;

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
          });
        });

        swalEl.querySelectorAll('.btn-reject').forEach(btn => {
          btn.addEventListener('click', async () => {
            const id = btn.getAttribute('data-id');
            await updateStatus(id, 'rejected');
          });
        });
      }
    });


    // Attach event listeners to buttons
    document.querySelectorAll('.btn-accept').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        await updateStatus(id, 'accepted');
      });
    });

    document.querySelectorAll('.btn-reject').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        await updateStatus(id, 'rejected');
      });
    });
  };

  const updateStatus = async (requestId, status) => {
    try {
      await apiClient.post(`/clubs/${clubId}/requests/${requestId}/confirm`, { status });

      // Tampilkan toast
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Anggota telah ${status === 'accepted' ? 'diterima' : 'ditolak'}`,
        showConfirmButton: false,
        timer: 2000,
      });

      // Hapus dari daftar pending
      setPendingRequests(prev => prev.filter(m => m.id !== parseInt(requestId)));

      // Fetch ulang anggota yang accepted
      const res = await apiClient.get(`/clubs/${clubId}/members`);
      setMembers(res.data);
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


  useEffect(() => {
    const fetchData = async () => {
      try {
        const resMembers = await apiClient.get(`/clubs/${clubId}/members`);
        setMembers(resMembers.data);

        const resRequests = await apiClient.get(`/clubs/${clubId}/requests`);
        setPendingRequests(resRequests.data); // ini penting
      } catch (error) {
        console.error("Fetch error:", error);
        alert('Gagal memuat data ekskul: ' + error.message);
      }
    };
    fetchData();
  }, [clubId]);

  const handleDelete = async (requestId) => {
    if (window.confirm('Yakin ingin menghapus anggota ini?')) {
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
    <div className="min-h-screen bg-white text-gray-800 p-6 pt-10">
      {/* Navbar */}
      <SidebarClub />
      <main style={{ marginTop: '4vh' }} className="flex-1 p-4 pt-20 md:pt-16 md:ml-64 w-full">
        <Paper className="mt-6 w-full max-w-6xl mx-auto p-4">
          <Typography variant="h6" className="mb-10">Daftar Anggota Ekskul</Typography>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            <Button variant="contained" onClick={() => navigate(`/club/${clubId}/members/add`)}>
              + Add Anggota
            </Button>
            <Button variant="contained" color="secondary" onClick={handleSeleksi}>
              Seleksi
            </Button>
          </div>

          {/* Tabel scrollable di mobile */}
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
                {members.map((student, index) => (
                  <TableRow key={student.request_id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{student.nisn}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.phone}</TableCell>
                    <TableCell>{student.class}</TableCell>
                    <TableCell className="space-x-2">
                      <Button size="small" variant="outlined" onClick={() => handleDelete(student.id)}>Hapus</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Paper>
      </main>
    </div>
  );
}
