import React from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { Toggle } from '../../ui';
import toast from 'react-hot-toast';

export const Sidebar: React.FC = () => {
  const { user, isAdmin, toggleAdminMode } = useAuthStore();
  const { theme } = useThemeStore();
  const adminActive = isAdmin();

  const navItems: { to: string; label: string; icon: string; exact?: boolean; isHighlight?: boolean }[] = [
    { to: '/', label: 'Trang chủ', icon: 'stadium', exact: true },
    { to: '/matches', label: 'Lịch & Trận đấu', icon: 'calendar_month' },
    { to: '/leaderboard', label: 'Bảng xếp hạng', icon: 'leaderboard' },
    { to: '/match-history', label: 'Lịch sử đấu', icon: 'history' },
    { to: '/players', label: 'Cầu thủ & Đội hình', icon: 'groups' },
  ];

  if (adminActive) {
    navItems.push({ to: '/admin', label: 'Duyệt người dùng', icon: 'shield_person', exact: false });
  }

  const handleToggleAdmin = () => {
    toggleAdminMode();
    const nextState = !adminActive;
    if (nextState) {
      toast.success('Đã kích hoạt quyền Quản trị viên (Admin)');
    } else {
      toast.success('Đã chuyển về chế độ Xem Thành viên');
    }
  };

  const displayName = user?.fullName || 'Hùng Nguyễn';
  const roleLabel = adminActive ? 'Đội trưởng • Admin Live' : 'Thành viên CLB';

  return (
    <aside
      className={clsx(
        'hidden lg:flex flex-col w-64 h-full border-r z-30 flex-shrink-0 justify-between transition-colors duration-300 select-none',
        theme === 'dark'
          ? 'bg-[#0E1626]/70 backdrop-blur-2xl border-slate-800/80'
          : 'bg-white/80 backdrop-blur-2xl border-slate-200/90 shadow-2xs'
      )}
    >
      <div className="flex flex-col flex-1 overflow-y-auto scrollbar-none">
        {/* Navigation Menu */}
        <div className="px-3 py-4">
          <div className="text-xs font-bold font-space text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2.5">
            Quản lý thi đấu
          </div>
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-space font-bold transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600/20 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
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
                      <span className="flex items-center gap-2">
                        {item.label}
                        {item.isHighlight && (
                          <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 rounded-full shadow-2xs animate-pulse">
                            UI/UX
                          </span>
                        )}
                      </span>
                    </div>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Admin Status Toggle & User Profile in Sidebar - Fixed at bottom of screen */}
      <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2.5 flex-shrink-0 bg-inherit backdrop-blur-xl">
        {/* Admin Mode Switch Pill */}
        <div
          className={clsx(
            'rounded-2xl p-2.5 flex items-center justify-between border transition-all',
            theme === 'dark'
              ? 'bg-slate-900/60 border-slate-800'
              : 'bg-slate-50 border-slate-200/80 shadow-2xs'
          )}
        >
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-emerald-500 text-lg">
              shield_person
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-bold font-space text-slate-800 dark:text-slate-200">
                Quyền Admin
              </span>
              <span className="text-[10px] text-slate-400">Ban cán sự CLB</span>
            </div>
          </div>
          <Toggle checked={adminActive} onChange={handleToggleAdmin} />
        </div>

        {/* Current User Card */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 text-white font-space font-bold text-xs flex items-center justify-center ring-1 ring-emerald-500/40 shadow-2xs">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold font-space text-slate-900 dark:text-white leading-tight">
                {displayName}
              </span>
              <span className="text-[10px] font-medium text-slate-400">
                {roleLabel}
              </span>
            </div>
          </div>
          <button
            type="button"
            aria-label="Cài đặt"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">tune</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
