import React from 'react';
import { useWebSocketStore } from '../store/websocketStore';

export const ConnectionBanner: React.FC = () => {
  const isConnected = useWebSocketStore((state) => state.isConnected);

  if (isConnected) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-medium shadow-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Trực tiếp (STOMP)</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-mono font-medium shadow-xs">
      <span className="w-2 h-2 rounded-full bg-amber-500" />
      <span>Đang kết nối lại...</span>
    </div>
  );
};
