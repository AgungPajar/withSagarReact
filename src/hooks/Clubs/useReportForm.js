// src/hooks/useReportForm.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import imageCompression from 'browser-image-compression';
import Swal from 'sweetalert2';
// Path-nya kita benerin pake path biasa
import apiClient from '../../utils/axiosConfig';

export const useReportForm = (clubId) => {
  const navigate = useNavigate();

  const [tanggal] = useState(dayjs());
  const [materi, setMateri] = useState('');
  const [tempat, setTempat] = useState('');
  const [photoBlob, setPhotoBlob] = useState(null);
  const [photoDataUrl, setPhotoDataUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1080, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);

      if (compressedFile.size > 2 * 1024 * 1024) {
        Swal.fire('Ukuran Terlalu Besar', 'Foto masih melebihi 2 MB setelah dikompres.', 'error');
        return;
      }

      setPhotoBlob(compressedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoDataUrl(reader.result);
      reader.readAsDataURL(compressedFile);
    } catch (err) {
      Swal.fire('Error', 'Gagal mengompres foto.', 'error');
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    if (!materi || !tempat) {
      Swal.fire({ toast: true, position: 'top-end', icon: 'warning', title: 'Materi dan tempat harus diisi', showConfirmButton: false, timer: 2000 });
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('date', tanggal.format('YYYY-MM-DD'));
      formData.append('materi', materi);
      formData.append('tempat', tempat);

      if (photoBlob) {
        const fileName = `photo_${clubId}_${tanggal.format('YYYYMMDD')}.png`;
        const file = new File([photoBlob], fileName, { type: 'image/png' });
        formData.append('photo', file);
      }

      await apiClient.post(`/clubs/${clubId}/activity-reports`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Laporan berhasil dikirim!', showConfirmButton: false, timer: 2000 });
      setTimeout(() => navigate(`/attendance/${clubId}/attendance`), 500);
    } catch (error) {
      Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'Gagal kirim laporan', showConfirmButton: false, timer: 2000 });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    tanggal,
    materi,
    setMateri,
    tempat,
    setTempat,
    photoDataUrl,
    submitting,
    handlePhotoChange,
    handleSubmit,
  };
};