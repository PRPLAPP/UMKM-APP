import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/landing/LandingPage';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';
import VillagerDashboard from './components/dashboard/VillagerDashboard';
import MSMEDashboard from './components/dashboard/MSMEDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import { Toaster } from './components/ui/sonner';
import ScrollToTopButton from './components/ui/ScrollToTopButton';
import { useAuth } from './hooks/useAuth';
import { I18nProvider } from './i18n';

export default function App() {
  const { user, isAuthenticated, initializing, logout } = useAuth();

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading your workspace...</p>
      </div>
    );
  }

  const protectedRoute = (role: 'villager' | 'msme' | 'admin', Component: React.ComponentType<{ onLogout: () => void }>) =>
    isAuthenticated && user?.role === role ? (
      <Component onLogout={logout} />
    ) : (
      <Navigate to="/login" replace />
    );

  return (
    <I18nProvider>
      <Router>
        <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
          <Route
            path="/dashboard/villager"
            element={protectedRoute('villager', VillagerDashboard)}
          />
          <Route
            path="/dashboard/msme"
            element={protectedRoute('msme', MSMEDashboard)}
          />
          <Route
            path="/dashboard/admin"
            element={protectedRoute('admin', AdminDashboard)}
          />
        </Routes>
        <Toaster />
        <ScrollToTopButton />
      </div>
      </Router>
    </I18nProvider>
  );
}
