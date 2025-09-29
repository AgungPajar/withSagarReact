import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingSpinner() {
  return (
    <>
      <style>{`
        .shimmer-ring {
          width: 9rem;
          height: 9rem;
          border-radius: 9999px;
          position: absolute;
          background: conic-gradient(from 0deg, #60A5FA 0%, transparent 40%, #60A5FA 60%, transparent 100%);
          animation: shimmerSpin 1.5s linear infinite;
          filter: blur(2px);
          opacity: 0.7;
        }

        @keyframes shimmerSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .wave-container {
          display: flex;
          gap: 6px;
          margin-top: 1.5rem;
        }

        .wave-bar {
          width: 8px;
          height: 40px;
          background-color: #3B82F6;
          border-radius: 4px;
          animation: wave 1.2s infinite ease-in-out;
        }

        .wave-bar:nth-child(1) { animation-delay: -1.1s; }
        .wave-bar:nth-child(2) { animation-delay: -1.0s; }
        .wave-bar:nth-child(3) { animation-delay: -0.9s; }
        .wave-bar:nth-child(4) { animation-delay: -0.8s; }
        .wave-bar:nth-child(5) { animation-delay: -0.7s; }

        @keyframes wave {
          0%, 40%, 100% {
            transform: scaleY(0.4);
          }
          20% {
            transform: scaleY(1);
          }
        }
      `}</style>

      <motion.div
        className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Spinner dan Logo */}
        <div className="relative w-40 h-40 flex items-center justify-center mb-6">
          <img
            src="/smealogo.png"
            alt="Logo"
            className="w-24 h-24 z-10 relative drop-shadow-xl"
          />
          <div className="shimmer-ring"></div>
        </div>

        {/* Wave Loader */}
        <div className="wave-container">
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
        </div>
      </motion.div>
    </>
  );
}
