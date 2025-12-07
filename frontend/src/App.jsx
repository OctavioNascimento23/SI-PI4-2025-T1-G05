// Criado por Gabriel dos Santos
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/UserDashboard';
import ConsultantDashboard from './pages/ConsultantDashboard';
import ConsultantProfile from './pages/ConsultantProfile';
import RequestPage from './pages/RequestPage';
import ChatPage from './pages/ChatPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/request"
          element={
            <ProtectedRoute>
              <RequestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/consultant/dashboard"
          element={
            <ProtectedRoute>
              <ConsultantDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/consultant/profile"
          element={
            <ProtectedRoute>
              <ConsultantProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:requestId"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
