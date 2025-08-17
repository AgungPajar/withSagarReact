import React, { useEffect, useState } from 'react';
import apiClient from '@/utils/axiosConfig';
import { handleUnauthorizedError } from '@/utils/errorHandler';
import { Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import SidebarAdmin from '@/components/layouts/SidebarOsis';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import '../../../css/style.css';

export default function DataKelasXI() {
  const [students, setStudents] = useState([]);
  const [jurusans, setJurusans] = useState([]);
  const [selectedJurusan, setSelectedJurusan] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMajors();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [selectedJurusan]);

  const fetchMajors = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/admin/jurusans');
      setJurusans(res.data); // pastikan API-nya return array
    } catch (err) {
      console.error('Failed fetch majors:', err);
    } finally {
      setIsLoading(false);
    }
  };


  const fetchStudents = async () => {
    try {
      const res = await apiClient.get('/admin/students', {
        params: {
          class: 'XI',
          jurusan: selectedJurusan || undefined,
        },
      });
      setStudents(res.data);
    } catch (err) {
      const handled = await handleUnauthorizedError(err);
        if (handled) {
          return;
        }
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

  const handleDeleteSelected = async () => {
    if (selectedStudents.length === 0) {
      Swal.fire('Oops!', 'Pilih siswa dulu bro!', 'warning');
      return;
    }

    const confirm = await Swal.fire({
      title: 'Yakin mau hapus siswa terpilih?',
      text: 'Data yang dihapus tidak bisa dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus',
      cancelButtonText: 'Batal',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700',
        cancelButton: 'bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded hover:bg-gray-200 ml-2',
      },
    });

    if (confirm.isConfirmed) {
      try {
        for (const id of selectedStudents) {
          await apiClient.delete('/admin/students/delete-multiple', {
            data: { ids: selectedStudents },
          });

        }
        Swal.fire('Sukses', 'Siswa berhasil dihapus', 'success');
        fetchStudents();
        setSelectedStudents([]);
      } catch (err) {
        console.error(err);
        Swal.fire('Gagal', 'Gagal menghapus data siswa', 'error');
      }
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

        // Tangani error duplikat NISN
        if (
          err.response &&
          err.response.data &&
          typeof err.response.data.message === 'string' &&
          err.response.data.message.includes('Duplicate entry')
        ) {
          // Ambil NISN & Nama siswa (optional, jika backend kasih datanya)
          const match = err.response.data.message.match(/Duplicate entry '(\d+)'/);
          const nisn = match ? match[1] : 'NISN tidak diketahui';

          // Tampilkan alert khusus
          Swal.fire(
            'Gagal Upload',
            `Data siswa dengan NISN ${nisn} sudah terdaftar.`,
            'error'
          );
        } else {
          // Error umum
          Swal.fire('Gagal', 'Terjadi kesalahan saat upload', 'error');
        }
      }
    };
    input.click();
  };

  const handleNaikKelas = () => {
    Swal.fire({
      title: 'Naik ke kelas?',
      input: 'select',
      inputOptions: {
        XII: 'XII',
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
      <main className="flex-1 p-6 pt-24 md:pt-16 md:ml-64 w-full">
        <Typography variant="h5" className="mb-4 font-bold">DATA KELAS 11 (SEBELAS)</Typography>

        <div className="flex pt-8 flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <Button variant="contained" color="success" onClick={handleInsertData} className="text-xs px-3 py-1.5 sm:text-sm sm:px-4 sm:py-2">
            Insert Data
          </Button>
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

          <input
            type="text"
            placeholder="Cari Nama atau NISN"
            className="border p-2 rounded text-sm w-full md:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleDeleteSelected}
              className="text-xs px-3 py-2 sm:text-sm sm:px-4 sm:py-2 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition duration-200"
            >
              Hapus Siswa
            </button>
            <button
              onClick={handleNaikKelas}
              className="text-xs px-3 py-2 sm:text-sm sm:px-4 sm:py-2 border border-yellow-500 text-yellow-500 rounded hover:bg-yellow-500 hover:text-white transition duration-200"
            >
              Naikkan ke Kelas
            </button>
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
                <th className="p-2 w-40 border-l border-r">NISN</th>
                <th className="p-2 w-64 border-l border-r">Nama</th>
                <th className="p-2 w-40 border-l border-r">Kelas</th>
                <th className="p-2 w-40 border-l border-r">Phone</th>
                <th className="p-2 w-40 border-l border-r">Ekskul</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500 font-semibold">
                    Sedang Memuat Data...
                  </td>
                </tr>
              ) : (
                students
                  .filter((s) => {
                    const matchesJurusan = !selectedJurusan || s.jurusan?.singkatan === selectedJurusan;
                    const matchesSearch =
                      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      s.nisn.toLowerCase().includes(searchQuery.toLowerCase());
                    return matchesJurusan && matchesSearch;
                  })
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
                      <td className="p-2 w-40 border-l border-r">{s.nisn}</td>
                      <td className="p-2 w-64 border-l border-r">{s.name}</td>
                      <td className="p-2 w-40 border-l border-r">{s.class} {s.jurusan?.singkatan} {s.rombel}</td>
                      <td className="p-2 w-64 border-l border-r">{s.phone}</td>
                      <td className="p-2 w-40 border-l border-r">
                        {s.clubs?.map((club) => club.name).join(', ') || '-'}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
