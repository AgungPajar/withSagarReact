import { useEffect, useState } from "react";
import apiClient from "@/utils/axiosConfig";
import { handleUnauthorizedError } from "@/utils/errorHandler";
import Swal from "sweetalert2";

export default function useStudentData(classLevel) {
  const [students, setStudents] = useState([]);
  const [jurusans, setJurusans] = useState([]);
  const [selectedJurusan, setSelectedJurusan] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isInitialDataLoading, setInitialDataLoading] = useState(true);

  const [clubs, setClubs] = useState([]);
  const [selectedClubs, setSelectedClubs] = useState([])
  const [isFilterModalOpen, setFilterModalOpen] = useState(false)

  const promotionOptions = {
    X: { XI: 'Naik ke Kelas XI' },
    XI: { XII: 'Naik ke Kelas XII' },
    XII: { Lulus: 'Luluskan Siswa' },
  };

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/admin/students', {
        params: {
          class: classLevel,
          jurusan: selectedJurusan || undefined,
        },
      });
      setStudents(res.data);
    } catch (error) {
      const handled = await handleUnauthorizedError(error);
      if (handled) return;
    } finally {
      setIsLoading(false);
    };
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setInitialDataLoading(true);
      try {
        const [jurusansRes, clubsRes] = await Promise.all([
          apiClient.get('/admin/jurusans'),
          apiClient.get('/clubs')
        ]);
        setJurusans(jurusansRes.data);
        setClubs(clubsRes.data);
      } catch (error) {
        console.error("Failed to fetch initial data", error);
      } finally {
        setInitialDataLoading(false);
      }
    }
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [selectedJurusan, classLevel]);

  const handleCheckboxChange = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === students.length && students.length > 0) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map((s) => s.id));
    };
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await apiClient.get('/students/download-template', {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'template_import_siswa.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
      Swal.fire('Gagal', 'Tidak bisa download template', 'error');
    };
  };

  const handleUploadExcel = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx, .xls';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      try {
        await apiClient.post('/admin/students/import', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        Swal.fire('Sukses', 'Data berhasil diupload', 'success')
        fetchStudents();
      } catch (err) {
        console.error(err);
        if (err.response?.data?.message?.includes('Duplicate entry')) {
          const match = err.response.data.message.match(/Duplicate entry '(\d+)'/);
          const nisn = match ? match[1] : 'tertentu';
          Swal.fire(
            'Gagal Upload',
            `Data siswa dengan NISN ${nisn} sudah terdaftar.`,
            'error'
          );
        }
      }
    };
    input.click();
  };

  const handleInsertData = () => {
    Swal.fire({
      title: 'Insert Data Siswa',
      html: `<button id="uploadBtn" class="swal2-confirm swal2-styled">Upload Excel</button>
             <button id="downloadBtn" class="swal2-confirm swal2-styled" style="margin-left: 10px; background:#4caf50">Download Template</button>`,
      showConfirmButton: false,
      didOpen: () => {
        document.getElementById('uploadBtn').addEventListener('click', handleUploadExcel);
        document.getElementById('downloadBtn').addEventListener('click', handleDownloadTemplate)
      }
    });
  };

  const handleDeleteSelected = async () => {
    if (selectedStudents.length === 0) {
      Swal.fire('Oops!', 'Pilih siswa Terlebih dahulu', 'warning')
      return;
    }
    const result = await Swal.fire({
      title: 'Konfirmasi Hapus Siswa',
      text: 'Data yang dihapus akan terhapus selamanya',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'BATALL!',
      customClass: {
        confirmButton: 'my-confirm-btn',
        cancelButton: 'my-cancel-btn'
      }
    });

    if (result.isConfirmed) {
      try {
        await apiClient.delete('/admin/students/delete-multiple', {
          data: { ids: selectedStudents },
        });
        Swal.fire('Sukses', 'Siswa berhasil dihapus', 'success')
        fetchStudents();
        setSelectedStudents();
      } catch (err) {
        console.error(err)
        Swal.fire('Gagal', 'Terjadi Kesalahan', 'error')
      }
    }
  };

  const handleNaikKelas = () => {
    const options = promotionOptions[classLevel];
    if (!options || Object.keys(options).length === 0) {
      Swal.fire('Info', 'Tidak ada pilihan kenaikan kelas untuk tingkat ini.', 'info');
      return;
    }
    if (selectedStudents.length === 0) {
      Swal.fire('Oops!', 'Pilih siswa dulu yang mau dinaikkan kelas!', 'warning');
      return;
    }
    Swal.fire({
      title: 'Pindahkan Siswa',
      input: 'select',
      inputOptions: options,
      inputPlaceholder: 'Pilih Tujuan',
      showCancelButton: true,
      confirmButtonText: 'proses',
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        const targetClass = result.value;
        const action = targetClass === 'Lulus' ? 'Meluluskan' : 'Menaikan';
        try {
          await apiClient.post('/admin/students/naik-kelas', {
            ids: selectedStudents,
            class: targetClass,
          });
          Swal.fire('Sukses', `Siswa berhasil di${action}`, 'success');
          fetchStudents();
          setSelectedStudents([]);
        } catch (err) {
          Swal.fire('Gagal', `Terjadi kesalahan saat ${action} siswa`, 'error');
        }
      }
    })
  };

  return {
    students,
    jurusans,
    selectedJurusan,
    selectedStudents,
    setSelectedJurusan,
    isLoading,
    searchQuery,
    setSearchQuery,
    handleSelectAll,
    handleCheckboxChange,
    handleInsertData,
    handleDeleteSelected,
    handleNaikKelas,

    clubs,
    selectedClubs,
    setSelectedClubs,
    isFilterModalOpen,
    setFilterModalOpen,
    isInitialDataLoading,
  }

}