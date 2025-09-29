import React, { useState } from 'react'
import SidebarAdmin from '@/components/layouts/SidebarMpk'
import Footer from '@/components/layouts/Footer';
import DashboardPage from '@/components/Osis/DashboardPage'

export default function DashboardAdmin() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarAdmin isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} />

      {/* 3. Layout utama dan margin dinamis diatur di sini */}
      <div className={`flex-1 flex flex-col p-4 pt-24 md:pt-16 w-full overflow-hidden transition-all duration-300 ${isSidebarExpanded ? 'md:ml-64' : 'md:ml-20'}`}>
        <main className="flex-1 p-4 sm:p-6">
          <DashboardPage title="Dashboard Admin OSIS" />
        </main>
      </div>
      <Footer />
    </div>
  );
}