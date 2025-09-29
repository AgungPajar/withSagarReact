// src/hooks/useRecap.js
import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../utils/axiosConfig'; // Sesuaikan path jika perlu
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const useRecap = (clubId) => {
  // State utama
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State untuk filter & UI
  const [tanggal, setTanggal] = useState(dayjs());
  const [openModal, setOpenModal] = useState(false);
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());

  // Fungsi ambil data rekap harian
  const fetchRekap = useCallback(async () => {
    if (!clubId) return;
    setLoading(true);
    try {
      const res = await apiClient.get(`/rekapitulasi?date=${tanggal.format('YYYY-MM-DD')}&club_id=${clubId}`);
      setData(res.data);
    } catch (error) {
      MySwal.fire({ icon: 'error', title: 'Gagal memuat data!', toast: true, timer: 3000, position: 'top-end', showConfirmButton: false });
    } finally {
      setLoading(false);
    }
  }, [clubId, tanggal]);

  useEffect(() => {
    fetchRekap();
  }, [fetchRekap]);

  // Fungsi untuk handle export file (digabung jadi satu)
  const handleExport = async (type, dateRange = {}) => {
    try {
      let url, fileName;
      const { from, to } = dateRange;

      if (type === 'daily') {
        const formattedDate = tanggal.format('YYYY-MM-DD');
        url = `/export/harian?date=${formattedDate}&club_id=${clubId}`;
        fileName = `rekap-harian-${formattedDate}.xlsx`;
      } else if (type === 'filtered') {
        const fromDateStr = dayjs(from).format('YYYY-MM-DD');
        const toDateStr = dayjs(to).format('YYYY-MM-DD');
        url = `/rekap/export/monthly?club_id=${clubId}&from_date=${fromDateStr}&to_date=${toDateStr}`;
        fileName = `rekap-filter-${fromDateStr}_to_${toDateStr}.xlsx`;
      } else {
        return; // Tipe tidak dikenal
      }

      const res = await apiClient.get(url, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      if (type === 'filtered') setOpenModal(false);

    } catch (error) {
      MySwal.fire({ icon: 'error', title: 'Gagal export Excel!', toast: true, timer: 3000, position: 'top-end', showConfirmButton: false });
    }
  };

  // Kembalikan semua state dan fungsi yang dibutuhkan UI
  return {
    tanggal, setTanggal,
    data,
    loading,
    openModal, setOpenModal,
    fromDate, setFromDate,
    toDate, setToDate,
    handleExport,
  };
};