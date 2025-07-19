import React, { useState, useEffect } from 'react';
import apiClient from '../../utils/axiosConfig';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';

const EditProfileStudent = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    nisn: '',
    phone: '',
    tanggal_lahir: '',
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
        const { name, nisn, phone, tanggal_lahir } = response.data;
        setFormData({
          name: name || '',
          nisn: nisn || '',
          phone: phone || '',
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
            <label className="block font-medium text-gray-700 mb-1">Password Baru (Opsional)</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            disabled={loadingSubmit}
            className={`w-full py-3 rounded-lg font-semibold transition duration-200 ${
              loadingSubmit
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
