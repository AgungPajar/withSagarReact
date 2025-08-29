import React from "react";
import { Paper, Avatar, Typography, Box, Button } from "@mui/material";
import { motion, AnimatePresence } from 'framer-motion'

export default function ProfileHeader({
  club, logoPreview, logoFile
}) {
  return (
    <Paper elevation={3} className="p-6 px-auto sm:px-12 mt-20 sm:mt-1 shadow-lg flex flex-col sm:flex-row items-center gap-6 bg-white mb-6" sx={{ borderRadius: '1.5rem' }}>
      <div className="flex flex-col items-center gap-2">
        <Box className="relative">
          <Avatar
            src={logoPreview || '/logoeks.png'}
            alt="club?.name"
            sx={{ width: 90, height: 90, border: '3px solid #5bd0f3' }}
          />
        </Box>
      </div>

      <div className="text-center sm:text-left">
          <Typography variant="h5" className="font-bold">{club?.name || 'Nama Ekskul'}</Typography>
          <Typography variant="body1" color="text.secondary">{club?.username || 'Username'}</Typography>
          <Typography variant="body2" color="text.secondary" className="mt-1">{club?.description || 'Deskripsi singkat ekskul.'}</Typography>
        </div>

    </Paper>
  )
}