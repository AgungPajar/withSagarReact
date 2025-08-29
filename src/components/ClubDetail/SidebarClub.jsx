import React, { useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu as MenuIcon, X as CloseIcon } from 'lucide-react';
import { Box, Divider } from '@mui/material';
import {
  Home,
  Users,
  ClipboardList,
  Edit3,
  LogOut,
  CalendarCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { useLogout } from '@/hooks/useLogout';

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

const getMenuItems = (clubId) => [
  { label: 'Home', to: `/club/${clubId}`, icon: <Home size={18} /> },
  {
    label: 'Report&Presensi',
    icon: <CalendarCheck size={18} />,
    submenu: [
      { label: 'Report', to: `/report/${clubId}/gateaway`, icon: <CalendarCheck size={18} /> },
      { label: 'Presensi', to: `/attendance/${clubId}/gateaway`, icon: <CalendarCheck size={18} /> },
    ],
  },
  { label: 'Anggota', to: `/club/${clubId}/members`, icon: <Users size={18} /> },
  {
    label: 'Rekapitulasi',
    icon: <ClipboardList size={18} />,
    submenu: [
      { label: 'Presensi', to: `/club/${clubId}/recap-attendance`, icon: <ClipboardList size={18} /> },
      { label: 'Report', to: `/club/${clubId}/recap-report`, icon: <ClipboardList size={18} /> },
    ],
  },
  { label: 'Edit Profile', to: `/club/${clubId}/profile`, icon: <Edit3 size={18} /> },
];

const MenuContent = ({ isExpanded, menuItems, location, openSubmenu, setOpenSubmenu, onLinkClick }) => {
  const isSubmenuActive = (submenu) => submenu?.some((sub) => location.pathname === sub.to);

  return (
    <motion.ul className="space-y-2" variants={listVariants} initial="hidden" animate="visible">
      {menuItems.map((item) => {
        const isActive = location.pathname === item.to;
        const isParentActive = item.submenu ? isSubmenuActive(item.submenu) : false;

        if (item.submenu) {
          return (
            // HAPUS PROP `layout` DARI SINI
            <motion.li key={item.label} variants={itemVariants}>
              <button
                onClick={() => isExpanded && setOpenSubmenu(openSubmenu === item.label ? null : item.label)}
                className={`flex items-center p-3 rounded-lg transition-colors duration-200 text-gray-600
                  ${isExpanded ? 'w-full justify-between' : 'w-12 h-12 justify-center'}
                  ${isParentActive ? 'bg-gray-800 text-white' : 'hover:bg-gray-100'}
                `}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  {isExpanded && <span className="font-semibold">{item.label}</span>}
                </div>
                {isExpanded && (
                  <motion.div initial={false} animate={{ rotate: openSubmenu === item.label ? 180 : 0 }}>
                    <ChevronDown size={16} />
                  </motion.div>
                )}
              </button>
              {isExpanded && openSubmenu === item.label && (
                <motion.ul className="ml-5 mt-1 space-y-1">
                  {item.submenu.map((sub) => (
                    <li key={sub.label}>
                      <Link to={sub.to} onClick={onLinkClick} className={`block pl-6 pr-3 py-1.5 rounded-md text-sm transition ${location.pathname === sub.to ? 'font-bold text-blue-600' : 'text-gray-500 hover:text-black'}`}>
                        - {sub.label}
                      </Link>
                    </li>
                  ))}
                </motion.ul>
              )}
            </motion.li>
          );
        }

        return (
          // HAPUS PROP `layout` DARI SINI JUGA
          <motion.li key={item.label} variants={itemVariants}>
            {item.to ? (
              <Link
                to={item.to}
                onClick={onLinkClick}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200
                  ${isExpanded ? 'w-full' : 'w-12 h-12 justify-center'}
                  ${isActive ? 'bg-gray-800 text-white' : `hover:bg-gray-100 ${item.danger ? 'text-red-500' : 'text-gray-600'}`}
                `}
              >
                {item.icon}
                {isExpanded && <span className="font-semibold">{item.label}</span>}
              </Link>
            ) : (
              <button
                onClick={() => { item.onClick?.(); onLinkClick?.(); }}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200
                  ${isExpanded ? 'w-full' : 'w-12 h-12 justify-center'}
                  ${item.danger ? 'text-red-500 hover:bg-red-50' : 'text-gray-600 hover:bg-gray-100'}`
                }
              >
                {item.icon}
                {isExpanded && <span className="font-semibold">{item.label}</span>}
              </button>
            )}
          </motion.li>
        );
      })}
    </motion.ul>
  );
};

export default function SidebarClub({ isExpanded, setIsExpanded }) {
  const { clubId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const logout = useLogout();

  const menuItems = React.useMemo(() => {
    const navItems = getMenuItems(clubId);

    const logoutItem = {
      label: 'Logout',
      onClick: logout,
      danger: true,
      icon: <LogOut size={18} />
    };

    return [...navItems, logoutItem];
  }, [clubId, logout]);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b shadow-sm fixed top-0 left-0 right-0 z-50">
        <Box display="flex" alignItems="center" className="gap-3 px-2">
          <img src="/smealogo.png" alt="Logo" className="w-10 h-10 object-cover" />
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
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="mobile-sidebar-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <motion.div
              key="mobile-sidebar-content"
              initial={{ x: -250, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-[85%] max-w-sm bg-white h-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-16">
                <h2 className="text-xl font-bold text-blue-600">Menu</h2>
                <button onClick={() => setSidebarOpen(false)}>
                  <CloseIcon className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              <MenuContent
                isExpanded={true}
                menuItems={menuItems}
                location={location}
                openSubmenu={openSubmenu}
                setOpenSubmenu={setOpenSubmenu}
                onLinkClick={() => setSidebarOpen(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Desktop Sidebar */}
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
        className={`
          hidden md:flex flex-col
          h-full max-h-[90vh] bg-white border rounded-2xl shadow-lg 
          fixed top-4 left-4
          ${isExpanded ? 'w-64 p-4' : 'w-20 p-3'}
        `}>
        {/* Tombol Toggle tidak ada perubahan */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
          absolute top-14 -right-3.5
          bg-white border-2 border-gray-200 w-7 h-7 flex items-center justify-center rounded-full shadow-md
          text-gray-600 hover:bg-gray-100 hover:scale-110 transition-all z-10
          `}
        >
          {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        {/* BAGIAN 1: HEADER (LEBIH SIMPLE) */}
        <motion.div
          layout="position"
          className={`flex items-center gap-3 pb-4 ${!isExpanded && 'justify-center'}`}
        >
          <img src="/smealogo.png" alt="Logo" className="w-10 h-10 flex-shrink-0" />
          {isExpanded && (
            <h2 className="text-xl font-bold text-blue-600 truncate ml-1">
              E - OSSAGAR
            </h2>
          )}
        </motion.div>

        <Divider sx={{ borderColor: '#E0E0E0' }} />

        {/* BAGIAN 2: KONTEN MENU UTAMA */}
        <div className="flex-1 mt-4 overflow-y-auto">
          <MenuContent
            isExpanded={isExpanded}
            setIsExpanded={() => { }}
            menuItems={menuItems}
            location={location}
            openSubmenu={openSubmenu}
            setOpenSubmenu={setOpenSubmenu}
            onLinkClick={() => setSidebarOpen(false)}
          />
        </div>
      </motion.div>
    </>
  );
}
