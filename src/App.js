import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import RegisterSiswaPage from './pages/RegisterPage';

import ClubDetail from './pages/club/ClubDetail';
import ReportPage from './pages/club/ReportPage';
import AttendancePage from './pages/club/AttendancePage';
import MemberList from './pages/club/MemberList';
import EditProfile from './pages/club/EditProfile';
import RekapPage from './pages/club/Rekapitulasi';
import AddMemberPage from './pages/club/AddMemberPage';

import StudentDashboard from './pages/student/HomeStudent';

import PoresForm from './pages/pores/PoresForm';
import SuksesLomba from './pages/pores/SuksesLomba';
import DataPores from './pages/pores/DataPoresPublic';

import AdminDashboard from './pages/admin/DashboardAdmin';
import AdminClubs from './pages/admin/ClubsAdminPage';
import EditClubs from './pages/admin/EditClubPage';
import AdminPores from './pages/admin/AdminPores';
import ClassXStudent from './pages/admin/student/ClassXStudent';
import ClassXIStudent from './pages/admin/student/ClassXIStudent';
import ClassXIIStudent from './pages/admin/student/ClassXIIStudent';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-siswa" element={<RegisterSiswaPage />} />
        <Route path="/porest" element={<PoresForm />} />
        <Route path="/data-pores" element={<DataPores />} />
        <Route path="/sukses" element={<SuksesLomba />} />

        {/* Protected Routes - Club */}
        <Route
          path="/club/:clubId"
          element={
            <ProtectedRoute>
              <ClubDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/club/:clubId/members"
          element={
            <ProtectedRoute>
              <MemberList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/club/:clubId/rekap"
          element={
            <ProtectedRoute>
              <RekapPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance/:clubId/report"
          element={
            <ProtectedRoute>
              <ReportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance/:clubId/attendance"
          element={
            <ProtectedRoute>
              <AttendancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/club/:clubId/members/add"
          element={
            <ProtectedRoute>
              <AddMemberPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/edit/:clubId"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />


        {/* Protected Routes - Student */}
        <Route
          path="/student/:studentId"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/clubs"
          element={
            <ProtectedRoute>
              <AdminClubs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/clubs/:clubId/edit"
          element={
            <ProtectedRoute>
              <EditClubs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/student/classx"
          element={
            <ProtectedRoute>
              <ClassXStudent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/student/classxi"
          element={
            <ProtectedRoute>
              <ClassXIStudent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/student/classxii"
          element={
            <ProtectedRoute>
              <ClassXIIStudent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/pores"
          element={
            <ProtectedRoute>
              <AdminPores />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
