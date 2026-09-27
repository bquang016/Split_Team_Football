import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { useWebSocketStore } from '../../store/websocketStore';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import clsx from 'clsx';

export const MainLayout: React.FC = () => {
  const token = useAuthStore((state) => state.token);
  const connect = useWebSocketStore((state) => state.connect);
  const disconnect = useWebSocketStore((state) => state.disconnect);
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    connect(token || undefined);
    return () => {
      disconnect();
    };
  }, [token, connect, disconnect]);

  return (
    <div
      className={clsx(
        'h-screen flex flex-col font-sans transition-colors duration-300 relative overflow-hidden selection:bg-emerald-500 selection:text-slate-950',
        theme === 'dark' ? 'bg-[#0B111E] text-slate-100' : 'bg-slate-50 text-slate-900'
      )}
    >
      {/* Stadium Ambient Floodlights */}
      {theme === 'dark' && (
        <>
          <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none z-0" />
          <div className="fixed top-1/3 right-10 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none z-0" />
          <div className="fixed bottom-10 left-10 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
        </>
      )}

      <Header />
      <div className="flex-1 flex max-w-7xl w-full mx-auto overflow-hidden relative z-10">
        <Sidebar />
        <main className="flex-1 h-full overflow-y-auto p-4 sm:p-5 lg:p-6 pb-20 lg:pb-6 scroll-smooth focus:outline-none">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
};
