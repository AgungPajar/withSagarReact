import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import Swal from 'sweetalert2'
import apiClient from '@/utils/axiosConfig'
import { handleUnauthorizedError } from '@/utils/errorHandler'

export const useAttendance = (clubId) => {
  const navigate = useNavigate();

  const [club, setClub] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [tanggal] = useState(dayjs());

  useEffect(() => {
    if (!clubId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [clubRes, studentsRes] = await Promise.all([
          apiClient.get(`/clubs/${clubId}`),
          apiClient.get(`/clubs/${clubId}/members`)
        ]);

        setClub(clubRes.data);

        const kelasOrder = { X: 1, XI: 2, XII: 3 };
        const sortedStudents = studentsRes.data
          .map(s => ({ ...s, status: 'hadir' }))
          .sort((a, b) => {
            const kelasA = kelasOrder[a.kelas] || 99;
            const kelasB = kelasOrder[b.class] || 99;
            if (kelasA !== kelasB) return kelasA - kelasB;

            const rombelA = parseInt(a.rombel) || 0;
            const rombelB = parseInt(b.rombel) || 0;
            if (rombelA !== rombelB) return rombelA - rombelB;

            return a.name.localeCompare(b.name);
          });
        setStudents(sortedStudents);
      } catch (error) {
        handleUnauthorizedError(error)
        Swal.fire('Error', 'Gagal memuat data, coba lagi.', 'error')
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [clubId]);

  const handleStatusChange = (studentId, newStatus) => {
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === studentId ? { ...student, status: newStatus } : student
      )
    );
  };

  const handleSubmit = async () => {
    setSending(true);
    try {
      const attendanceData = students.map(student => ({
        student_id: student.id,
        club_id: clubId,
        status: student.status,
        date: tanggal.format('YYYY-MM-DD'),
      }));
      await apiClient.post('/attendances', { data: attendanceData });
      Swal.fire({
        toast: true,
        icon: 'success',
        title: 'Presensi berhasil dikirim!',
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
      });
      navigate(`/club/${clubId}`);
    } catch (error) {
      handleUnauthorizedError(error);
      Swal.fire({
        toast: true,
        icon: 'error',
        title: 'Gagal mengirim presensi!',
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
      });
    } finally {
      setSending(false)
    }
  };
  return {
    club, students, loading, sending, handleStatusChange, handleSubmit
  }

}