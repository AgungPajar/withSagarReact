import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import SidebarMpk from '@/components/layouts/SidebarMpk';
import Footer from '@/components/layouts/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import ProfileHeader from '@/components/ClubDetail/Profile/ProfileHeader';
import ProfileMain from '@/components/ClubDetail/Profile/ProfileMain';
import SecurityCard from '@/components/ClubDetail/Profile/ProfileSecurity';
import { useProfileEditor } from '@/hooks/Clubs/useProfileEditor';

export default function ProfileOsis() {
  const navigate = useNavigate()
  const {
    formState,
    setFormState,
    initialState,
    logoPreview,
    loading,
    handleInputChange,
    handleLogoChange,
    handleSubmitProfile,
    handleChangePassword,
  } = useProfileEditor({ role: 'osis' });

  const [isSidebarExpanded, setSidebarExpanded] = useState(false);
  const [editingSection, setEditingSection] = useState(null);

  const profileFields = [
    { name: 'name', label: 'Nama Ekskul' },
    { name: 'username', label: 'Username' },
    { name: 'groupLink', label: 'Link Grup (WA/Telegram)' },
    { name: 'description', label: 'Deskripsi', multiline: true },
  ];

  const handleSave = async () => {
    await handleSubmitProfile();
    setEditingSection(null);
  };

  const handleCancel = () => {
    setFormState(initialState);
    setEditingSection(null);
  };

  const handleEdit = () => {
    navigate(`/admin/profile/edit`);
  };

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center"><LoadingSpinner /></div>;
  }

  return (
    <div>
      <SidebarMpk isExpanded={isSidebarExpanded} setIsExpanded={setSidebarExpanded} />
      <div className="flex min-h-screen sm:ml-72 bg-gray-100">
        <div className='flex-1 flex flex-col w-full overflow-hidden'>
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex-1 p-4 sm:p-6 transition-all duration-300 ${isSidebarExpanded ? 'md:ml-72' : 'md:ml-28'}`}
          >
            <ProfileHeader
              club={formState}
              logoPreview={logoPreview}
              handleLogoChange={handleLogoChange}
            />

            <ProfileMain
              title="Informasi Ekskul"
              fields={profileFields}
              data={formState}
              isEditing={editingSection === 'profile'}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
              onChange={handleInputChange}
            />

            <SecurityCard handleChangePassword={handleChangePassword} />

          </motion.main>
        </div>
      </div>
      <Footer />
    </div>
  );
}