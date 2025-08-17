// src/hooks/useClubData.js
import { useState, useEffect } from 'react';
import apiClient from '../../utils/axiosConfig';
import { handleUnauthorizedError } from '../../utils/errorHandler';

export const useClubData = (clubId) => {
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Kalo ga ada clubId, jangan jalanin apa-apa
    if (!clubId) {
      setLoading(false);
      return;
    }

    const fetchClub = async () => {
      setLoading(true); // Mulai loading
      try {
        const response = await apiClient.get(`/clubs/${clubId}`);
        setClub(response.data);
      } catch (err) {
        setError(err);
        // Panggil error handler lo di sini
        handleUnauthorizedError(err); 
      } finally {
        setLoading(false); // Stop loading, baik sukses maupun gagal
      }
    };
    
    fetchClub();
  }, [clubId]); // Dijalankan ulang kalo clubId berubah

  // Kirim balik data, status loading, dan error
  return { club, loading, error };
};