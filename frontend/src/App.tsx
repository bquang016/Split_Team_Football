import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { MainLayout } from './components/layout/MainLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { MatchListPage } from './pages/MatchListPage';
import { MatchDetailPage } from './pages/MatchDetailPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { PlayerListPage } from './pages/PlayerListPage';
import { PlayerProfilePage } from './pages/PlayerProfilePage';
import { AdminPage } from './pages/AdminPage';
import { DesignShowcasePage } from './pages/DesignShowcasePage';
import { NotFoundPage } from './pages/NotFoundPage';
// New pages
import { MatchHistoryPage } from './pages/MatchHistoryPage';
import { LineupPage } from './pages/LineupPage';

export const App: React.FC = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#FFFFFF',
            color: '#0F172A',
            border: '1px solid #E2E8F0',
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: '13px',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Main App Layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/matches" element={<MatchListPage />} />
          <Route path="/matches/:id" element={<MatchDetailPage />} />
          {/* Trang sa bàn riêng biệt (Step 5) */}
          <Route path="/matches/:id/lineup" element={<LineupPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/match-history" element={<MatchHistoryPage />} />
          <Route path="/players" element={<PlayerListPage />} />
          <Route path="/players/:id" element={<PlayerProfilePage />} />

          {/* Design Showcase / UI Component System Review (dev only) */}
          <Route path="/design-system" element={<DesignShowcasePage />} />
          <Route path="/showcase" element={<DesignShowcasePage />} />
          <Route path="/duyet-thiet-ke" element={<DesignShowcasePage />} />

          {/* Admin Protected Route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
