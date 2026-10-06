import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { Avatar, Badge } from '../../ui';
import { QuickUserSwitcher } from './QuickUserSwitcher';
import clsx from 'clsx';
import toast from 'react-hot-toast';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
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
        'sticky top-0 h-16 z-40 flex-shrink-0 flex items-center justify-between px-4 sm:px-6 backdrop-blur-2xl transition-all duration-300 border-b select-none',
        theme === 'dark'
          ? 'bg-[#0B0F19]/85 border-slate-800/80 text-slate-100 shadow-sm shadow-black/30'
          : 'bg-white/85 border-slate-200/80 text-slate-900 shadow-2xs'
      )}
    >
      {/* ========================================================================= */}
      {/* LEFT SECTION: Brand Logo & Club Identity                                 */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-3 min-w-0">
        <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-all duration-200">
            <span className="material-symbols-outlined text-xl text-slate-950">sports_soccer</span>
          </div>
          <div className="flex flex-col">
            <span className="font-space font-black text-base tracking-tight text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
              ChimMocCanh
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse hidden sm:inline-block" />
            </span>
            <span className="text-[10px] font-space font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest hidden xs:inline">
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
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Tìm kiếm cầu thủ, trận đấu, chỉ số..."
            className={clsx(
              'w-full text-xs font-space rounded-2xl pl-10 pr-12 py-2 border transition-all focus:outline-none focus:ring-2',
              theme === 'dark'
                ? 'bg-slate-900/60 border-slate-800 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20'
                : 'bg-slate-100/70 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20'
            )}
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-slate-200/60 dark:bg-slate-800/80 rounded border border-slate-300/60 dark:border-slate-700 pointer-events-none">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT SECTION: Quick Switcher & User Profile Dropdown                     */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <QuickUserSwitcher />

        {isAuthenticated && user ? (
          <div className="relative" ref={dropdownRef}>
            {/* User Dropdown Trigger Button (Replaces old pill + logout button) */}
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className={clsx(
                'flex items-center gap-2.5 p-1 sm:pr-2.5 rounded-2xl border transition-all cursor-pointer group',
                isDropdownOpen
                  ? 'ring-2 ring-emerald-500/30 border-emerald-500/50 bg-slate-100 dark:bg-slate-800'
                  : theme === 'dark'
                  ? 'bg-slate-900/70 hover:bg-slate-800 border-slate-800'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
              )}
              aria-expanded={isDropdownOpen}
              aria-label="Tùy chọn tài khoản"
            >
              <div className="relative">
                <Avatar
                  name={user.fullName}
                  src={user.avatarUrl}
                  jerseyNumber={user.jerseyNumber}
                  size="sm"
                  showNumber={false}
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              </div>

              <div className="hidden sm:flex flex-col min-w-0 text-left">
                <span className="font-space font-bold text-xs text-slate-900 dark:text-white truncate max-w-[110px] group-hover:text-emerald-500 transition-colors">
                  {user.fullName}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-space font-medium leading-none">
                  {user.role === 'ADMIN' ? 'Ban Quản Trị' : 'Cầu thủ'}
                </span>
              </div>

              <span
                className={clsx(
                  'material-symbols-outlined text-base text-slate-400 transition-transform duration-200',
                  isDropdownOpen && 'rotate-180 text-emerald-500'
                )}
              >
                expand_more
              </span>
            </button>

            {/* Floating Dropdown Menu */}
            {isDropdownOpen && (
              <div
                className={clsx(
                  'absolute right-0 mt-2 w-72 rounded-3xl p-2.5 border shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150',
                  theme === 'dark'
                    ? 'bg-slate-900/95 border-slate-800 backdrop-blur-2xl text-slate-100'
                    : 'bg-white/95 border-slate-200 backdrop-blur-2xl text-slate-900 shadow-xl'
                )}
              >
                {/* User Header Summary inside Dropdown */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800/80 mb-2">
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={user.fullName}
                      src={user.avatarUrl}
                      size="md"
                      showNumber={false}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-space font-bold text-sm text-slate-900 dark:text-white truncate">
                        {user.fullName}
                      </div>
                      <div className="text-xs text-slate-500 font-space truncate">
                        @{user.username}
                      </div>
                      {user.email && (
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">
                          {user.email}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex-wrap">
                    <Badge variant={user.role === 'ADMIN' ? 'primary' : 'neutral'} size="sm">
                      {user.role === 'ADMIN' ? 'Quản trị viên' : 'Cầu thủ'}
                    </Badge>
                    {user.jerseyNumber !== undefined && user.jerseyNumber !== null && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-space font-bold">
                        Số áo {user.jerseyNumber}
                      </span>
                    )}
                  </div>
                </div>

                {/* Dropdown Navigation Links */}
                <div className="space-y-1">
                  <Link
                    to={`/players/${user.id}`}
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-space font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base text-emerald-500">
                      person
                    </span>
                    <span>Hồ sơ cá nhân</span>
                  </Link>

                  <Link
                    to="/match-history"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-space font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base text-blue-500">
                      sports_soccer
                    </span>
                    <span>Lịch sử trận đấu</span>
                  </Link>

                  {user.role === 'ADMIN' && (
                    <Link
                      to="/admin"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-space font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base text-purple-500">
                        admin_panel_settings
                      </span>
                      <span>Bảng quản trị CLB</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      toggleTheme();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-space font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-base text-amber-500">
                        {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                      </span>
                      <span>Chế độ giao diện</span>
                    </div>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {theme === 'dark' ? 'Tối' : 'Sáng'}
                    </span>
                  </button>
                </div>

                {/* Dropdown Divider */}
                <div className="my-1.5 border-t border-slate-100 dark:border-slate-800" />

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-space font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer text-left"
                >
                  <span className="material-symbols-outlined text-base">logout</span>
                  <span>Đăng xuất tài khoản</span>
                </button>
              </div>
            )}
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
