import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { Avatar, Toggle } from '../../ui';
import clsx from 'clsx';
import toast from 'react-hot-toast';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Đã đăng xuất');
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      toast.success(`Tìm kiếm: "${searchQuery}"`);
    }
  };

  return (
    <header
      className={clsx(
        'sticky top-0 h-16 z-40 flex-shrink-0 flex items-center justify-between px-4 sm:px-6 backdrop-blur-2xl transition-colors duration-300 border-b',
        theme === 'dark'
          ? 'bg-[#0B111E]/85 border-slate-800/80 shadow-xl shadow-slate-950/40'
          : 'bg-white/85 border-slate-200/90 shadow-2xs'
      )}
    >
      {/* Left: Mobile Brand & Live Match Indicator */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white flex items-center justify-center font-display font-black shadow-md shadow-emerald-900/30 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-xl">sports_soccer</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-sm sm:text-base tracking-tight text-slate-900 dark:text-white leading-tight">
              ChimMocCanh
            </span>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest hidden xs:inline">
              League Pro
            </span>
          </div>
        </Link>

        {/* Live Match High-Contrast Score Banner */}
        <div className="inline-flex items-center gap-2 bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 px-3 py-1 rounded-full text-xs font-space shadow-inner">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-extrabold text-emerald-600 dark:text-emerald-400 uppercase text-[10px] tracking-wider hidden sm:inline">
            Trực Tiếp
          </span>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <span className="text-rose-500 font-extrabold">ĐỎ 2</span>
            <span className="text-slate-400 font-normal">-</span>
            <span className="text-blue-500 font-extrabold">1 XANH</span>
          </div>
          <span className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono font-bold px-1.5 py-0.2 rounded text-[10px]">
            68'
          </span>
        </div>
      </div>

      {/* Right: Theme Switcher, Search, Design System Link, Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Minimal Search input */}
        <div className="relative hidden md:flex items-center">
          <span className="material-symbols-outlined absolute left-2.5 text-slate-400 text-base pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Tìm kiếm nhanh..."
            className="bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-xs rounded-full pl-8 pr-3 py-1.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 w-44 lg:w-56 transition-all"
          />
        </div>

        {/* Global Dark / Light Theme Toggle (Kiểu 1: Neon Glow Switch) */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span
            className={clsx(
              'material-symbols-outlined text-sm transition-colors',
              theme === 'light' ? 'text-amber-500 font-bold' : 'text-slate-500'
            )}
            title="Chế độ Sáng"
          >
            light_mode
          </span>
          <Toggle
            checked={theme === 'dark'}
            onChange={toggleTheme}
            aria-label="Chuyển đổi giao diện Sáng / Tối"
          />
          <span
            className={clsx(
              'material-symbols-outlined text-sm transition-colors',
              theme === 'dark' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            )}
            title="Chế độ Tối (Stadium Night)"
          >
            dark_mode
          </span>
        </div>

        {/* Quick Design Review Link */}
        <Link
          to="/design-system"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-space font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all shadow-2xs"
          title="Xem trang Duyệt thiết kế UI/UX"
        >
          <span className="material-symbols-outlined text-sm">palette</span>
          <span>Duyệt thiết kế</span>
        </Link>

        {isAuthenticated && user ? (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <Link
              to={`/players/${user.id}`}
              className="flex items-center gap-2 hover:opacity-85 transition-opacity"
            >
              <Avatar
                name={user.fullName}
                jerseyNumber={user.jerseyNumber}
                size="sm"
                showNumber
              />
              <span className="font-space font-bold text-xs text-slate-900 dark:text-slate-100 hidden sm:inline">
                {user.fullName}
              </span>
            </Link>
            <button
              onClick={handleLogout}
              title="Đăng xuất"
              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-3 py-1.5 rounded-full text-xs font-space font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-all"
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              className="btn-glass-pill btn-glass-primary !py-1.5 !px-3.5 !text-xs"
            >
              Đăng ký
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
