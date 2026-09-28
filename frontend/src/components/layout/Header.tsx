import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { Avatar } from '../../ui';
import { QuickUserSwitcher } from './QuickUserSwitcher';
import clsx from 'clsx';
import toast from 'react-hot-toast';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    toast.success('Đã đăng xuất thành công');
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      toast.success(`Tìm kiếm: "${searchQuery}"`);
    }
  };

  return (
    <header
      className={clsx(
        'sticky top-0 h-16 z-40 flex-shrink-0 flex items-center justify-between px-4 sm:px-6 backdrop-blur-xl transition-colors duration-300 border-b select-none',
        theme === 'dark'
          ? 'bg-[#0D121F]/90 border-slate-800/80 text-slate-100 shadow-sm shadow-black/20'
          : 'bg-white/90 border-slate-200/90 text-slate-900 shadow-2xs'
      )}
    >
      {/* ========================================================================= */}
      {/* LEFT SECTION: Brand Logo & Name                                           */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-3 min-w-0">
        <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 flex items-center justify-center font-black shadow-sm group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-lg">sports_soccer</span>
          </div>
          <div className="flex flex-col">
            <span className="font-space font-black text-base tracking-tight text-slate-900 dark:text-white leading-tight">
              ChimMocCanh
            </span>
            <span className="text-[10px] font-space font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider hidden xs:inline">
              CMC University FC
            </span>
          </div>
        </Link>
      </div>

      {/* ========================================================================= */}
      {/* CENTER SECTION: Modern Search Omnibar                                     */}
      {/* ========================================================================= */}
      <div className="hidden md:flex items-center justify-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Tìm kiếm cầu thủ, trận đấu, chỉ số..."
            className={clsx(
              'w-full text-xs font-space rounded-2xl pl-9 pr-12 py-2 border transition-all focus:outline-none',
              theme === 'dark'
                ? 'bg-[#151D2E] border-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20'
            )}
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-slate-200/60 dark:bg-slate-800 rounded border border-slate-300/60 dark:border-slate-700 pointer-events-none">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT SECTION: User Authentication Profile & Quick Switcher                */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
        <QuickUserSwitcher />

        {isAuthenticated && user ? (
          <div
            className={clsx(
              'flex items-center gap-2.5 p-1 sm:pr-3 rounded-2xl border transition-all',
              theme === 'dark'
                ? 'bg-[#151D2E] border-slate-800'
                : 'bg-slate-50 border-slate-200'
            )}
          >
            <Link
              to={`/players/${user.id}`}
              className="flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <div className="relative">
                <Avatar
                  name={user.fullName}
                  jerseyNumber={user.jerseyNumber}
                  size="sm"
                  showNumber
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#151D2E]" />
              </div>
              <div className="hidden sm:flex flex-col min-w-0 text-left">
                <span className="font-space font-bold text-xs text-slate-900 dark:text-white truncate max-w-[120px]">
                  {user.fullName}
                </span>
                <span className="text-[10px] text-slate-400 font-space font-medium leading-none">
                  {user.role === 'ADMIN' ? 'Ban Chủ Nhiệm' : 'Cầu thủ'}
                </span>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              title="Đăng xuất"
              className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className={clsx(
                'px-3.5 py-1.5 rounded-xl text-xs font-space font-bold transition-all',
                theme === 'dark'
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              )}
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              className="px-4 py-1.5 rounded-xl text-xs font-space font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-sm transition-all"
            >
              Đăng ký
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
