import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ClubDetail from './pages/ClubDetail';
import Login from './pages/Login';
import Attendance from './pages/AttendancePage';
import AdminClub from './pages/AdminClubs';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/club/:clubId" element={<ClubDetail />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/admin/clubs" element={<AdminClub />} />
      </Routes>
    </Router>
  );
}

export default App;