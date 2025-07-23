import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import apiClient, { STORAGE_URL } from '../../utils/axiosConfig';
import SidebarClub from '../../components/SidebarClub';
import Footer from '../../components/Footer';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ClubDetail() {
  const { clubId } = useParams();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const response = await apiClient.get(`/clubs/${clubId}`);
        setClub(response.data);
      } catch (error) {
        alert('Gagal memuat details Ekskul');
      } finally {
        setLoading(false);
      }
    };
    if (clubId) {
      fetchClub();
    }
  }, [clubId]);

  return (
    <div className="max-w-full bg-white text-gray-800">
      <div className="flex flex-col items-center justify-center max-w-full">
        <SidebarClub />

        {/* Main Page Transition */}
        <motion.main
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ marginTop: '4vh' }}
          className="flex-1 pt-24 w-full"
        >
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* Welcome Section */}
              <div className="text-center mb-20 mt-4">
                <h2 className="text-lg font-bold mb-3">SELAMAT DATANG</h2>
                <h1 className="text-4xl font-bold text-gray-500">{club ? club.name : 'Memuat...'}</h1>
              </div>

              {/* Logo */}
              <div className="flex justify-center mb-20">
                <img
                  src={
                    club?.logo_path
                      ? `${STORAGE_URL}/${club.logo_path}`
                      : '/logoeks.png'
                  }
                  alt="LOGO EKSKUL"
                  style={{
                    width: 160,
                    height: 160,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid #ccc',
                  }}
                />
              </div>

              {/* Tagline */}
              <div className="text-center mb-10 px-4">
                <p className="text-base leading-relaxed" translate='no'>
                  OSSAGAR'59<br />
                  HIJI HATE, HIJI HARTI<br />
                  NGAHJI NGABAKTI
                </p>
              </div>
            </>
          )}
        </motion.main>
      </div>
      <Footer />
    </div>
  );
}
