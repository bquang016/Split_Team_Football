import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { useWebSocketStore } from '../../store/websocketStore';
import { useAuthStore } from '../../store/authStore';

export const MainLayout: React.FC = () => {
  const token = useAuthStore((state) => state.token);
  const connect = useWebSocketStore((state) => state.connect);
  const disconnect = useWebSocketStore((state) => state.disconnect);

  useEffect(() => {
    connect(token || undefined);
    return () => {
      disconnect();
    };
  }, [token, connect, disconnect]);

  return (
    <div className="min-h-screen bg-[#F9F9FF] text-[#151C27] flex flex-col font-sans selection:bg-[#FED01B] selection:text-[#064E3B]">
      <Header />
      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-16 lg:pb-0">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
};
