// src/components/AnimatedRoutes.jsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Import all your pages
import ClubDetail from '../pages/ClubDetail';
import AttendanceReport from '../pages/AttendanceReport';
import MembersPage from '../pages/MembersPage';
import RekapPage from '../pages/RekapPage';
import EditProfile from '../pages/EditProfile';
// tambahin sesuai kebutuhan

const pageVariants = {
  initial: {
    opacity: 0,
    x: 30,
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: -30,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3,
};

export default function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/club/:clubId"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <ClubDetail />
            </motion.div>
          }
        />
        <Route
          path="/attendance/:clubId/report"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <AttendanceReport />
            </motion.div>
          }
        />
        <Route
          path="/club/:clubId/members"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <MembersPage />
            </motion.div>
          }
        />
        <Route
          path="/club/:clubId/rekap"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <RekapPage />
            </motion.div>
          }
        />
        <Route
          path="/profile/edit/:clubId"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <EditProfile />
            </motion.div>
          }
        />
        {/* Tambahin route lainnya juga ya */}
      </Routes>
    </AnimatePresence>
  );
}
