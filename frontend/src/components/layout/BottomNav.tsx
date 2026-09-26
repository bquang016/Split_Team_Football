import React from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { useAuthStore } from '../../store/authStore';

export const BottomNav: React.FC = () => {
  const isAdmin = useAuthStore((state) => state.isAdmin());

  const navItems = [
    { to: '/', label: 'Trang chủ', icon: 'dashboard', exact: true },
    { to: '/matches', label: 'Trận đấu', icon: 'sports_soccer' },
    { to: '/leaderboard', label: 'BXH', icon: 'leaderboard' },
    { to: '/players', label: 'Cầu thủ', icon: 'groups' },
  ];

  if (isAdmin) {
    navItems.push({ to: '/admin', label: 'Quản trị', icon: 'admin_panel_settings' });
  }

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2E8F8] px-2 py-2 flex items-center justify-around shadow-lg">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.exact}
          className={({ isActive }) =>
            clsx(
              'flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all',
              isActive
                ? 'text-[#064E3B] font-bold'
                : 'text-[#707974] hover:text-[#151C27]'
            )
          }
        >
          {({ isActive }) => (
            <>
              <span className={clsx('material-symbols-outlined text-[22px]', isActive && 'fill text-[#064E3B]')}>
                {item.icon}
              </span>
              <span className="text-[11px] mt-0.5 tracking-tight font-heading font-semibold">{item.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#FED01B] mt-0.5" />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
