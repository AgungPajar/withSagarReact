import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingSpinner() {
  return (
    <motion.div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-white/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </motion.div>
  );
}
