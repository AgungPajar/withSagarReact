import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Public
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import PoresForm from './pages/public/PoresForm';
import SuksesLomba from './pages/public/SuksesLomba';
import DataAgustusan from './pages/public/DataAgustusan';
import TTSForm from './pages/public/TTSForm';
import NewsDetail from './components/Public/News/NewsDetail';

// Ekstrakurikuller
import ClubDetail from './pages/club/ClubDetail';
import ReportGateway from './pages/club/Report/ReportGateway';
import ReportPage from './pages/club/Report/ReportPage';
import AttendancePage from './pages/club/Attendance/AttendancePage';
import AttendanceGateaway from './pages/club/Attendance/AttendanceGateaway';
import MemberList from './pages/club/Members/MemberList';
import ProfilePage from './pages/club/Profile/ProfileClub';
import EditProfilePage from './pages/club/Profile/EditProfilePage';
import RecapAttendance from './pages/club/Recap/RecapAttendance';
import RekapReportPage from './pages/club/Recap/RecapReport';
import AddMemberPage from './pages/club/AddMemberPage';

// Student
import StudentDashboard from './pages/student/HomeStudent';
import EditProfileStudent from './pages/student/EditProfileStudent';

// Admin Or OSIS
import AdminDashboard from './pages/admin/DashboardAdmin';
import MemberListAdmin from './pages/admin/MemberListAdmin';
import AdminClubs from './pages/admin/ClubsAdminPage';
import EditClubs from './pages/admin/EditClubPage';
import AdminPores from './pages/admin/AdminPores';
import ClassXStudent from './pages/admin/student/ClassXStudent';
import ClassXIStudent from './pages/admin/student/ClassXIStudent';
import ClassXIIStudent from './pages/admin/student/ClassXIIStudent';
import TTSAdmin from './pages/admin/TTSAdmin';
import ProfileOsisPage from './pages/admin/profile/ProfileOsis';
import ProfileOsisEdit from './pages/admin/profile/ProfileOsisEdit';
import ActivityAdmin from './pages/admin/ActivityReports';
import NewsListAdmin from './pages/admin/news-admin';
import CreateNewsPage from './pages/admin/news-admin/create';
import EditNews from './pages/admin/news-admin/edit';

// MPK
import DashboardMPK from './pages/mpk/DashboardMpk';
import MemberListMPK from './pages/mpk/MemberListMPK';
import TTSAdminMPK from './pages/mpk/TTSAdminMPK';
import ClassXStudentmpk from './pages/mpk/studentmpk/ClassXStudent';
import ClassXIStudentmpk from './pages/mpk/studentmpk/ClassXIStudent';
import ClassXIIStudentmpk from './pages/mpk/studentmpk/ClassXIIStudent';
import EditMPK from './pages/mpk/ProfileMpk';
import ActivityMPK from './pages/mpk/ActivityReports';

function App() {
  return (
    <Router>
      <Routes> {/* Public Routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/porest" element={<PoresForm />} />
        <Route path="/data" element={<DataAgustusan />} />
        <Route path="/sukses" element={<SuksesLomba />} />
        <Route path="/ttsform" element={<TTSForm />} />
        <Route path="/news/:slug" element={<NewsDetail />} />
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
          path="/club/:clubId/recap-attendance"
          element={
            <ProtectedRoute>
              <RecapAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/club/:clubId/recap-report"
          element={
            <ProtectedRoute>
              <RekapReportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report/:clubId/gateaway"
          element={
            <ProtectedRoute>
              <ReportGateway />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report/:clubId/report"
          element={
            <ProtectedRoute>
              <ReportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance/:clubId/gateaway"
          element={
            <ProtectedRoute>
              <AttendanceGateaway />
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
          path="/club/:clubId/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/club/:clubId/profile/edit"
          element={
            <ProtectedRoute>
              <EditProfilePage />
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
          path="/admin/profile"
          element={
            <ProtectedRoute>
              <ProfileOsisPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile/edit"
          element={
            <ProtectedRoute>
              <ProfileOsisEdit />
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
        <Route
          path="/admin/activity-reports"
          element={
            <ProtectedRoute>
              <ActivityAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/news"
          element={
            <ProtectedRoute>
              <NewsListAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/news/create"
          element={
            <ProtectedRoute>
              <CreateNewsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/news/edit/:id"
          element={
            <ProtectedRoute>
              <EditNews />
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
          path="/mpk/profile"
          element={
            <ProtectedRoute>
              <EditMPK />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mpk/activity-reports"
          element={
            <ProtectedRoute>
              <ActivityMPK />
            </ProtectedRoute>
          }
        />
      </Routes>

    </Router>
  );
}

export default App;
