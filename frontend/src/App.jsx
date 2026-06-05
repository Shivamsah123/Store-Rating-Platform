import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { NotificationProvider } from './context/NotificationContext';
import { ThemeModeProvider } from './context/ThemeModeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

// Public pages
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import UsersManagement from './pages/admin/UsersManagement';
import StoresManagement from './pages/admin/StoresManagement';
import UserDetails from './pages/admin/UserDetails';
import ReviewsManagement from './pages/admin/ReviewsManagement';

// User Pages
import UserDashboard from './pages/user/Dashboard';

// Store Owner Pages
import StoreOwnerDashboard from './pages/storeOwner/Dashboard';
import RatingsList from './pages/storeOwner/RatingsList';

// Helper component to route "/" depending on Role
const HomeRoute = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'ADMIN':
      return <AdminDashboard />;
    case 'USER':
      return <UserDashboard />;
    case 'STORE_OWNER':
      return <StoreOwnerDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
};

// Route wrapper for RBAC protection
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppContent = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Secure Layout routes */}
          <Route path="/" element={<Layout />}>
            {/* Dynamic Home Route based on Role */}
            <Route index element={<HomeRoute />} />

            {/* Profile Route accessible to all logged in users */}
            <Route path="profile" element={<Profile />} />

            {/* Admin Protected Routes */}
            <Route 
              path="admin/users" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <UsersManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="admin/stores" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <StoresManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="admin/users/:id" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <UserDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="admin/reviews" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <ReviewsManagement />
                </ProtectedRoute>
              } 
            />

            {/* Store Owner Protected Routes */}
            <Route 
              path="owner/ratings" 
              element={
                <ProtectedRoute allowedRoles={['STORE_OWNER']}>
                  <RatingsList />
                </ProtectedRoute>
              } 
            />

            {/* General fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

function App() {
  return (
    <NotificationProvider>
      <ThemeModeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeModeProvider>
    </NotificationProvider>
  );
}

export default App;
