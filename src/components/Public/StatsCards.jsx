// src/components/public/StatsCards.jsx

import React from "react";
import { Typography } from '@mui/material';
import { motion } from 'framer-motion';

const StatCard = ({ value, label }) => (
  <motion.div
    className="bg-white/70 backdrop-blur p-4 rounded-xl text-center text-blue-900 shadow-lg border-2 border-blue-400"
    whileHover={{ scale: 1.05 }}
  >
    <Typography variant="h4" component="p" className="font-bold">{value}</Typography>
    <Typography variant="body2" component="p" className="opacity-80">{label}</Typography>
  </motion.div>
);

export default function StatsCards() {
  const stats = [
    { value: '49+', label: 'Pengurus' },
    { value: '39', label: 'Ekskul Aktif' },
    { value: '25+', label: 'Program / Thn' },
    { value: '7', label: 'Agenda Bulan Ini' },
  ];

  return (
    <div className="relative z-10 w-full px-4 sm:px-8 -mt-20 sm:-mt-14"> 
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} value={stat.value} label={stat.label} />
        ))}
      </div>
    </div>
  );
}