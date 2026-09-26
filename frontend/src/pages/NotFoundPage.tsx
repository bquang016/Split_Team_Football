import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
      <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mb-4 shadow-xs">
        <span className="material-symbols-outlined text-[36px]">sports_soccer</span>
      </div>
      <h1 className="font-heading font-black text-4xl text-slate-900 mb-2">404</h1>
      <p className="text-sm text-slate-500 font-mono mb-6">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển
      </p>
      <Link to="/">
        <Button variant="primary" leftIcon="home">
          Về trang chủ
        </Button>
      </Link>
    </div>
  );
};
