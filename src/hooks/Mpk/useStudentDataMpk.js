import { useState, useEffect } from 'react';
import apiClient from '@/utils/axiosConfig';

export default function useMpkClassData(classLevel) {
  const [students, setStudents] = useState([]);
  const [jurusans, setJurusans] = useState([]);
  const [selectedJurusan, setSelectedJurusan] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchJurusans = async () => {
    try {
      const res = await apiClient.get('/admin/jurusans');
      setJurusans(res.data);
    } catch (err) {
      console.error('Failed to fetch jurusans:', err);
    }
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
    } catch (err) {
      console.error('Failed to fetch students:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJurusans();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [selectedJurusan, classLevel]);

  return {
    students,
    jurusans,
    selectedJurusan,
    setSelectedJurusan,
    isLoading,
  };
}