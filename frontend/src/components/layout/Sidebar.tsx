import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { Avatar } from '../../ui';
import toast from 'react-hot-toast';

export const Sidebar: React.FC = () => {
  const { user, isAdmin, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const navigate = useNavigate();
  const adminActive = isAdmin();

  const navItems = [
    { to: '/', label: 'Trang chủ', icon: 'home', exact: true },
    { to: '/matches', label: 'Lịch & Trận đấu', icon: 'calendar_month' },
    { to: '/leaderboard', label: 'Bảng xếp hạng', icon: 'leaderboard' },
    { to: '/match-history', label: 'Lịch sử thi đấu', icon: 'history' },
    { to: '/players', label: 'Cầu thủ & Đội hình', icon: 'groups' },
  ];

  if (adminActive) {
    navItems.push({ to: '/admin', label: 'Duyệt người dùng', icon: 'how_to_reg', exact: false });
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Đã đăng xuất');
  };

  const displayName = user?.fullName || 'Cầu thủ CMC';

  return (
    <aside
      className={clsx(
        'hidden lg:flex flex-col w-64 h-full border-r z-30 flex-shrink-0 justify-between transition-colors duration-300 select-none p-4',
        theme === 'dark'
          ? 'bg-[#0D121F] border-slate-800/80 text-slate-300'
          : 'bg-white border-slate-200/90 text-slate-700 shadow-sm'
      )}
    >
      <div className="flex flex-col gap-4 overflow-y-auto scrollbar-none">
        {/* 1. Brand Header: ChimMocCanh - CMC University */}
        <div className="flex items-center justify-between px-2 pt-1 pb-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 flex items-center justify-center font-black shadow-sm">
              <span className="material-symbols-outlined text-lg">sports_soccer</span>
            </div>
            <div className="flex flex-col">
              <span className="font-space font-black text-base text-slate-900 dark:text-white tracking-tight leading-tight">
                ChimMocCanh
              </span>
              <span className="text-[10px] font-space font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                CMC University
              </span>
            </div>
          </div>
          <button
            type="button"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Thu gọn sidebar"
          >
            <span className="material-symbols-outlined text-base">keyboard_double_arrow_left</span>
          </button>
        </div>

        {/* 2. Navigation Links */}
        <nav className="flex flex-col gap-1.5 pt-1">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                clsx(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-space font-bold transition-all duration-200 cursor-pointer',
                  isActive
                    ? theme === 'dark'
                      ? 'bg-[#1E293B] text-white border border-slate-700 shadow-sm'
                      : 'bg-slate-100 text-slate-950 border border-slate-300/80 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <span
                      className={clsx(
                        'material-symbols-outlined text-xl transition-colors',
                        isActive
                          ? 'text-emerald-500 dark:text-emerald-400'
                          : 'text-slate-400 dark:text-slate-500'
                      )}
                    >
                      {item.icon}
                    </span>
                    <span className="text-xs tracking-wide">{item.label}</span>
                  </div>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* 3. Bottom Controls: Theme Switcher + User Profile */}
      <div className="flex flex-col gap-3 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex-shrink-0">
        {/* Light / Dark Segmented Switcher */}
        <div
          className={clsx(
            'p-1 rounded-2xl flex items-center border transition-all',
            theme === 'dark'
              ? 'bg-[#131B2A] border-slate-800'
              : 'bg-slate-100 border-slate-200'
          )}
        >
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={clsx(
              'flex-1 py-1.5 rounded-xl text-xs font-space font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer',
              theme === 'light'
                ? 'bg-white text-slate-950 shadow-xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            )}
          >
            <span className="material-symbols-outlined text-sm text-amber-500">light_mode</span>
            <span>Sáng</span>
          </button>
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={clsx(
              'flex-1 py-1.5 rounded-xl text-xs font-space font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer',
              theme === 'dark'
                ? 'bg-[#1E293B] text-white shadow-xs border border-slate-700'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            )}
          >
            <span className="material-symbols-outlined text-sm text-indigo-400">dark_mode</span>
            <span>Tối</span>
          </button>
        </div>

        {/* User Card with Signout */}
        <div
          className={clsx(
            'p-2.5 rounded-2xl flex items-center justify-between border transition-all',
            theme === 'dark'
              ? 'bg-[#131B2A] border-slate-800/80'
              : 'bg-slate-50 border-slate-200/90 shadow-2xs'
          )}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative flex-shrink-0">
              <Avatar
                name={displayName}
                jerseyNumber={user?.jerseyNumber}
                size="sm"
                showNumber
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-space font-bold text-slate-950 dark:text-white truncate">
                {displayName}
              </span>
              <span className="text-[10px] text-slate-400 font-space truncate">
                {adminActive ? 'Ban Chủ Nhiệm / Admin' : 'Thành viên CLB'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title="Đăng xuất"
            className="flex items-center gap-1 text-[11px] font-space font-semibold text-slate-400 hover:text-rose-500 transition-colors flex-shrink-0 cursor-pointer pl-1"
          >
            <span>Thoát</span>
            <span className="material-symbols-outlined text-sm">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
