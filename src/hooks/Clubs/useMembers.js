import {useState,useEffect, useMemo, useCallback} from 'react'
import apiClient from '@/utils/axiosConfig'
import Swal from 'sweetalert2'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export const useMembers = (clubId) => {
  const [members, setMembers] = useState([])
  const [pendingRequests, setPendingRequests] = useState([])
  const [availableStudents, setAvailableStudents] = useState([])
  const [loading, setLoading] = useState(true)

  const [searchName, setSearchName] = useState('')
  const [openAddDialog, setOpenAddDialog] = useState(false)

  const kelasOrder = useMemo(() => ({X: 1, XI: 2, XII: 3}), [])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [resMembers, resRequests, resAvailable] = await Promise.all([
        apiClient.get(`/clubs/${clubId}/members`),
        apiClient.get(`/clubs/${clubId}/requests`),
        apiClient.get(`/clubs/${clubId}/available-students`),
      ]);
      setMembers(resMembers.data)
      setPendingRequests(resRequests.data)
      setAvailableStudents(resAvailable.data)
    } catch (error) {
      Swal.fire('Error', 'Gagal memuat data:' + error.message, 'error')
    } finally {
      setLoading(false)
    }
  }, [clubId])

  useEffect(() => {
    fetchData();
  }, [fetchData])

  const updateRequestStatus = async (requestId, status) => {
    try {
      await apiClient.post(`/clubs/${clubId}/requests/${requestId}/confirm`, {status})
      Swal.fire({ 
        toast: true, 
        position: 'top-end', 
        icon: 'success', 
        title: `Anggota telah ${status === 'accepted' ? 'diterima' : 'ditolak'}`, 
        showConfirmButton: false, 
        timer: 2000 
      });
      await fetchData();
      Swal.close()
    } catch (error) {
      Swal.fire({ 
        toast: true, 
        position: 'top-end', 
        icon: 'error', 
        title: 'Gagal update status', 
        showConfirmButton: false, 
        timer: 2000 
      });
    }
  }

  const handleDeleteMember = async (requestId) => {
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

  const handleAddStudent = async (studentId) => {
    try {
      await apiClient.post(`/clubs/${clubId}/add-student`, {
        student_id: studentId,
      });

      Swal.fire({
        toast: true,
        icon: 'success',
        title: 'Berhasil ditambahkan',
        timer: 2000,
        showConfirmButton: false,
        position: 'top-end',
      });

      fetchData()
      setOpenAddDialog(false);
    } catch (err) {
      Swal.fire({
        toast: true,
        icon: 'error',
        title: 'Gagal menambahkan',
        timer: 2000,
        showConfirmButton: false,
        position: 'top-end',
      });
    }
  }

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

  const filteredMembers = useMemo(() => 
    [...members]
      .filter((m) => m.name.toLowerCase().includes(searchName.toLowerCase()))
      .sort((a, b) => {
        const kelasA = kelasOrder[a.class] || 99;
        const kelasB = kelasOrder[b.class] || 99;
        if (kelasA !== kelasB) return kelasA - kelasB;
        const rombelA = parseInt(a.rombel) || 0;
        const rombelB = parseInt(b.rombel) || 0;
        if (rombelA !== rombelB) return rombelA - rombelB;
        return a.name.localeCompare(b.name);
      }), 
    [members, searchName, kelasOrder]
  );
  
  const filteredAvailableStudents = useMemo(() =>
    availableStudents.filter((siswa) =>
      siswa.name.toLowerCase().includes(searchName.toLowerCase()) ||
      siswa.nisn.includes(searchName)
    )
  , [availableStudents, searchName]);

  return {
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
  };
}