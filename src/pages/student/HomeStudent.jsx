import React, { useEffect, useState } from 'react';
import apiClient from '../../utils/axiosConfig';
import Swal from 'sweetalert2';
import MenuIcon from '@mui/icons-material/Menu';
import { Menu, MenuItem, IconButton, Avatar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import InfoIcon from '@mui/icons-material/Info';
import { FaCheckCircle, FaWhatsapp, FaClock } from 'react-icons/fa';


export default function HomeStudent() {
  const [student, setStudent] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const user = JSON.parse(localStorage.getItem('user'));
  const studentHashId = user?.student_hash_id;

  const handleDaftarEkskul = async (clubHashId) => {
    try {
      const res = await apiClient.post(`/clubs/${clubHashId}/request-join`);
      Swal.fire('Sukses!', res.data.message, 'success');

      // Refresh data biar tombol berubah otomatis
      const studentRes = await apiClient.get(`/student/${studentHashId}/dashboard`);
      setStudent(studentRes.data.student);
      setClubs(studentRes.data.clubs);
    } catch (err) {
      console.error('Error daftar ekskul:', err.response?.data || err);
      Swal.fire('Gagal!', err.response?.data?.message || 'Terjadi kesalahan', 'error');
    }
  };


  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentRes = await apiClient.get(`/student/${studentHashId}/dashboard`);
        setStudent(studentRes.data.student);
        setClubs(studentRes.data.clubs);

        setLoading(false);
      } catch (err) {
        console.error('Gagal fetch data:', err);
        setLoading(false);
      }
    };

    if (studentHashId) fetchData();
  }, [studentHashId]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar Top */}
      <header className="w-full bg-white shadow-sm px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img src="/smealogo.png" alt="Logo" className="w-10 h-10" />
          <h1 className="text-xl font-bold text-blue-700">E - OSSAGAR</h1>
        </div>

        <div>
          <IconButton onClick={handleMenuOpen}>
            <MenuIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem onClick={() => { handleMenuClose(); window.location.href = '/edit-profile'; }}>
              <EditIcon fontSize="small" className="mr-2" /> Edit Profile
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); window.location.href = '/edit-profile'; }}>
              <InfoIcon fontSize="small" className="mr-2" /> Status
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); handleLogout(); }}>
              <LogoutIcon fontSize="small" className="mr-2" /> Logout
            </MenuItem>
          </Menu>
        </div>
      </header>

      {/* Content */}
      <main className="px-6 py-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Halo, {student?.name || 'Siswa'} 👋</h2>
        <h3 className="text-lg text-gray-600 mb-6">Silakan pilih ekstrakurikuler yang kamu minati:</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {clubs.map((club) => (
            <div key={club.hash_id} className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition duration-300">
              <img
                src={club.logo_path || '/smealogo.png'}
                alt={club.name}
                className="w-full h-32 object-contain mb-4 rounded"
              />
              <h3 className="text-md font-bold mb-1">{club.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{club.description || 'Belum ada deskripsi'}</p>
              {club.status === 'accepted' ? (
                <>
                  <button className="w-full border border-green-500 text-green-600 py-2 rounded mb-2 cursor-default flex items-center justify-center gap-2">
                    <FaCheckCircle /> Diterima
                  </button>

                </>
              ) : club.status === 'pending' ? (
                <>
                  <button
                    className="w-full border border-red-400 text-red-500 py-2 rounded mb-2 hover:bg-red-50 flex items-center justify-center gap-2"
                    onClick={() => Swal.fire('Menunggu Hasil Seleksi', 'Permintaanmu sedang diproses. Mohon sabar ya!', 'info')}
                  >
                    <FaClock /> Cek Status
                  </button>
                  <a
                    href={
                      club.group_link?.startsWith('http')
                        ? club.group_link
                        : `https://${club.group_link}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full border border-green-500 text-green-600 py-2 rounded flex items-center justify-center gap-2 hover:bg-green-50 transition"
                  >
                    <FaWhatsapp /> Grup WA
                  </a>

                </>
              ) : club.status === 'rejected' ? (
                <>
                  <button
                    className="w-full border border-gray-400 text-gray-600 py-2 rounded mb-2 hover:bg-gray-100 flex items-center justify-center gap-2"
                    onClick={() =>
                      Swal.fire('Ditolak', 'Maaf kamu belum diterima di ekskul ini 😢', 'info')
                    }
                  >
                    ❌ Ditolak
                  </button>
                  <button
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    onClick={() => handleDaftarEkskul(club.hash_id)}
                  >
                    Daftar Kembali
                  </button>
                </>
              ) : (
                <button
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                  onClick={() => handleDaftarEkskul(club.hash_id)}
                >
                  Daftar
                </button>
              )}

            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
