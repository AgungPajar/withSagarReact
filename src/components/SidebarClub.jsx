import React, { useState } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu as MenuIcon, X as CloseIcon } from 'lucide-react';
import { Box, Divider } from '@mui/material';
import {
  Home,
  Users,
  ClipboardList,
  Edit3,
  LogOut,
  CalendarCheck,
} from 'lucide-react';

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -15 },
  visible: { opacity: 1, x: 0 },
};

export default function SidebarClub() {
  const { clubId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/');
  };

  const menuItems = [
    { label: 'Home', to: `/club/${clubId}`, icon: <Home size={18} /> },
    { label: 'Presensi', to: `/attendance/${clubId}/report`, icon: <CalendarCheck size={18} /> },
    { label: 'Anggota', to: `/club/${clubId}/members`, icon: <Users size={18} /> },
    { label: 'Rekapitulasi', to: `/club/${clubId}/rekap`, icon: <ClipboardList size={18} /> },
    { label: 'Edit Profile', to: `/profile/edit/${clubId}`, icon: <Edit3 size={18} /> },
    { label: 'Logout', onClick: handleLogout, danger: true, icon: <LogOut size={18} /> },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b shadow-sm fixed top-0 left-0 right-0 z-50">
        <Box display="flex" alignItems="center" className="gap-3 px-2">
          <img src="/smealogo.png" alt="Logo" className="w-10 h-10 object-contain" />
          <h2 className="text-xl font-bold text-blue-600">E - OSSAGAR</h2>
        </Box>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="transition-all">
          <motion.div
            initial={false}
            animate={sidebarOpen ? { rotate: 180 } : { rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            {sidebarOpen ? (
              <CloseIcon className="w-6 h-6 text-gray-700" />
            ) : (
              <MenuIcon className="w-6 h-6 text-gray-700" />
            )}
          </motion.div>
        </button>
      </div>

      {/* Overlay Drawer Mobile */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <motion.div
            initial={{ x: -250, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -250, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-64 bg-white h-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-16">
              <h2 className="text-xl font-bold text-blue-600">Menu</h2>
              <button onClick={() => setSidebarOpen(false)}>
                <CloseIcon className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <motion.ul
              className="space-y-4"
              variants={listVariants}
              initial="hidden"
              animate="visible"
            >
              {menuItems.map((item, idx) => {
                const isActive = location.pathname === item.to;
                return (
                  <motion.li key={idx} variants={itemVariants}>
                    {item.to ? (
                      <Link
                        to={item.to}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-2 px-4 py-2 rounded transition ${item.danger
                          ? 'text-red-500 hover:text-red-700'
                          : isActive
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-800 hover:text-blue-500'
                          }`}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        onClick={() => {
                          item.onClick?.();
                          setSidebarOpen(false);
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded w-full text-left transition ${item.danger
                          ? 'text-red-500 hover:text-red-700'
                          : 'text-gray-800 hover:text-blue-500'
                          }`}
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    )}
                  </motion.li>
                );
              })}
            </motion.ul>
          </motion.div>
        </motion.div>
      )}


      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 h-screen bg-white border-r p-6 pt-10 fixed top-0 left-0">
        <Box display="flex" alignItems="center" className="mb-2 gap-3 px-2">
          <img src="/smealogo.png" alt="Logo" className="w-10 h-10 object-contain" />
          <h2 className="text-xl font-bold text-blue-600">E - OSSAGAR</h2>
        </Box>
        <Divider sx={{ borderColor: '#97C1FF', marginBottom: '2vh' }} />
        <motion.ul className="space-y-4" variants={listVariants} initial="hidden" animate="visible">
          {menuItems.map((item, idx) => {
            const isActive = location.pathname === item.to;
            return (
              <motion.li key={idx} variants={itemVariants}>
                {item.to ? (
                  <Link
                    to={item.to}
                    className={`flex items-center gap-2 px-4 py-2 rounded transition ${item.danger
                      ? 'text-red-500 hover:text-red-700'
                      : isActive
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-800 hover:text-blue-500'
                      }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ) : (
                  <button
                    onClick={item.onClick}
                    className={`flex items-center gap-2 px-4 py-2 rounded w-full text-left transition ${item.danger
                      ? 'text-red-500 hover:text-red-700'
                      : 'text-gray-800 hover:text-blue-500'
                      }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                )}
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </>
  );
}
