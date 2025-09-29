// src/hooks/useClubData.js
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/utils/axiosConfig';
import { handleUnauthorizedError } from '@/utils/errorHandler';
import Swal from 'sweetalert2';

export const useClubData = (clubId) => {
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [schedules, setSchedules] = useState([]);

  const checkProfileCompletion = useCallback((profile, scheduleList) => {
    if (!profile) return; // Jangan cek jika data profil belum ada

    // Cek #1: Apakah deskripsi atau link grup kosong?
    if (!profile.description || !profile.group_link) {
      Swal.fire({
        icon: 'info',
        title: 'Profil Ekskul Belum Lengkap',
        text: 'Sepertinya deskripsi atau link grup ekskul-mu masih kosong. lengkapi sekarang!',
        confirmButtonText: 'Lengkapi Profil',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(`/club/${clubId}/profile/edit`);
        }
      });
      return; // Hentikan pengecekan
    }

    // Cek #2: Jika profil lengkap, cek jadwal
    if (scheduleList.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Jadwal Masih Kosong',
        text: 'Kamu belum menambahkan jadwal kegiatan untuk ekskul ini. Tambahkan sekarang!',
        confirmButtonText: 'Lengkapi Jadwal',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(`/club/${clubId}/profile`);
        }
      });
    }
  }, [navigate, clubId]);


  useEffect(() => {
    if (!clubId) {
      setLoading(false);
      return;
    }

    const fetchClubAndSchedules = async () => {
      setLoading(true);
      try {
        // 6. Kita fetch data klub dan jadwal secara bersamaan
        const [clubResponse, scheduleResponse] = await Promise.all([
          apiClient.get(`/clubs/${clubId}`),
          apiClient.get(`/clubs/${clubId}/schedules`)
        ]);

        const clubData = clubResponse.data;
        const scheduleData = scheduleResponse.data;

        setClub(clubData);
        setSchedules(scheduleData);

        // 7. Panggil fungsi check setelah semua data berhasil di-fetch
        checkProfileCompletion(clubData, scheduleData);

      } catch (err) {
        setError(err);
        handleUnauthorizedError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClubAndSchedules();
  }, [clubId, checkProfileCompletion]);

  // Kirim balik data, status loading, dan error
  return { club, schedules, loading, error };
};