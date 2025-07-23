import React, { useEffect, useState } from 'react';
import apiClient, { STORAGE_URL } from '../../utils/axiosConfig';
import Swal from 'sweetalert2';
import MenuIcon from '@mui/icons-material/Menu';
import { Menu, MenuItem, IconButton, Avatar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import { FaCheckCircle, FaWhatsapp, FaClock } from 'react-icons/fa';
import { Typewriter } from 'react-simple-typewriter';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import Footer from '../../components/Footer';


export default function HomeStudent() {
  const [student, setStudent] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { studentId } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const studentHashId = user?.student_hash_id;

  const isEkskulOsis = (club) => {
    return club.name?.toLowerCase().includes('osis'); // atau bisa pakai ID tertentu
  };


  const handleDaftarEkskul = async (clubHashId) => {
    try {
      const res = await apiClient.post(`/clubs/${clubHashId}/request-join`);
      Swal.fire({
        title: 'Sukses!',
        text: res.data.message,
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton:
            'border border-blue-600 text-blue-600 font-semibold px-5 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition',
        },
        buttonsStyling: false,
      });


      // Refresh data biar tombol berubah otomatis
      const studentRes = await apiClient.get(`/student/${studentHashId}/dashboard`);
      setStudent(studentRes.data.student);
      setClubs(studentRes.data.clubs);
    } catch (err) {
      console.error('Error daftar ekskul:', err.response?.data || err);
      Swal.fire({
        title: 'Gagal!',
        text: err.response?.data?.message || 'Terjadi kesalahan',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#2563EB'
      });
    }
  };


  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    navigate('/');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const studentHashId = user?.student_hash_id;

        const res = await apiClient.get(`/student/${studentHashId}`);
        const { phone, tanggal_lahir, alamat } = res.data;

        if (!phone || !tanggal_lahir || !alamat) {
          Swal.fire({
            icon: 'warning',
            title: 'Lengkapi Profil',
            text: 'Silakan untuk melengkapi profile terlebih dahulu!',
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: 'Lengkapi Profile',
            confirmButtonColor: '#3B82F6',
            customClass: {
              confirmButton:
                'border-2 border-blue-500 text-blue-500 rounded-lg px-5 py-2 font-semibold transition duration-200 hover:bg-blue-200 hover:text-white hover:border-blue-200',
            },
            buttonsStyling: false,
          }).then((result) => {
            if (result.isConfirmed) {
              navigate(`/student/profile/edit/${studentId}`);
            }
          });
        }

        // lanjut fetch dashboard data untuk ekskul
        const dashboardRes = await apiClient.get(`/student/${studentHashId}/dashboard`);
        setStudent(dashboardRes.data.student);
        setClubs(dashboardRes.data.clubs);
        setLoading(false);
      } catch (err) {
        console.error('Gagal fetch data:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  if (loading) return <LoadingSpinner />;

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
            <MenuItem onClick={() => { handleMenuClose(); window.location.href = `/student/profile/edit/${studentId}`; }}>
              <EditIcon fontSize="small" className="mr-2" /> Edit Profile
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); handleLogout(); }}>
              <LogoutIcon fontSize="small" className="mr-2" /> Logout
            </MenuItem>
          </Menu>
        </div>
      </header>

      {/* Content */}
      <main className="px-6 py-6 pb-32">
        <motion.h2
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative inline-block text-2xl font-semibold mb-4 text-gray-800 text-center w-full"
        >
          <motion.span
            initial={{ backgroundSize: '0% 100%' }}
            animate={{ backgroundSize: '100% 100%' }}
            transition={{ delay: 2, duration: 0.8, ease: 'easeInOut' }}
            className="relative z-10 inline-block px-1 bg-gradient-to-r from-blue-200 to-blue-100 bg-no-repeat bg-[length:100%_40%] bg-bottom"
          >
            <Typewriter
              words={[`Halo, ${student?.name || 'Siswa'} 👋`]}
              loop={1}
              cursor
              cursorStyle="|"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1500}
            />
          </motion.span>
        </motion.h2>


        <h3 className="text-lg text-gray-600 mb-6">Silakan pilih ekstrakurikuler yang kamu minati:</h3>

        <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {clubs.map((club) => (
            <div key={club.hash_id} className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition duration-300">
              <img
                src={`${STORAGE_URL}/${club.logo_path}` || '/logoeks.png'}
                alt={club.name}
                className="w-full h-32 object-contain mb-4 rounded"
              />
              <h3 className="text-md font-bold mb-1">{club.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{club.description || 'Belum ada deskripsi'}</p>
              {isEkskulOsis(club) ? (
                <button
                  disabled
                  className="w-full bg-gray-400 text-white py-2 rounded cursor-not-allowed"
                  title="Ekskul OSIS tidak membuka pendaftaran"
                >
                  Tidak Bisa Daftar
                </button>
              ) : club.status === 'accepted' ? (
                <button
                  className="w-full border border-gray-400 text-gray-600 hover:bg-blue-100 py-2 rounded mb-2 flex items-center justify-center gap-2"
                  onClick={() =>
                      Swal.fire({
                        title: 'SELAMAT!!!',
                        text: 'kamuu sudah diterima di ekskul ini yeyy , semangatttt',
                        icon: 'success',
                        confirmButtonText: 'OKE',
                        customClass: {
                          confirmButton:
                            'border border-green-600 text-green-600 font-semibold px-5 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition',
                        },
                        buttonsStyling: false,
                      })
                    }
                >
                  <FaCheckCircle /> Coba Check
                </button>
              ) : club.status === 'pending' ? (
                <>
                  <a
                    href={
                      club.group_link?.startsWith('http')
                        ? club.group_link
                        : `https://${club.group_link}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full border border-green-500 text-green-600  py-2 rounded flex items-center justify-center gap-2 hover:bg-green-50 transition"
                  >
                    <FaWhatsapp /> Grup WA
                  </a>
                </>
              ) : club.status === 'rejected' ? (
                <>
                  <button
                    className="w-full border border-gray-400 text-gray-600 py-2 rounded mb-2 hover:bg-gray-100 flex items-center justify-center gap-2"
                    onClick={() =>
                      Swal.fire({
                        icon: 'error',
                        title: 'Ditolak',
                        text: 'Maaf kamuu belum diterimaa di ekskul inii :( jangann patahh semangatt yaa',
                        confirmButtonText: 'OK',
                        customClass: {
                          icon: 'border-red-600',
                          confirmButton:
                            'border border-red-600 text-red-600 font-semibold px-5 py-2 rounded-lg hover:bg-red-600 hover:text-white transition',
                        },
                        buttonsStyling: false,
                      })
                    }
                  >
                    <FaCheckCircle /> Coba Check
                  </button>
                  {/* <button
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    onClick={() => handleDaftarEkskul(club.hash_id)}
                  >
                    Daftar Kembali
                  </button> */}
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
      </main >
      <Footer />
    </div >
  );
}
