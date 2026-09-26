import React from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export const Sidebar: React.FC = () => {
  const { user, isAdmin, toggleAdminMode } = useAuthStore();
  const adminActive = isAdmin();

  const navItems = [
    { to: '/', label: 'Trang chủ', icon: 'stadium', exact: true },
    { to: '/matches', label: 'Lịch & Trận đấu', icon: 'calendar_month' },
    { to: '/leaderboard', label: 'Bảng xếp hạng', icon: 'leaderboard' },
    { to: '/players', label: 'Cầu thủ & Đội hình', icon: 'groups' },
  ];

  if (adminActive) {
    navItems.push({ to: '/admin', label: 'Quản trị giải', icon: 'shield_person', exact: false });
  }

  const handleToggleAdmin = () => {
    toggleAdminMode();
    const nextState = !adminActive;
    if (nextState) {
      toast.success('Đã kích hoạt chế độ Quản trị viên (Admin)');
    } else {
      toast('Đã chuyển về chế độ Xem Thành viên (Viewer)', { icon: '👀' });
    }
  };

  const displayName = user?.fullName || 'Hùng Nguyễn';
  const roleLabel = adminActive ? 'Đội trưởng A • Admin Live' : 'Thành viên CLB';

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-65px)] z-30 flex-shrink-0 justify-between shadow-2xs">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="px-5 py-4 flex items-center gap-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-headline font-black shadow-xs shrink-0">
            <span className="material-symbols-outlined text-xl">sports_soccer</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-extrabold text-base tracking-tight text-slate-900 leading-snug">
              ChiMocCanh
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">
              Saigon Sunday League
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="px-3 py-4">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Quản lý thi đấu
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-semibold border-l-4 border-emerald-600'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <span
                        className={clsx(
                          'material-symbols-outlined text-xl',
                          isActive ? 'text-emerald-600' : 'text-slate-500'
                        )}
                      >
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Admin Status Toggle & User Profile in Sidebar */}
      <div className="p-3 border-t border-slate-100 flex flex-col gap-2.5 bg-slate-50/60">
        {/* Admin Mode Switch Pill */}
        <div className="bg-white border border-slate-200 rounded-lg p-2.5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-base">shield_person</span>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-800">Quyền Admin</span>
              <span className="text-[10px] text-slate-400">Ban cán sự CLB</span>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={adminActive}
            onClick={handleToggleAdmin}
            className={clsx(
              'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
              adminActive ? 'bg-emerald-600' : 'bg-slate-300'
            )}
            title="Chuyển chế độ Admin"
          >
            <span
              className={clsx(
                'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                adminActive ? 'translate-x-4' : 'translate-x-0'
              )}
            />
          </button>
        </div>

        {/* Current User Card */}
        <div className="flex items-center justify-between pt-1 px-1">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center ring-1 ring-slate-200">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900 leading-tight">
                {displayName}
              </span>
              <span className="text-[10px] font-medium text-slate-500">
                {roleLabel}
              </span>
            </div>
          </div>
          <button
            type="button"
            aria-label="Cài đặt"
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-base">tune</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
