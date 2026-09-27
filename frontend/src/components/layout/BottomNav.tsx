import React from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';

export const BottomNav: React.FC = () => {
  const isAdmin = useAuthStore((state) => state.isAdmin());
  const theme = useThemeStore((state) => state.theme);

  const navItems = [
    { to: '/', label: 'Trang chủ', icon: 'stadium', exact: true },
    { to: '/matches', label: 'Trận đấu', icon: 'calendar_month' },
    { to: '/leaderboard', label: 'BXH', icon: 'leaderboard' },
    { to: '/players', label: 'Cầu thủ', icon: 'groups' },
    { to: '/design-system', label: 'Thiết kế', icon: 'palette' },
  ];

  if (isAdmin) {
    navItems.push({ to: '/admin', label: 'Quản trị', icon: 'shield_person' });
  }

  return (
    <nav
      className={clsx(
        'lg:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-2xl border-t px-2 py-2 flex items-center justify-around transition-colors duration-300',
        theme === 'dark'
          ? 'bg-[#0B111E]/90 border-slate-800 shadow-2xl shadow-slate-950'
          : 'bg-white/90 border-slate-200 shadow-lg'
      )}
    >
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.exact}
          className={({ isActive }) =>
            clsx(
              'flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all font-space',
              isActive
                ? 'text-emerald-500 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            )
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={clsx(
                  'material-symbols-outlined text-[22px]',
                  isActive && 'text-emerald-500 dark:text-emerald-400'
                )}
              >
                {item.icon}
              </span>
              <span className="text-[10px] mt-0.5 tracking-tight font-bold">{item.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)] mt-0.5" />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
