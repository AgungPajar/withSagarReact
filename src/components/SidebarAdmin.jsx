import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu as MenuIcon, X as CloseIcon } from 'lucide-react';

export default function SidebarAdmin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/');
  };

  const menuItems = [
    { label: 'Dashboard', to: '/admin/dashboard' },
    { label: 'Eksrakurikuler', to: '/admin/clubs' },
    { label: 'Data Pores', to: '/admin/pores' },
    // { label: 'Anggota', to: '/' },
    // { label: 'Presensi', to: '/' },
    // { label: 'Rekap%Report', to: '/' },
    // { label: 'RoleUser', to: '/' },
    // { label: 'Pengaturan', to: '/' },
    { label: 'Logout', onClick: handleLogout, danger: true },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b shadow-sm fixed top-0 left-0 right-0 z-50">
        <h2 className="text-lg font-bold text-blue-600">Admin Panel</h2>
        <button onClick={() => setSidebarOpen(true)}>
          <MenuIcon className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Overlay Drawer */}
      <div
        className={`fixed inset-0 z-40 transition-transform transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-black bg-opacity-50 md:hidden`}
        onClick={() => setSidebarOpen(false)}
      >
        <div
          className="w-64 bg-white h-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-blue-600">Menu</h2>
            <button onClick={() => setSidebarOpen(false)}>
              <CloseIcon className="w-5 h-5 text-gray-700" />
            </button>
          </div>
          <ul className="space-y-4">
            {menuItems.map((item, idx) => (
              <li key={idx}>
                {item.to ? (
                  <Link
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    className={`block text-gray-800 hover:text-blue-500 transition ${
                      item.danger ? 'text-red-500 hover:text-red-700' : ''
                    }`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      item.onClick?.();
                      setSidebarOpen(false);
                    }}
                    className={`block text-left w-full ${
                      item.danger ? 'text-red-500 hover:text-red-700' : 'text-gray-800 hover:text-blue-500'
                    } transition`}
                  >
                    {item.label}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 h-screen bg-white border-r p-6 fixed top-0 left-0">
        <h2 className="text-xl font-bold text-blue-600 mb-8 border-b pb-2">Admin Panel</h2>
        <ul className="space-y-4">
          {menuItems.map((item, idx) => (
            <li key={idx}>
              {item.to ? (
                <Link
                  to={item.to}
                  className={`block text-gray-800 hover:text-blue-500 transition ${
                    item.danger ? 'text-red-500 hover:text-red-700' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  onClick={item.onClick}
                  className={`block text-left w-full ${
                    item.danger ? 'text-red-500 hover:text-red-700' : 'text-gray-800 hover:text-blue-500'
                  } transition`}
                >
                  {item.label}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
