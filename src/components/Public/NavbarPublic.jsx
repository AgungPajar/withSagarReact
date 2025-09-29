import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Box, Button, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from "lucide-react";

const NavLink = ({ children, onClick, isScrolled, isActive }) => {
  const activeStyles = isScrolled
    ? 'text-blue-600 border-b-2 border-yellow-400'
    : 'text-blue-400 border-b-2 border-blue-600';

  const inactiveStyles = isScrolled
    ? 'text-gray-500 hover:text-blue-600'
    : 'text-gray-500 hover:text-blue-500 text-shadow-sm';

  return (
    <button
      onClick={onClick}
      className={`text-lg font-semibold transition-colors pb-1 ${isActive ? activeStyles : inactiveStyles}`}
    >
      {children}
    </button>
  );
};

export default function NavbarPublic({ user, onScrollToEkskul, onScrollToNews, activeSection }) {
  const navigate = useNavigate()
  const clubId = user?.club_hash_id
  const studentHashId = user?.student_hash_id
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
      setTimeout(() => {
        window.scrollTo?.({ top: 0, behavior: 'smooth' });
        document.documentElement?.scrollTo?.({ top: 0, behavior: 'smooth' });
        document.body?.scrollTo?.({ top: 0, behavior: 'smooth' });
      }, 300);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleScrollAndClose = (scrollFunction) => {
    setMobileMenuOpen(false);
    setTimeout(() => {
      scrollFunction();
    }, 300);
  }

  const AuthButton = ({ isMobile = false }) => {
    return user ? (
      <button
        onClick={() => {
          if (user.role === 'osis') return navigate('/admin/dashboard');
          if (user.role === 'mpk') return navigate('/mpk/dashboard');
          if (user.role === 'club_pengurus') return navigate(`/club/${clubId}`);
          if (user.role === 'student') return navigate(`/student/${studentHashId}`);
        }}
        className="w-full bg-green-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-green-600 transition"
      >
        LANJUT
      </button>
    ) : (
      <button
        onClick={() => navigate('/login')}
        className="w-full bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-600 transition"
      >
        LOGIN
      </button>
    )
  }

  return (
    <>
      <AppBar
        position={isScrolled ? "fixed" : 'absolute'}
        elevation={0}
        color="transparent"
        sx={{
          top: 0,
          left: 0,
          right: 0,
          transition: 'all 0.3s ease-in-out',
          zIndex: 100,

          ...(isScrolled && {
            top: '1rem',
            borderRadius: '24px',
            border: '2px solid #3B82F6',
            boxShadow: '0 8px 12px rgba(0, 0, 0, 0.3)',
            margin: '0 auto',
            width: { xs: 'calc(100% - 2rem)', md: '90%' },
            maxWidth: '1200px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            paddingX: 3,
          }),
          ...(!isScrolled && {
            paddingX: { xs: 2, md: 5 },
            paddingY: 0.6,
          })
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center" gap={2}>
            <img
              src="smealogo.png"
              alt="logo smea"
              className="w-8 h-8 object-contain"
            />
            <Typography variant="h6" fontWeight="bold" sx={{ color: isScrolled ? '#3B82F6' : '#fff', textShadow: isScrolled ? '1px 2px 3px rgba(236, 225, 105, 0.786)' : '1px 1px 3px rgba(0,0,0,0.5)', transition: 'all 0.3s' }}>
              OSSAGAR'59
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 4 }}>
            <NavLink onClick={scrollToTop} isScrolled={isScrolled} isActive={activeSection === 'home'}>Home</NavLink>
            <NavLink onClick={onScrollToEkskul} isScrolled={isScrolled} isActive={activeSection === 'ekskul'}>Ekstrakurikuler</NavLink>
            <NavLink onClick={onScrollToNews} isScrolled={isScrolled} isActive={activeSection === 'news'}>News</NavLink>
            <div className="w-px h-6 bg-gray-700" />
            <AuthButton />
          </Box>

          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={isScrolled ? "text-gray-800" : "text-white"}>
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={mobileMenuOpen ? 'close' : 'open'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </Box>
        </Toolbar>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-4 pt-0 flex flex-col items-center gap-4">
                <Divider sx={{ width: '100%', borderColor: isScrolled ? '#3B82F6' : 'rgba(255,255,255,0.3)' }} />
                <div className="flex flex-col justify-around w-full">
                  <NavLink onClick={scrollToTop} isMobile={true} isActive={activeSection === 'home'}>Home</NavLink>
                  <Divider orientation="horizontal" flexItem />
                  <NavLink onClick={() => handleScrollAndClose(onScrollToEkskul)} isMobile={true} isActive={activeSection === 'ekskul'}>Ekstrakurikuler</NavLink>
                  <Divider orientation="horizontal" flexItem sx={{ my: 1 }}/>
                  <NavLink onClick={() => handleScrollAndClose(onScrollToNews)} isMobile={true} isActive={activeSection === 'news'}>Berita</NavLink>
                </div>
                <div className="w-full pt-2">
                  <AuthButton isMobile={true} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </AppBar >
    </>
  )
}