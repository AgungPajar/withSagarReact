import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { STORAGE_URL } from '@/utils/axiosConfig';
import SidebarClub from '@/components/ClubDetail/SidebarClub';
import Footer from '@/components/layouts/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import DashboardCard from '@/components/ClubDetail/DashboardCard';
import { Users, Calendar, BarChart2, DollarSign } from 'lucide-react';
import { useClubData } from '@/hooks/Clubs/useClubData';

export default function ClubDetail() {
  const { clubId } = useParams();
  const location = useLocation();
  const { club, loading } = useClubData(clubId);

  const isHomePage = location.pathname === `/club/${clubId}`;
  const [isExpanded, setIsExpanded] = useState(isHomePage);

  useEffect(() => {
    const isNowHomePage = location.pathname === `/club/${clubId}`;
    setIsExpanded(isNowHomePage);
  }, [location.pathname, clubId]);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <SidebarClub isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

      <div className="flex flex-col flex-1">
        <motion.main initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex-1 p-4 sm:p-6 transition-all duration-300 mt-20 sm:mt-2 ${isExpanded ? 'md:ml-[17vw]' : 'md:ml-[7vw]'}`}>
          {loading ? (
            <div className='flex justify-center items-center h-full'>
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex items-center gap-4">
                <img
                  src={
                    club?.logo_path
                      ? `${STORAGE_URL}/${club.logo_path}`
                      : '/logoeks.png'
                  }
                  alt="LOGO EKSKUL"
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-full border-4 border-white shadow-md"
                />
                <div>
                  <h1 className="text-2xl font-bold">
                    Administrasi, <span>{club ? club.name : 'Memuat...'}</span>
                  </h1>
                  <p className='text-gray-500 mt-1'>
                    Semua informasi dan aktivitas Ekskul ada di sini
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                animate="visible"
                transition={{ staggerChildren: 0.7 }}
                className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                <DashboardCard title="Jadwal terdekat">
                  <div className='flex flex-col'>
                    <p className='font-bold text-lg'>Latihan Rutin</p>
                    <p className='text-sm text-gray-500'>Sabtu, 17 Agust 1945</p>
                  </div>
                </DashboardCard>

                <DashboardCard title="Kas Club">
                  <div className='flex items-end justify-between'>
                    <span className='text-3xl font-bold'>Rp 1.2T</span>
                    <DollarSign className='text-green-500' size={32}></DollarSign>
                  </div>
                </DashboardCard>

                <DashboardCard title="Kehadiran Rata Rata">
                  <div className='flex items-end justify-between'>
                    <p className='font-bold text-4xl'>1000%</p>
                    <BarChart2 className='text-yellow-500' size={32}></BarChart2>
                  </div>
                </DashboardCard>

                <DashboardCard title="Pengumuman Terbaru" className='sm:col-span-2 lg:col-span-4'>
                  <p className='text-gray-600'>
                    Jangan lupa latihan hari biasanya di tempat biasanya
                  </p>
                </DashboardCard>

              </motion.div>

            </>
          )}
        </motion.main>
      </div>
      <Footer />
    </div>
  );
}
