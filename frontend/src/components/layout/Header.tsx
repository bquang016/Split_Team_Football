import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Avatar } from '../../ui';
import toast from 'react-hot-toast';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Đã đăng xuất');
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      toast(`Tìm kiếm: "${searchQuery}"`, { icon: '🔍' });
    }
  };

  return (
    <header className="sticky top-0 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 z-40 flex items-center justify-between px-4 sm:px-6 shadow-2xs">
      {/* Left: Mobile Brand & Live Match Banner (Sofascore style) */}
      <div className="flex items-center gap-3">
        {/* Mobile brand icon */}
        <Link to="/" className="lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-headline font-bold">
            <span className="material-symbols-outlined text-lg">sports_soccer</span>
          </div>
          <span className="font-headline font-black text-sm text-slate-900 hidden xs:inline">
            ChiMocCanh
          </span>
        </Link>

        {/* Live Match Indicator */}
        <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200/80 px-3 py-1.5 rounded-full text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-emerald-700 tracking-wide uppercase text-[10px]">
            Đang Diễn Ra
          </span>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span className="font-bold text-slate-800 hidden sm:inline">
            TÂY BAN NHA <span className="text-emerald-700 font-extrabold">2 - 1</span> PHÁP
          </span>
          <span className="bg-white text-slate-600 font-mono font-semibold px-1.5 py-0.5 rounded border border-slate-200 text-[10px]">
            68'
          </span>
        </div>
      </div>

      {/* Right: Search & Notifications & User Profile */}
      <div className="flex items-center gap-3">
        <div className="relative hidden md:flex items-center">
          <span className="material-symbols-outlined absolute left-2.5 text-slate-400 text-lg pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Tìm cầu thủ, chỉ số..."
            className="bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 w-48 sm:w-56 transition-all"
          />
        </div>

        <button
          type="button"
          aria-label="Thông báo"
          onClick={() => toast('Bạn không có thông báo mới', { icon: '🔔' })}
          className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <span className="material-symbols-outlined text-xl">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500" />
        </button>

        {isAuthenticated && user ? (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <Link
              to={`/players/${user.id}`}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Avatar
                name={user.fullName}
                jerseyNumber={user.jerseyNumber}
                size="sm"
                showNumber
              />
              <span className="font-bold text-xs text-slate-900 hidden sm:inline">
                {user.fullName}
              </span>
            </Link>
            <button
              onClick={handleLogout}
              title="Đăng xuất"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all"
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-all"
            >
              Đăng ký
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
