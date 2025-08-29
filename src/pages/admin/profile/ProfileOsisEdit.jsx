// src/pages/admin/EditProfileOsisPage.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Typography, Button, TextField, Box, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit } from 'lucide-react';

import LoadingSpinner from '@/components/LoadingSpinner';
import { useProfileEditor } from '@/hooks/Clubs/useProfileEditor';

export default function EditProfileOsisPage() {
  const navigate = useNavigate();
  const {
    formState,
    loading,
    submitting,
    handleInputChange,
    handleLogoChange,
    handleSubmitProfile,
    logoPreview,
  } = useProfileEditor({ role: 'osis' });

  const profileFields = [
    { name: 'name', label: 'Nama Organisasi' },
    { name: 'username', label: 'Username' },
    { name: 'groupLink', label: 'Link Kontak (Opsional)' },
    { name: 'description', label: 'Deskripsi', multiline: true },
  ];

  const handleSave = async () => {
    await handleSubmitProfile();
    navigate('/admin/profile');
  };

  const handleCancel = () => {
    navigate('/admin/profile');
  };

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center"><LoadingSpinner /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-4">
          <Button onClick={() => navigate(-1)} startIcon={<ArrowLeft size={18} />}>
            Kembali
          </Button>
        </div>

        <Paper elevation={3} className="p-6 sm:p-8 rounded-2xl shadow-lg bg-white">
          <Box className="flex flex-col items-center mb-6">
            <Box className="relative">
              <Avatar
                src={logoPreview || '/logoeks.png'}
                alt={formState?.name}
                sx={{ width: 100, height: 100, border: '4px solid #f0f0f0' }}
              />
              <label htmlFor="logo-upload" className="absolute -bottom-2 -right-2 bg-gray-200 rounded-full p-1.5 cursor-pointer hover:bg-gray-300">
                <Edit size={18} />
                <input id="logo-upload" hidden accept="image/*" type="file" onChange={handleLogoChange} />
              </label>
            </Box>
          </Box>
          
          <Typography variant="h6" className="font-bold mb-4 text-center">
            Edit Informasi Akun
          </Typography>

          <div className="space-y-4">
            {profileFields.map(field => (
              <div key={field.name}>
                <Typography variant="body2" color="text.secondary" className="font-medium mb-1">{field.label}</Typography>
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

          <Box className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200">
            <Button variant="text" onClick={handleCancel}>Batal</Button>
            <Button variant="contained" onClick={handleSave} disabled={submitting}>
              {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </div>
  );
}