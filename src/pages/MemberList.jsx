import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../utils/axiosConfig';
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

export default function MemberList() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);

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

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await apiClient.get(`/clubs/${clubId}/members`);
        setMembers(response.data);
      } catch (error) {
        alert('Gagal memuat anggota ekskul');
      }
    };
    fetchMembers();
  }, [clubId]);

  const handleBack = () => navigate(`/club/${clubId}`);
  const handleEdit = (id) => alert(`Edit siswa ID ${id}`);
  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus anggota ini?')) {
      try {
        await apiClient.delete(`/students/${id}`);
        setMembers(prev => prev.filter(s => s.id !== id));
        alert('Anggota berhasil dihapus!');
      } catch {
        alert('Gagal menghapus anggota');
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6 pt-10">
      {/* Navbar */}
      <AppBar
        position="static"
        color="inherit"
        style={{ boxShadow: 'none', border: '1px solid #97C1FF', borderRadius: 50 }}
        className="bg-white"
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', flexGrow: 1 }}>
          <IconButton edge="start" color="inherit" onClick={handleBack}>
            <ArrowBackIosNewIcon />
          </IconButton>
          <Typography variant="h6"> Anggota</Typography>
          <div />
        </Toolbar>
      </AppBar>

      <Paper className="mt-6 w-full max-w-6xl mx-auto p-4">
        <Typography variant="h6" className="mb-10">Daftar Anggota Ekskul</Typography>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <Button variant="contained" onClick={() => navigate(`/club/${clubId}/members/add`)}>
            + Add Anggota
          </Button>
          <span className="text-sm text-gray-700">Atau Pake:</span>
          <Button variant="outlined" onClick={handleDownloadTemplate}>
            Download Template Excel
          </Button>
          <Button variant="outlined" component="label">
            Upload Excel
            <input type="file" hidden accept=".xlsx, .xls" onChange={handleExcelUpload} />
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
                <TableRow key={student.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{student.nisn}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.phone}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell className="space-x-2">
                    <Button size="small" variant="outlined" onClick={() => handleEdit(student.id)}>Edit</Button>
                    <Button size="small" variant="outlined" onClick={() => handleDelete(student.id)}>Hapus</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Paper>
    </div>
  );
}
