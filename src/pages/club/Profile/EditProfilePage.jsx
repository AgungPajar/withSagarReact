// src/pages/EditProfilePage.jsx (Versi Revisi)

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Paper, Typography, Button, TextField, Box, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit } from 'lucide-react'; // Import icon baru

import LoadingSpinner from '@/components/LoadingSpinner';
import { useProfileEditor } from '@/hooks/Clubs/useProfileEditor';

export default function EditProfilePage() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const {
    formState,
    loading,
    submitting,
    handleInputChange,
    handleLogoChange,
    handleSubmitProfile,
    logoPreview,
  } = useProfileEditor({ role: 'club', clubId });

  // Konfigurasi field form
  const profileFields = [
    { name: 'name', label: 'Nama Ekskul' },
    { name: 'username', label: 'Username' },
    { name: 'groupLink', label: 'Link Grup (WA/Telegram)' },
    { name: 'description', label: 'Deskripsi', multiline: true },
  ];

  const handleSave = async () => {
    await handleSubmitProfile();
    navigate(`/club/${clubId}/profile`); // Balik ke halaman profil setelah save
  };

  const handleCancel = () => {
    navigate(`/club/${clubId}/profile`); // Balik ke halaman profil
  };

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center"><LoadingSpinner /></div>;
  }

  return (
    // Layout utama jadi simpel, hanya untuk menengahkan konten
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* 1. Tombol Kembali di bagian atas */}
        <div className="mb-4">
          <Button onClick={() => navigate(-1)} startIcon={<ArrowLeft size={18} />}>
            Kembali
          </Button>
        </div>

        {/* 2. Semua elemen sekarang ada di dalam satu Paper/Card */}
        <Paper elevation={3} className="p-6 sm:p-8 rounded-2xl shadow-lg bg-white">
          
          {/* 3. Avatar dan input logo digabung ke sini */}
          <Box className="flex flex-col items-center mb-6">
            <Box className="relative">
              <Avatar
                src={logoPreview || '/logoeks.png'}
                alt={formState?.name}
                sx={{ width: 100, height: 100, border: '4px solid #f0f0f0' }}
              />
              <label
                htmlFor="logo-upload"
                className="absolute -bottom-2 -right-2 bg-gray-200 rounded-full p-1.5 cursor-pointer hover:bg-gray-300 transition-colors"
              >
                <Edit size={18} />
                <input id="logo-upload" hidden accept="image/*" type="file" onChange={handleLogoChange} />
              </label>
            </Box>
          </Box>
          
          <Typography variant="h6" className="font-bold mb-4 text-center">
            Edit Informasi Ekskul
          </Typography>

          {/* Form Fields */}
          <div className="space-y-4">
            {profileFields.map(field => (
              <div key={field.name}>
                <Typography variant="body2" color="text.secondary" className="font-medium mb-1">
                  {field.label}
                </Typography>
                <TextField
                  name={field.name}
                  value={formState[field.name] || ''}
                  onChange={handleInputChange}
                  fullWidth
                  multiline={field.multiline}
                  rows={field.multiline ? 3 : 1}
                  variant="outlined"
                  size="small"
                />
              </div>
            ))}
          </div>

          {/* 4. Tombol Aksi (Simpan & Batal) dipindah ke sini */}
          <Box className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200">
            <Button variant="text" onClick={handleCancel}>
              Batal
            </Button>
            <Button variant="contained" onClick={handleSave} disabled={submitting}>
              {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </div>
  );
}