import React, { useEffect, useState } from 'react';
import apiClient from '../../../utils/axiosConfig';
import { Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import SidebarAdmin from '../../../components/SidebarAdmin';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import '../../../css/style.css';

export default function DataKelasX() {
  const [students, setStudents] = useState([]);
  const [jurusans, setJurusans] = useState([]);
  const [selectedJurusan, setSelectedJurusan] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    fetchMajors();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [selectedJurusan]);

  const fetchMajors = async () => {
    try {
      const res = await apiClient.get('/admin/jurusans');
      setJurusans(res.data); // pastikan API-nya return array
    } catch (err) {
      console.error('Failed fetch majors:', err);
    }
  };


  const fetchStudents = async () => {
    try {
      const res = await apiClient.get('/admin/students', {
        params: {
          class: 'X',
          jurusan: selectedJurusan || undefined,
        },
      });
      setStudents(res.data);
    } catch (err) {
      console.error('Failed fetch students:', err);
    }
  };


  const fetchJurusans = async () => {
    try {
      const res = await apiClient.get('/jurusans');
      setJurusans(res.data);
    } catch (err) {
      console.error('Failed fetch jurusans:', err);
    }
  };

  useEffect(() => {
    fetchJurusans();
  }, []);

  const handleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map((s) => s.id));
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleInsertData = () => {
    Swal.fire({
      title: 'Insert Data Siswa',
      html: `<button id="uploadBtn" class="swal2-confirm swal2-styled">Upload Excel</button>
             <button id="downloadBtn" class="swal2-confirm swal2-styled" style="margin-left: 10px; background:#4caf50">Download Template</button>`,
      showConfirmButton: false,
      didOpen: () => {
        document.getElementById('uploadBtn').addEventListener('click', handleUploadExcel);
        document.getElementById('downloadBtn').addEventListener('click', handleDownloadTemplate);
      },
    });
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await apiClient.get('/students/download-template', {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'template_import_siswa.xlsx';
      link.click();
    } catch (err) {
      console.error(err);
      Swal.fire('Gagal', 'Tidak bisa mendownload template', 'error');
    }
  };

  const handleUploadExcel = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx, .xls';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);

      try {
        await apiClient.post('/admin/students/import', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        Swal.fire('Sukses', 'Data berhasil diupload', 'success');
        fetchStudents();
      } catch (err) {
        console.error(err);
        Swal.fire('Gagal', 'Terjadi kesalahan saat upload', 'error');
      }
    };
    input.click();
  };

  const handleNaikKelas = () => {
    Swal.fire({
      title: 'Naik ke kelas?',
      input: 'select',
      inputOptions: {
        XI: 'XI',
      },
      inputPlaceholder: 'Pilih tingkatan baru',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Batal',
      customClass: {
        confirmButton: 'bg-white text-green-600 border border-green-600 rounded px-4 py-2 hover:bg-green-600 hover:text-white transition',
        cancelButton: 'bg-white text-red-600 border border-red-600 rounded px-4 py-2 ml-5 hover:bg-red-600 hover:text-white transition',
      },
      buttonsStyling: false,
      didOpen: () => {
        const select = Swal.getPopup().querySelector('select');
        if (select) {
          select.classList.add(
            'border', 'rounded', 'border-gray-300',
            'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500',
            'transition', 'duration-200', 'text-sm'
          );
        }
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await apiClient.post('/admin/students/naik-kelas', {
            ids: selectedStudents,
            class: result.value,
          });
          Swal.fire('Sukses', 'Siswa berhasil dinaikkan', 'success');
          fetchStudents();
        } catch (err) {
          Swal.fire('Gagal', 'Terjadi kesalahan', 'error');
        }
      }
    });
  };

  return (
    <div className="flex">
      <SidebarAdmin />
      <main className="flex-1 p-6 md:pt-16 md:ml-64 w-full">
        <Typography variant="h5" className="mb-4 font-bold">DATA KELAS 10</Typography>

        <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
          <FormControl size="small" sx={{ minWidth: 200, maxWidth: 250 }}>
            <InputLabel>Filter Jurusan</InputLabel>
            <Select
              className="border border-gray-300 rounded text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              value={selectedJurusan}
              label="Filter Jurusan"
              onChange={(e) => setSelectedJurusan(e.target.value)}
            >
              <MenuItem value="">Semua</MenuItem>
              {jurusans.map((j) => (
                <MenuItem key={j.id} value={j.singkatan}>
                  {j.singkatan}
                </MenuItem>
              ))}
            </Select>
          </FormControl>



          <div className="flex gap-2">
            <Button variant="contained" color="success" onClick={handleInsertData}>
              Insert Data
            </Button>
            <Button variant="outlined" onClick={handleNaikKelas}>
              Naikkan ke Kelas
            </Button>
          </div>
        </div>

        <div className="overflow-auto">
          <table className="min-w-full bg-white text-sm">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-2 w-6 text-center border-l border-r">
                  <input
                    type="checkbox"
                    checked={selectedStudents.length === students.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="p-2 w-8 border-l border-r">No</th>
                <th className="p-2 w-64 border-l border-r">Nama</th>
                <th className="p-2 w-40 border-l border-r">NISN</th>
                <th className="p-2 w-40 border-l border-r">Kelas</th>
                <th className="p-2 w-40 border-l border-r">Ekskul</th>
              </tr>
            </thead>
            <tbody>
              {students
                .filter((s) => !selectedJurusan || s.jurusan?.singkatan === selectedJurusan)
                .map((s, i) => (
                  <tr key={s.id}
                    className={`border-b ${i % 2 === 0 ? 'bg-white' : 'bg-[#e2f4ff]'
                      }`}>
                    <td className="p-2 w-6 text-center border-l border-r">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(s.id)}
                        onChange={() => handleCheckboxChange(s.id)}
                      />
                    </td>
                    <td className="p-2 w-8 border-l border-r">{i + 1}</td>
                    <td className="p-2 w-64 border-l border-r">{s.name}</td>
                    <td className="p-2 w-40 border-l border-r">{s.nisn}</td>
                    <td className="p-2 w-40 border-l border-r">{s.class} {s.jurusan?.singkatan} {s.rombel}</td>
                    <td className="p-2 w-40 border-l border-r">
                      {s.clubs?.map((club) => club.name).join(', ') || '-'}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
