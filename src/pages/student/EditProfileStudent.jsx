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
    <div className="min-h-screen flex justify-center items-center bg-blue-100 px-4 py-10 font-sans">
      <div className="w-full max-w-md bg-white border-4 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">

        {/* Header dengan tombol kembali */}
        <div className="relative mb-8 flex justify-center items-center text-black">
          <button
            onClick={() => navigate(`/student/${studentId}`)}
            className="absolute left-0 flex items-center bg-yellow-300 border-4 border-black px-3 py-1 font-black text-sm uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            &lt; KEMBALI
          </button>
          <h2 className="text-2xl font-black uppercase tracking-wider bg-purple-300 px-3 py-1 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            EDIT PROFIL
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-black text-black mb-2 uppercase text-sm">NISN</label>
            <input
              type="text"
              name="nisn"
              value={formData.nisn}
              className="w-full border-4 border-black bg-gray-200 text-gray-600 font-bold rounded-lg px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
              disabled
              placeholder="NISN tidak dapat diubah"
            />
          </div>

          <div>
            <label className="block font-black text-black mb-2 uppercase text-sm">Nama</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border-4 border-black bg-white text-black font-bold rounded-lg px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[4px] focus:translate-y-[4px] focus:shadow-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block font-black text-black mb-2 uppercase text-sm">Nomor Telp</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border-4 border-black bg-white text-black font-bold rounded-lg px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[4px] focus:translate-y-[4px] focus:shadow-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block font-black text-black mb-2 uppercase text-sm">Tanggal Lahir</label>
            <input
              type="date"
              name="tanggal_lahir"
              value={formData.tanggal_lahir}
              onChange={handleChange}
              className="w-full border-4 border-black bg-white text-black font-bold rounded-lg px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[4px] focus:translate-y-[4px] focus:shadow-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block font-black text-black mb-2 uppercase text-sm">Alamat</label>
            <input
              type="text"
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              className="w-full border-4 border-black bg-white text-black font-bold rounded-lg px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[4px] focus:translate-y-[4px] focus:shadow-none transition-all"
              required
            />
          </div>

          <div className="flex flex-col gap-4 mt-8 pt-4">
            <button
              type="button"
              onClick={handleChangePassword}
              className="w-full bg-red-400 border-4 border-black text-black font-black py-3 rounded-lg uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all"
            >
              UBAH PASSWORD
            </button>

            <button
              type="submit"
              disabled={loadingSubmit}
              className={`w-full border-4 border-black font-black py-3 rounded-lg uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all ${
                loadingSubmit
                  ? 'bg-gray-400 text-gray-700 cursor-wait'
                  : 'bg-green-400 text-black cursor-pointer'
              }`}
            >
              {loadingSubmit ? 'MENYIMPAN...' : 'SIMPAN PERUBAHAN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileStudent;
