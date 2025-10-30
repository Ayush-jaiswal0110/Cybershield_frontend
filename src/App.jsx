import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EmailSecurity from "./pages/EmailSecurity";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import UserProfile from "./pages/UserProfile";
import UserDashboard from "./pages/UserDashboard";
import UserReports from "./pages/UserReports";
import UserAlerts from "./pages/UserAlerts";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeProvider";
import LandingPage from "./pages/LandingPage";  // Use enhanced landing page component
import DeployPage from "./pages/DeployPage";     // Optional, if you want deploy screen
import { Toaster } from "./components/ui/sonner";     // Toaster from enhanced design

export default function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Router>
          <Routes>
            {/* New enhanced landing page as homepage */}
            <Route path="/" element={<LandingPage />} />

            {/* Login page route */}
            <Route path="/login" element={<Login />} />

            {/* Optional Deploy route (if you want to open from landing page button) */}
            <Route path="/deploy" element={<DeployPage />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/email-security"
              element={
                <ProtectedRoute>
                  <EmailSecurity />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-reports"
              element={
                <ProtectedRoute>
                  <UserReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-alerts"
              element={
                <ProtectedRoute>
                  <UserAlerts />
                </ProtectedRoute>
              }
            />
          </Routes>

          {/* Global Toaster (notification system) */}
          <Toaster />
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
