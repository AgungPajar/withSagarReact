import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

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
import EditProfileStudent from './pages/student/EditProfileStudent';

import PoresForm from './pages/public/PoresForm';
import SuksesLomba from './pages/public/SuksesLomba';
import DataPores from './pages/public/DataPoresPublic';
import TTSForm from './pages/public/TTSForm';

import AdminDashboard from './pages/admin/DashboardAdmin';
import MemberListAdmin from './pages/admin/MemberListAdmin';
import AdminClubs from './pages/admin/ClubsAdminPage';
import EditClubs from './pages/admin/EditClubPage';
import AdminPores from './pages/admin/AdminPores';
import ClassXStudent from './pages/admin/student/ClassXStudent';
import ClassXIStudent from './pages/admin/student/ClassXIStudent';
import ClassXIIStudent from './pages/admin/student/ClassXIIStudent';
import TTSAdmin from './pages/admin/TTSAdmin';
import EditAdmin from './pages/admin/EditProfileadm';

import DashboardMPK from './pages/mpk/DashboardMPK';
import MemberListMPK from './pages/mpk/MemberListMPK';
import TTSAdminMPK from './pages/mpk/TTSAdminMPK';
import ClassXStudentmpk from './pages/mpk/studentmpk/ClassXStudent';
import ClassXIStudentmpk from './pages/mpk/studentmpk/ClassXIStudent';
import ClassXIIStudentmpk from './pages/mpk/studentmpk/ClassXIIStudent';
import EditMPK from './pages/mpk/EditProfilempk';


function App() {
  return (
    <Router>

      <Routes> {/* Public Routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-siswa" element={<RegisterSiswaPage />} />
        <Route path="/porest" element={<PoresForm />} />
        <Route path="/data-pores" element={<DataPores />} />
        <Route path="/sukses" element={<SuksesLomba />} />
        <Route path="/ttsform" element={<TTSForm />} />
      </Routes>

      <Routes> {/* Club Routes */}
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
      </Routes>

      <Routes> {/* Student Routes */}
      <Route
        path="/student/:studentId"
        element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/profile/edit/:studentId"
        element={
          <ProtectedRoute>
            <EditProfileStudent />
          </ProtectedRoute>
        }
      />
      </Routes>

      <Routes> {/* AdminOsis Routes */}
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
      <Route
        path="/admin/ttsadmin"
        element={
          <ProtectedRoute>
            <TTSAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/editadmin"
        element={
          <ProtectedRoute>
            <EditAdmin />
          </ProtectedRoute>
        }
      />
      <Route
          path="/admin/:clubId/members"
          element={
            <ProtectedRoute>
              <MemberListAdmin />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Routes> {/* MPK Routes */}
      <Route
        path="/mpk/dashboard"
        element={
          <ProtectedRoute>
            <DashboardMPK />
          </ProtectedRoute>
        }
      />
      <Route
          path="/mpk/:clubId/members"
          element={
            <ProtectedRoute>
              <MemberListMPK />
            </ProtectedRoute>
          }
        />
      <Route
        path="/mpk/ttsadminmpk"
        element={
          <ProtectedRoute>
            <TTSAdminMPK />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mpk/student/classx"
        element={
          <ProtectedRoute>
            <ClassXStudentmpk />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mpk/student/classxi"
        element={
          <ProtectedRoute>
            <ClassXIStudentmpk />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mpk/student/classxii"
        element={
          <ProtectedRoute>
            <ClassXIIStudentmpk />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mpk/editmpk"
        element={
          <ProtectedRoute>
            <EditMPK />
          </ProtectedRoute>
        }
      />
      </Routes>

    </Router>
  );
}

export default App;
