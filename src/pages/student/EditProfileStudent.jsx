import React, { useState, useEffect } from 'react';
import apiClient from '@/utils/axiosConfig';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '@/components/LoadingSpinner';
import {Button} from '@mui/material';

const EditProfileStudent = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    nisn: '',
    phone: '',
    tanggal_lahir: '',
    alamat: '',
    password: '',
  });

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const user = JSON.parse(localStorage.getItem('user'));
  const studentHashId = user?.student_hash_id;

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const response = await apiClient.get(`/student/${studentHashId}`);
        const { name, nisn, phone, tanggal_lahir, alamat } = response.data;
        setFormData({
          name: name || '',
          nisn: nisn || '',
          phone: phone || '',
          alamat: alamat || '',
          tanggal_lahir: tanggal_lahir || '',
          password: '',
        });
      } catch (err) {
        console.error('Gagal fetch student:', err);
        Swal.fire({
          icon: 'error',
          title: 'Gagal ambil data',
          text: 'Coba refresh halaman.',
        });
      } finally {
        setLoadingData(false);
      }
    };

    if (studentHashId) fetchStudentProfile();
  }, [studentHashId]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getCsrfToken = async () => {
    try {
      await apiClient.get('/sanctum/csrf-cookie', { withCredentials: true });
    } catch (err) {
      console.error('Gagal ambil CSRF Token:', err);
    }
  };

  const handleChangePassword = () => {
    Swal.fire({
      title: 'Ubah Password',
      html: `
      <div style="position: relative;">
        <input type="password" id="oldPassword" class="swal2-input" placeholder="Password Lama" />
        <span onclick="toggleVisibility('oldPassword', this)" style="position:absolute; right:30px; top:12px; cursor:pointer; font-size:12px;">Show</span>
      </div>
      <div style="position: relative;">
        <input type="password" id="newPassword" class="swal2-input" placeholder="Password Baru" />
        <span onclick="toggleVisibility('newPassword', this)" style="position:absolute; right:30px; top:12px; cursor:pointer; font-size:12px;">Show</span>
      </div>
      <div style="position: relative;">
        <input type="password" id="confirmPassword" class="swal2-input" placeholder="Konfirmasi Password Baru" />
        <span onclick="toggleVisibility('confirmPassword', this)" style="position:absolute; right:30px; top:12px; cursor:pointer; font-size:12px;">Show</span>
      </div>
    `,
      customClass: {
        confirmButton: 'swal2-confirm btn btn-outline-purple',
        cancelButton: 'swal2-cancel btn btn-outline-gray',
      },
      showCancelButton: true,
      confirmButtonText: 'Simpan',
      cancelButtonText: 'Batal',
      reverseButtons: true, // bikin simpan di kanan
      preConfirm: () => {
        const oldPassword = document.getElementById('oldPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!oldPassword || !newPassword || !confirmPassword) {
          Swal.showValidationMessage('Semua kolom harus diisi');
          return false;
        }

        if (newPassword !== confirmPassword) {
          Swal.showValidationMessage('Password baru tidak cocok');
          return false;
        }

        return { oldPassword, newPassword, confirmPassword };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          Swal.showLoading();
          await getCsrfToken();

          const token = localStorage.getItem('access_token');
          const xsrfToken = document.cookie
            .split(';')
            .find(row => row.startsWith('XSRF-TOKEN='))
            ?.split('=')[1];

          await apiClient.post('/profile/update', {
            old_password: result.value.oldPassword,
            new_password: result.value.newPassword,
            new_password_confirmation: result.value.confirmPassword,
          }, {
            headers: {
              ...(token && { Authorization: `Bearer ${token}` }),
              ...(xsrfToken && { 'X-XSRF-TOKEN': decodeURIComponent(xsrfToken) }),
            },
            withCredentials: true,
          });

          Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Password berhasil diperbarui',
            timer: 2000,
            showConfirmButton: false,
          });
        } catch (err) {
          console.error('Gagal ubah password:', err);
          Swal.fire({
            icon: 'error',
            title: 'Oops!',
            text: err?.response?.data?.message || 'Terjadi kesalahan saat mengubah password',
          });
        }
      }
    });
  };

  window.toggleVisibility = function (id, el) {
    const input = document.getElementById(id);
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    el.textContent = isHidden ? 'Hide' : 'Show';
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    try {
      await apiClient.post('/update-profile-student', formData);
      Swal.fire({
        icon: 'success',
        title: 'Profil berhasil diupdate!',
        confirmButtonColor: '#3B82F6',
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal update!',
        text: 'Coba lagi nanti.',
        confirmButtonColor: '#EF4444',
      });
    }

    setLoadingSubmit(false);
  };

  if (loadingData) return <LoadingSpinner />;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-200 to-purple-300 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">

        {/* Header dengan tombol kembali */}
        <div className="relative mb-6 flex justify-center items-center text-blue-800">
          <button
            onClick={() => navigate(`/student/${studentId}`)}
            className="absolute left-0 flex items-center text-blue-700 hover:text-blue-500 font-semibold text-sm"
          >
            &lt; Back
          </button>
          <h2 className="text-2xl font-bold">Edit Profile</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">NISN</label>
            <input
              type="text"
              name="nisn"
              value={formData.nisn}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
              placeholder="NISN tidak dapat diubah"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Nama</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Nomor Telp</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Tanggal Lahir</label>
            <input
              type="date"
              name="tanggal_lahir"
              value={formData.tanggal_lahir}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Alamat</label>
            <input
              type="text"
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <Button
            variant='outlined'
            color="error"
            fullWidth
            className='mb-4 mt-8'
            onClick={handleChangePassword}
          >
            Ubah Password
          </Button>

          <button
            type="submit"
            disabled={loadingSubmit}
            className={`w-full py-3 rounded-lg font-semibold transition duration-200 ${loadingSubmit
              ? 'bg-blue-400 cursor-wait text-white'
              : 'border-2 border-blue-500 text-blue-500 hover:bg-blue-200 hover:text-white'
              }`}
          >
            {loadingSubmit ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileStudent;
