import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Jobs from './pages/Jobs';
import AdminDashboard from './pages/AdminDashboard';
import UserApplications from './pages/UserApplications';
import Profile from './pages/Profile';
import JobDetail from './pages/JobDetail';
import AdminUserProfile from './pages/AdminUserProfile';
import AdminLogin from './pages/AdminLogin';

// Protected Route Wrapper
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && role !== 'admin') {
    return <Navigate to="/jobs" replace />;
  }

  return children;
};

// Main App Content
const AppContent = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50">
      {location.pathname !== '/jobs/admin' && <Navbar />}

      <Routes>
        {/* Default route */}
        <Route
          path="/"
          element={<Navigate to="/jobs" replace />}
        />

        {/* Authentication */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* Admin Login */}
        <Route
          path="/jobs/admin"
          element={<AdminLogin />}
        />

        {/* Jobs */}
        <Route
          path="/jobs"
          element={<Jobs />}
        />

        <Route
          path="/jobs/:id"
          element={<JobDetail />}
        />

        {/* Candidate Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin User Profile */}
        <Route
          path="/admin/user/:id"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminUserProfile />
            </ProtectedRoute>
          }
        />

        {/* Candidate Applications */}
        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <UserApplications />
            </ProtectedRoute>
          }
        />

        {/* Unknown route */}
        <Route
          path="*"
          element={<Navigate to="/jobs" replace />}
        />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;