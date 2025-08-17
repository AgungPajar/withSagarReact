// src/hooks/useRecapReport.js
import { useState, useEffect, useCallback, useMemo } from 'react';
import apiClient from '@/utils/axiosConfig';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';

export const useRecapReport = (clubId) => {
  const [allReports, setAllReports] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk filter tanggal
  const [fromDate, setFromDate] = useState(null); // Default null biar nampilin semua
  const [toDate, setToDate] = useState(null);

  // Fungsi untuk mengambil semua data laporan sekali aja
  const fetchAllReports = useCallback(async () => {
    if (!clubId) return;
    setLoading(true);
    try {
      const res = await apiClient.get(`/clubs/${clubId}/activity-reports`);
      // Urutkan dari yang paling baru
      const sortedData = res.data.sort((a, b) => dayjs(b.date).diff(dayjs(a.date)));
      setAllReports(sortedData);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Gagal memuat data laporan.', 'error');
    } finally {
      setLoading(false);
    }
  }, [clubId]);

  useEffect(() => {
    fetchAllReports();
  }, [fetchAllReports]);

  // Logika filter yang cuma jalan kalo tanggalnya berubah
  const filteredReports = useMemo(() => {
    if (!fromDate && !toDate) {
      return allReports; // Kalo filter kosong, tampilin semua
    }
    return allReports.filter(report => {
      const reportDate = dayjs(report.date);
      const isAfterFrom = fromDate ? reportDate.isAfter(dayjs(fromDate).subtract(1, 'day')) : true;
      const isBeforeTo = toDate ? reportDate.isBefore(dayjs(toDate).add(1, 'day')) : true;
      return isAfterFrom && isBeforeTo;
    });
  }, [allReports, fromDate, toDate]);

  const clearFilters = () => {
    setFromDate(null);
    setToDate(null);
  };

  return {
    loading,
    filteredReports,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    clearFilters,
  };
};