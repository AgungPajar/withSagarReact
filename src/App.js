import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ClubDetail from './pages/ClubDetail';
import Login from './pages/Login';
import ReportPage from './pages/ReportPage';
import AttendancePage from './pages/AttendancePage';
import MemberList from './pages/MemberList';
import EditProfile from './pages/EditProfile';
import RekapPage from './pages/Rekapitulasi';
import AddMemberPage from './pages/AddMemberPage';
import RegisterSiswaPage from './pages/RegisterPage';
import PoresForm from './pages/PoresForm';
import SuksesLomba from './pages/SuksesLomba';
import DataPores from './pages/DataPoresPublic';

import AdminDashboard from './pages/admin/DashboardAdmin';
import AdminClubs from './pages/admin/ClubsAdminPage';
import EditClubs from './pages/admin/EditClubPage';
import AdminPores from './pages/admin/AdminPores';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/club/:clubId" element={<ClubDetail />} />
        <Route path="/club/:clubId/members" element={<MemberList />} />
        <Route path="/club/:clubId/rekap" element={<RekapPage />} />
        <Route path="/attendance/:clubId/report" element={<ReportPage />} />
        <Route path="/attendance/:clubId/attendance" element={<AttendancePage />} />
        <Route path="/club/:clubId/members/add" element={<AddMemberPage />} />
        <Route path="/profile/edit/:clubId" element={<EditProfile />} />

        <Route path="/register-siswa" element={<RegisterSiswaPage />} />
        <Route path="/porest" element={<PoresForm />} />
        <Route path="/data-pores" element={<DataPores />} />
        <Route path="/sukses" element={<SuksesLomba />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/clubs" element={<AdminClubs />} />
        <Route path="/admin/clubs/:clubId/edit" element={<EditClubs />} />
        <Route path="/admin/pores" element={<AdminPores />} />
      </Routes>
    </Router>
  );
}

export default App;