import React from 'react';
import { motion } from 'framer-motion';

export default function FloatingTtsButton() {
  return (
    <a href="/ttsform" className="fixed bottom-1 right-8 z-[9999] cursor-pointer">
      <motion.img
        src="/ttslogo.png"
        alt="TTS"
        className="w-[6rem] h-[6rem] object-contain hover:scale-110 transition-transform duration-300 drop-shadow-xl"
        animate={{ y: [0, -15, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </a>
  );
}