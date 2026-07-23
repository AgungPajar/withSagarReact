import { Home, GraduationCap, MessageCircle, Users, Edit3, Calendar, Newspaper} from 'lucide-react';

export const getOsisMenuItems = (user, navigate, apiClient, Swal) => [
  { label: 'Home', to: '/admin/dashboard', icon: <Home size={18} /> },
  { label: 'Anggota', to: `/admin/${user?.id}/members`, icon: <Users size={18} /> },
  { label: 'TALK TO SAGAR', to: `/admin/ttsadmin`, icon: <MessageCircle size={18} /> },
  { label: 'Ekstrakurikuler', to: `/admin/clubs`, icon: <Users size={18} /> },
  { label: 'Rekapitulasi', to: `/admin/activity-reports`, icon: <Calendar size={18} /> },
  { label: 'News', to: `/admin/news`, icon: <Newspaper size={18} /> },
  {
    label: 'Siswa',
    icon: <GraduationCap size={18} />,
    submenu: [
      { label: 'KELAS X', to: '/admin/student/classx' },
      { label: 'KELAS XI', to: '/admin/student/classxi' },
      { label: 'KELAS XII', to: '/admin/student/classxii' },
    ],
  },
  { label: 'Edit Profile', to: `/admin/profile`, icon: <Edit3 size={18} /> },
]

export const getMpkMenuItems = (user, navigate, apiClient, Swal) => [
  { label: 'Home', to: '/mpk/dashboard', icon: <Home size={18} /> },
  { label: 'Anggota', to: `/mpk/${user?.id}/members`, icon: <Users size={18} /> },
  { label: 'TALK TO SAGAR', to: `/mpk/ttsadminmpk`, icon: <MessageCircle size={18} /> },
  { label: 'Rekapitulasi', to: `/mpk/activity-reports`, icon: <Calendar size={18} /> },
  {
    label: 'Siswa',
    icon: <GraduationCap size={18} />,
    submenu: [
      { label: 'KELAS X', to: '/mpk/student/classx' },
      { label: 'KELAS XI', to: '/mpk/student/classxi' },
      { label: 'KELAS XII', to: '/mpk/student/classxii' },
    ],
  },
  { label: 'Edit Profile', to: `/mpk/profile`, icon: <Edit3 size={18} /> },
]