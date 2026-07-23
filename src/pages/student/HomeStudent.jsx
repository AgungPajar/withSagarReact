import React, { useEffect, useState } from 'react';
import apiClient, { STORAGE_URL } from '../../utils/axiosConfig';
import { handleUnauthorizedError } from '../../utils/errorHandler';
import Swal from 'sweetalert2';
import { FaCheckCircle, FaWhatsapp, FaBars, FaTimes } from 'react-icons/fa';
import { Typewriter } from 'react-simple-typewriter';
import { useNavigate, useParams } from 'react-router-dom';
import { Users, X, CalendarDays } from 'lucide-react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, Divider } from '@mui/material';
import LoadingSpinner from '@/components/LoadingSpinner';
import Footer from '@/components/layouts/Footer';

export default function HomeStudent() {
  const [student, setStudent] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const { studentId } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const studentHashId = user?.student_hash_id;

  const isEkskulOsis = (club) => {
    return club.name?.toLowerCase().includes('osis');
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
          confirmButton: 'border-4 border-black bg-lime-400 text-black font-black px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all',
          popup: 'border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-none'
        },
        buttonsStyling: false,
      });

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
        customClass: {
          confirmButton: 'border-4 border-black bg-red-500 text-white font-black px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all',
          popup: 'border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-none'
        },
        buttonsStyling: false,
      });
    }
  };

  const handleLogout = async () => {
    Swal.fire({
      title: 'Logout?',
      text: 'Pilih metode logout yang kamu mau',
      icon: 'question',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: 'Logout Biasa',
      denyButtonText: 'Logout All Devices',
      cancelButtonText: 'Batal',
      customClass: {
        confirmButton: 'border-4 border-black bg-pink-400 text-black font-black px-4 py-2 m-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all',
        denyButton: 'border-4 border-black bg-orange-400 text-black font-black px-4 py-2 m-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all',
        cancelButton: 'border-4 border-black bg-white text-black font-black px-4 py-2 m-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all',
        popup: 'border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-none'
      },
      buttonsStyling: false,
    }).then(async (result) => {
      try {
        if (result.isConfirmed) {
          await apiClient.post('/logout');
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          navigate('/');
        } else if (result.isDenied) {
          await apiClient.post('/logout?mode=all');
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          navigate('/');
        }
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Gagal logout, coba lagi.', 'error');
      }
    });
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
            customClass: {
              confirmButton: 'border-4 border-black bg-cyan-300 text-black font-black px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all',
              popup: 'border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-none'
            },
            buttonsStyling: false,
          }).then((result) => {
            if (result.isConfirmed) {
              navigate(`/student/profile/edit/${studentId}`);
            }
          });
        }

        const dashboardRes = await apiClient.get(`/student/${studentHashId}/dashboard`);
        setStudent(dashboardRes.data.student);
        setClubs(dashboardRes.data.clubs);
        setLoading(false);
      } catch (err) {
        const handled = await handleUnauthorizedError(err);
        if (handled) {
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, studentId]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-[#FFF4E0] font-mono text-black selection:bg-pink-400">
      
      {/* Navbar Neobrutalism */}
      <header className="w-full bg-cyan-300 border-b-4 border-black px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img src="/smealogo.png" alt="Logo" className="w-12 h-12 bg-white border-4 border-black p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
          <h1 className="text-2xl font-black tracking-tighter uppercase bg-white px-2 py-1 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-1">E-OSSAGAR</h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-4">
          <button 
            onClick={() => navigate(`/student/profile/edit/${studentId}`)}
            className="bg-yellow-300 border-4 border-black px-4 py-2 font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all"
          >
            Edit Profile
          </button>
          <button 
            onClick={handleLogout}
            className="bg-pink-400 border-4 border-black px-4 py-2 font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="bg-white border-4 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute right-6 top-20 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-40 flex flex-col p-4 gap-4">
          <button 
            onClick={() => { setIsMenuOpen(false); navigate(`/student/profile/edit/${studentId}`); }}
            className="bg-yellow-300 border-4 border-black px-4 py-2 font-bold uppercase w-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-left"
          >
            Edit Profile
          </button>
          <button 
            onClick={() => { setIsMenuOpen(false); handleLogout(); }}
            className="bg-pink-400 border-4 border-black px-4 py-2 font-bold uppercase w-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-left"
          >
            Logout
          </button>
        </div>
      )}

      {/* Content */}
      <main className="px-6 py-10 pb-32 max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <div className="inline-block bg-lime-400 border-4 border-black px-6 py-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-1">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
              <Typewriter
                words={[`HALO, ${student?.name?.toUpperCase() || 'SISWA'} 👋`]}
                loop={1}
                cursor
                cursorStyle="_"
                typeSpeed={70}
              />
            </h2>
          </div>
          <p className="mt-6 font-bold text-lg bg-white border-2 border-black inline-block px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-1">
            Silakan pilih ekstrakurikuler yang kamu minati!
          </p>
        </div>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {clubs.map((club) => {
            const isOsis = isEkskulOsis(club);
            
            // Tentukan warna card bergantian biar rame
            const cardColors = ['bg-fuchsia-300', 'bg-cyan-300', 'bg-yellow-300', 'bg-orange-300', 'bg-lime-300'];
            const randomColor = cardColors[club.id % cardColors.length] || 'bg-white';

            return (
              <div key={club.hash_id} className={`${randomColor} border-4 border-black p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-transform duration-200 flex flex-col h-full`}>
                
                <div className="bg-white border-4 border-black p-2 mb-4 h-40 flex items-center justify-center shadow-inner">
                  {club.logo_path ? (
                    <img
                      src={`${STORAGE_URL}/${club.logo_path}`}
                      alt={club.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Users size={64} className="text-gray-400" />
                  )}
                </div>
                
                <h3 className="text-xl font-black uppercase mb-2 line-clamp-1 border-b-4 border-black pb-1">{club.name}</h3>
                <p className="font-semibold text-sm mb-6 line-clamp-3 flex-grow">{club.description || 'Belum ada deskripsi.'}</p>
                
                <div className="mt-auto">
                  <button
                    onClick={() => setSelectedClub(club)}
                    className="w-full mb-3 bg-white border-4 border-black text-black font-black py-2 uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all flex items-center justify-center gap-2"
                  >
                    DETAIL
                  </button>
                  {isOsis ? (
                    <div className="w-full bg-gray-400 border-4 border-black text-black font-black py-3 text-center uppercase cursor-not-allowed">
                      DITUTUP
                    </div>
                  ) : club.status === 'accepted' ? (
                    <button
                      className="w-full bg-green-400 border-4 border-black text-black font-black py-3 uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all flex items-center justify-center gap-2"
                      onClick={() =>
                          Swal.fire({
                            title: 'SELAMAT!!!',
                            text: 'kamuu sudah diterima di ekskul ini yeyy, semangatttt!',
                            icon: 'success',
                            confirmButtonText: 'OKE',
                            customClass: {
                              confirmButton: 'border-4 border-black bg-lime-400 text-black font-black px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all',
                              popup: 'border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-none'
                            },
                            buttonsStyling: false,
                          })
                        }
                    >
                      <FaCheckCircle /> DITERIMA
                    </button>
                  ) : club.status === 'pending' ? (
                    <a
                      href={
                        club.group_link?.startsWith('http')
                          ? club.group_link
                          : `https://${club.group_link}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-emerald-400 border-4 border-black text-black font-black py-3 uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all flex items-center justify-center gap-2"
                    >
                      <FaWhatsapp className="text-xl" /> GRUP WA
                    </a>
                  ) : club.status === 'rejected' ? (
                    <button
                      className="w-full bg-red-500 border-4 border-black text-white font-black py-3 uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all flex items-center justify-center gap-2"
                      onClick={() =>
                        Swal.fire({
                          icon: 'error',
                          title: 'Ditolak',
                          text: 'Maaf kamuu belum diterima di ekskul ini :( jangan patah semangat yaa',
                          confirmButtonText: 'OK',
                          customClass: {
                            confirmButton: 'border-4 border-black bg-white text-black font-black px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all',
                            popup: 'border-4 border-black bg-red-400 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-none'
                          },
                          buttonsStyling: false,
                        })
                      }
                    >
                      <FaCheckCircle /> DITOLAK
                    </button>
                  ) : (
                    <button
                      className="w-full bg-blue-500 border-4 border-black text-white font-black py-3 uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all"
                      onClick={() => handleDaftarEkskul(club.hash_id)}
                    >
                      DAFTAR GAS!
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
      
      {/* Neobrutalism Footer Styling could be done in Footer component itself, 
          but for now we leave it or wrap it if necessary */}
      <div className="border-t-4 border-black">
        <Footer />
      </div>

      {/* Dialog Detail Ekskul */}
      <Dialog open={!!selectedClub} onClose={() => setSelectedClub(null)} maxWidth="sm" fullWidth PaperProps={{ style: { borderRadius: 16 } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold">Detail Ekstrakurikuler</Typography>
          <IconButton onClick={() => setSelectedClub(null)} size="small">
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          {selectedClub && (
            <Box className="flex flex-col items-center pb-2">
              <Box className="w-24 h-24 mb-4 rounded-full overflow-hidden flex items-center justify-center border-2 border-blue-200 bg-gray-100 shadow-sm">
                {selectedClub.logo_path ? (
                  <img
                    src={`${STORAGE_URL}/${selectedClub.logo_path}`}
                    alt={selectedClub.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Users size={40} className="text-gray-400" />
                )}
              </Box>
              <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom align="center">
                {selectedClub.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center" className="mb-4">
                {selectedClub.description || 'Belum ada deskripsi untuk ekstrakurikuler ini.'}
              </Typography>

              <Box className="w-full mt-4 bg-blue-50 rounded-xl p-5 border border-blue-100">
                <Typography variant="subtitle1" fontWeight="bold" className="flex items-center gap-2 mb-4 text-blue-800">
                  <CalendarDays size={20} />
                  Jadwal Latihan
                </Typography>
                {selectedClub.schedules && selectedClub.schedules.length > 0 ? (
                  <ul className="space-y-3">
                    {selectedClub.schedules.map((schedule) => (
                      <li key={schedule.id} className="flex justify-between items-center text-sm bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                        <span className="font-bold text-gray-700 uppercase tracking-wider text-xs bg-gray-100 px-2 py-1 rounded">{schedule.day_of_week}</span>
                        <span className="font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                          {schedule.start_time.substring(0,5)} - {schedule.end_time.substring(0,5)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Typography variant="body2" color="text.secondary" className="italic text-center bg-white p-3 rounded-lg border border-gray-100">
                    Jadwal belum tersedia.
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
