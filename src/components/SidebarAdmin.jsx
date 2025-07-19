import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu as MenuIcon, X as CloseIcon } from 'lucide-react';
import { Box, Divider } from '@mui/material';
import {
  Home,
  LogOut,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  MessageCircle,
  Users,
  Edit3,
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
  const { id } = useParams();
  const clubId = localStorage.getItem('club_id');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user'); // ini penting bro
    navigate('/');
  };

  useEffect(() => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    alert('Silakan login terlebih dahulu');
    return navigate('/');
  }

  // Kalau role bukan 'osis' maka langsung tolak akses ke sidebar admin
  if (user.role !== 'osis') {
    alert('Akses tidak diizinkan');
    return navigate('/');
  }

  // Cek apakah ID di URL cocok dengan ID user login
  if (id && user.id.toString() !== id.toString()) {
    alert('Akses tidak sesuai');
    return navigate(`/admin/${user.id}/members`); // redirect ke ID-nya sendiri
  }
}, [id, navigate]);




  const isSubmenuActive = (submenu) =>
    submenu?.some((sub) => location.pathname === sub.to);



  const menuItems = [
    { label: 'Home', to: '/admin/dashboard', icon: <Home size={18} /> },
    { label: 'Anggota', to: `/admin/${user?.id}/members`, icon: <Users size={18} /> },
    { label: 'TALK TO SAGAR', to: `/admin/ttsadmin`, icon: <MessageCircle size={18} /> },
    { label: 'Ekstrakurikuller', to: `/admin/clubs`, icon: <Users size={18} /> },
    {
      label: 'Siswa',
      icon: <GraduationCap size={18} />,
      submenu: [
        { label: 'KELAS X', to: '/admin/student/classx' },
        { label: 'KELAS XI', to: '/admin/student/classxi' },
        { label: 'KELAS XII', to: '/admin/student/classxii' },
      ],
    },
    { label: 'Edit Profile', to: `/admin/editadmin`, icon: <Edit3 size={18} /> },
    { label: 'Logout', onClick: handleLogout, danger: true, icon: <LogOut size={18} /> },
  ];


  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b shadow-sm fixed top-0 left-0 right-0 z-50">
        <Box display="flex" alignItems="center" className="gap-3 px-2">
          <img src="/smealogo.png" alt="Logo" className="w-10 h-10 object-contain" />
          <h2 className="text-xl font-bold text-blue-600">SI-ADMIN</h2>
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
          className=" fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
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

                // ✅ Jika ada submenu
                if (item.submenu) {
                  return (
                    <motion.li key={idx} variants={itemVariants}>
                      <button
                        onClick={() =>
                          setOpenSubmenu(openSubmenu === item.label ? null : item.label)
                        }
                        className={`flex items-center justify-between w-full px-4 py-2 rounded transition ${isSubmenuActive(item.submenu)
                          ? 'bg-blue-500 text-white font-semibold'
                          : 'text-gray-800 hover:text-blue-500'
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          {item.icon}
                          {item.label}
                        </span>
                        <motion.div
                          initial={false}
                          animate={{ rotate: openSubmenu === item.label ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown size={16} />
                        </motion.div>
                      </button>
                      {openSubmenu === item.label && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="ml-6 space-y-2"
                        >
                          {item.submenu.map((sub, i) => (
                            <li key={i}>
                              <Link
                                to={sub.to}
                                onClick={() => setSidebarOpen(false)}
                                className={`block px-4 py-1 rounded text-sm transition hover:text-blue-600 ${location.pathname === sub.to ? 'font-semibold text-blue-700' : 'text-gray-700'}`}
                              >
                                {sub.label}
                              </Link>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </motion.li>
                  );
                }

                // 🧍‍♂️ Menu biasa
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
          <h2 className="text-xl font-bold text-blue-600">SI-ADMIN</h2>
        </Box>
        <Divider sx={{ borderColor: '#97C1FF', marginBottom: '2vh' }} />
        <motion.ul className="space-y-4" variants={listVariants} initial="hidden" animate="visible">
          {menuItems.map((item, idx) => {
            const isActive = location.pathname === item.to;

            // ✅ Jika ada submenu
            if (item.submenu) {
              return (
                <motion.li key={idx} variants={itemVariants}>
                  <button
                    onClick={() =>
                      setOpenSubmenu(openSubmenu === item.label ? null : item.label)
                    }
                    className={`flex items-center justify-between w-full px-4 py-2 rounded transition ${isSubmenuActive(item.submenu)
                      ? 'bg-blue-500 text-white font-semibold'
                      : 'text-gray-800 hover:text-blue-500'
                      }`}
                  >
                    <span className="flex items-center gap-2">
                      {item.icon}
                      {item.label}
                    </span>
                    <motion.div
                      initial={false}
                      animate={{ rotate: openSubmenu === item.label ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={16} />
                    </motion.div>
                  </button>
                  {openSubmenu === item.label && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="ml-6 space-y-2"
                    >
                      {item.submenu.map((sub, i) => (
                        <li key={i}>
                          <Link
                            to={sub.to}
                            onClick={() => setSidebarOpen(false)}
                            className={`block px-4 py-1 rounded text-sm transition hover:text-blue-600 ${location.pathname === sub.to ? 'font-semibold text-blue-700' : 'text-gray-700'}`}
                          >
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </motion.li>
              );
            }

            // 🧍‍♂️ Menu biasa
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
      </div>
    </>
  );
}

