import React, { useState, useEffect, useRef } from 'react';
import { Box, GlobalStyles } from '@mui/material';
import Swal from 'sweetalert2';

import NavbarPublic from '@/components/Public/NavbarPublic';
import HeroSection from '@/components/Public/HeroSection';
import StatsCards from '@/components/Public/StatsCards';
import EkskulSlider from '../components/EkskulSliderHome';
import LatestNews from '@/components/Public/Dashboard/LatestNews';
import PublicFooter from '@/components/Public/FooterPublic';
import FloatingTtsButton from '@/components/Public/FloatingTtsButton';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('home')
  const heroSectionRef = useRef(null);
  const ekskulSliderRef = useRef(null)
  const newsSectionRef = useRef(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    setUser(savedUser);

    const hasSeenALert = sessionStorage.getItem('infoAlertSeen')
    if (!hasSeenALert) {
      Swal.fire({
        title: 'OSSAGAR 59',
        text: 'Haiii',
        icon: 'info',
        confirmButtonText: 'Lanjutkan...',
        background: '#fff',
        color: '#333',
        customClass: {
          confirmButton: 'my-confirm-btn',
        },
      });
      sessionStorage.setItem('infoAlertSeen', 'true')
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    };

    const observerCallback = (entries) => {
      let maxRatio = 0;
      let mostVisibleId = '';

      entries.forEach(entry => {
        if (entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          mostVisibleId = entry.target.id;
        }
      });

      if (mostVisibleId && maxRatio > 0.4) {
        setActiveSection(mostVisibleId);
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const heroEl = heroSectionRef.current;
    const ekskulEl = ekskulSliderRef.current;
    const newsEl = newsSectionRef.current;

    if (heroEl) observer.observe(heroEl);
    if (ekskulEl) observer.observe(ekskulEl);
    if (newsEl) observer.observe(newsEl);

    return () => {
      if (heroEl) observer.unobserve(heroEl);
      if (ekskulEl) observer.unobserve(ekskulEl);
      if (newsEl) observer.observe(newsEl);
    };
  }, []);

  const scrollToEkskul = () => {
    if (ekskulSliderRef.current) {
      const offsetTop = ekskulSliderRef.current.offsetTop - 100;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  }
  const scrollToNews = () => {
    if (newsSectionRef.current) {
      const offsetTop = newsSectionRef.current.offsetTop - 100; // Offset biar gak ketutupan navbar
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };


  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '$f0f2f5', overflowX: 'hidden', }}>
      <GlobalStyles styles={{ body: { backgroundColor: '$f0f2f5' } }} />
      {loading && <LoadingSpinner />}

      <NavbarPublic user={user} onScrollToEkskul={scrollToEkskul} onScrollToNews={scrollToNews} activeSection={activeSection} />

      <div id="home" ref={heroSectionRef}>
        <HeroSection onScrollToEkskul={scrollToEkskul} />
      </div>

      <div id="ekskul" ref={ekskulSliderRef}>
        <StatsCards />
        <EkskulSlider onLoadFinish={() => setLoading(false)} />
      </div>

      <div id="news" ref={newsSectionRef}>
        <LatestNews />
      </div>

      <PublicFooter />
      {/* <FloatingTtsButton /> */}

    </Box >
  );
}
