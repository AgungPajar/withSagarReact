import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import { Typography, TextField, Button, Avatar, Paper, } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { motion } from 'framer-motion';

import SidebarClub from '@/components/ClubDetail/SidebarClub';
import Footer from '@/components/layouts/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useProfileEditor } from '@/hooks/Clubs/useProfileEditor';


export default function EditProfile() {
  const { clubId } = useParams();
  const navigate = useNavigate();

  const {
    formState,
    logoPreview,
    loading,
    submitting,
    handleInputChange,
    handleLogoChange,
    handleSubmitProfile,
    handleChangePassword,
  } = useProfileEditor(clubId);

  const [isExpanded, setIsExpanded] = useState(false)

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center"><LoadingSpinner /></div>;
  }

  return (
    <div>
      <div className="flex min-h-screen bg-gray-50">
        <SidebarClub isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

        <div className='flex-1 flex flex-col'>
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex-1 flex flex-col items-center p-4 sm:p-6 my-20 sm:my-0 sm:pb-20 transition-all duration-300 ${isExpanded ? 'md:ml-72' : 'md:ml-28'}`}
          >
            <div className='w-full max-w-lg'>

              <Paper className="p-6 rounded-2xl shadow-lg">
                <Typography variant="h5" className="font-bold mb-6 text-center">
                  Edit Profil
                </Typography>

                <div className="flex flex-col items-center mb-6">
                  <Avatar
                    src={logoPreview || '/logoeks.png'}
                    sx={{ width: 100, height: 100, mb: 2 }}
                  />
                  <Button variant="outlined" component="label">
                    UBAH LOGO
                    <input hidden accept="image/*" type="file" onChange={handleLogoChange} />
                  </Button>
                </div>

                <TextField name="username" label="Username" fullWidth margin="normal" value={formState.username} onChange={handleInputChange} />
                <TextField name="name" label="Nama Ekskul" fullWidth margin="normal" value={formState.name} onChange={handleInputChange} />
                <TextField name="description" label="Deskripsi/Bio" fullWidth margin="normal" multiline rows={3} value={formState.description} onChange={handleInputChange} />
                <TextField name="groupLink" label="Link Grup (WhatsApp/Telegram)" fullWidth margin="normal" value={formState.groupLink} onChange={handleInputChange} />

                <div>
                  <Button
                    variant='outlined'
                    color="secondary"
                    fullWidth
                    onClick={handleChangePassword}
                  >
                    Ubah Password
                  </Button>

                  <LoadingButton
                    loading={submitting}
                    variant="contained"
                    color="primary"
                    fullWidth
                    size='large'
                    onClick={handleSubmitProfile}
                  >
                    Simpan Perubahan
                  </LoadingButton>
                </div>
              </Paper>
            </div>
          </motion.main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
