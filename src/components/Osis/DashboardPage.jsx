import React from 'react';
import { motion } from 'framer-motion';
import { Users, ClipboardList, CalendarCheck, AlertTriangle } from 'lucide-react';

import LoadingSpinner from '@/components/LoadingSpinner';
import DashboardCard from '@/components/DashboardCard';
import { useDashboardStats } from '@/hooks/Osis/useDashboardStats';

export default function DashboardPageContent({ title }) {
  const { stats, loading } = useDashboardStats();

  const cardData = [
    { title: "Total Ekskul", value: stats?.totalClubs, icon: <ClipboardList className="text-blue-500" /> },
    { title: "Total Anggota", value: stats?.totalMembers, icon: <Users className="text-green-500" /> },
    { title: "Presensi Hari Ini", value: stats?.todayAttendance, icon: <CalendarCheck className="text-indigo-500" /> },
    { title: "Pelanggaran Hari Ini", value: stats?.violationCount, icon: <AlertTriangle className="text-red-500" /> },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-3xl font-bold mb-6">{title}</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cardData.map((card, index) => (
              <DashboardCard key={index} title={card.title} icon={card.icon}>
                <span className="text-3xl font-bold">{card.value ?? '...'}</span>
              </DashboardCard>
            ))}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Ekskul yang Belum Lapor Absensi Hari Ini</h2>
            {stats?.violatingClubs.length > 0 ? (
              <ul className="space-y-2">
                {stats.violatingClubs.map(club => (
                  <li key={club.id} className="p-2 bg-red-50 rounded-md text-red-700">{club.name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Tidak ada pelanggaran hari ini. Mantap!</p>
            )}
          </div>

          <div className="bg-white p-6 my-8 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Ekskul dengan Profil/Jadwal Belum Lengkap</h2>
            {stats?.incompleteClubs.length > 0 ? (
              <ul className="space-y-2">
                {stats.incompleteClubs.map(club => (
                  <li key={club.id} className="p-2 bg-yellow-50 rounded-md text-yellow-700">
                    {club.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Semua profil ekskul sudah lengkap. Keren!</p>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}