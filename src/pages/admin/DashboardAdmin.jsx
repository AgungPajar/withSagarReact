import React, { useEffect, useState } from 'react';
import SidebarAdmin from '@/components/layouts/SidebarOsis';
import apiClient from '@/utils/axiosConfig';
import { handleUnauthorizedError } from '@/utils/errorHandler';

export default function DashboardAdmin() {
  const [stats, setStats] = useState({
    totalClubs: 0,
    totalMembers: 0,
    todayAttendance: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [clubRes, memberRes, attendanceRes] = await Promise.all([
          apiClient.get('/clubs/count'),
          apiClient.get('/members/count'),
          apiClient.get('/attendance/today/count'),
        ]);

        setStats({
          totalClubs: clubRes.data.count,
          totalMembers: memberRes.data.count,
          todayAttendance: attendanceRes.data.count,
        })
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);
  
  return (
    <div className="flex">
      <SidebarAdmin />
      <main className="flex-1 p-4 pt-24 md:pt-16 md:ml-64 w-full">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-indigo-100 p-4 rounded-xl shadow">
            📋 Total Ekskul: <strong>{stats.totalClubs}</strong>
          </div>
          <div className="bg-indigo-100 p-4 rounded-xl shadow">
            👥 Total Anggota: <strong>{stats.totalMembers}</strong>
          </div>
          <div className="bg-indigo-100 p-4 rounded-xl shadow">
            📆 Presensi Hari Ini: <strong>{stats.todayAttendance}</strong>
          </div>
          <div className="bg-indigo-100 p-4 rounded-xl shadow">
            📈 Tren Mingguan
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Grafik Presensi</h2>
          <div className="h-64 bg-gray-100 flex items-center justify-center text-gray-400">
            [Placeholder Grafik Presensi]
          </div>
        </div>
      </main>
    </div>
  );
}
