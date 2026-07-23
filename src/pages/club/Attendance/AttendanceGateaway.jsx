import React, {useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import SidebarClub from '@/components/ClubDetail/SidebarClub'; // Sesuaikan path import
import { ArrowRight } from 'lucide-react';

export default function ReportGateway() {
  const { clubId } = useParams();
  const navigate = useNavigate();

  // State buat ngontrol sidebar, kita angkat dari ClubDetail
  // Untuk halaman ini, kita set defaultnya nutup aja biar kontennya pas di tengah
  const [isExpanded, setIsExpanded] = useState(false); 

  const handleNavigateToReport = () => {
    navigate(`/attendance/${clubId}/attendance`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <SidebarClub isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

      {/* Konten Utama */}
      <main className={`flex-1 flex items-center justify-center transition-all duration-300 ${isExpanded ? 'md:ml-72' : 'md:ml-28'}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-gray-700 mb-6">
            Halaman Presensi
          </h1>
          <p className="text-gray-500 max-w-md mx-auto mb-8">
            Klik tombol di bawah ini untuk mengelola kehadiran anggota.
          </p>
          <motion.button
            onClick={handleNavigateToReport}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-3 mx-auto bg-gray-800 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:bg-gray-700 transition-colors"
          >
            Isi Kehadiran
            <ArrowRight size={20} />
          </motion.button>
        </motion.div>
      </main>
    </div>
  );
}