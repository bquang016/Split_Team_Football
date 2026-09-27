import React from 'react';
import clsx from 'clsx';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'gold' | 'cyan' | 'neutral' | 'error' | 'success' | 'outline' | 'teamA' | 'teamB' | 'live';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className,
  icon,
  dot = false,
}) => {
  // Kiểu 4: High-Contrast Score & Tag
  const baseStyles =
    'inline-flex items-center font-space font-bold uppercase tracking-wider rounded-lg select-none shadow-2xs';

  const variants = {
    primary:
      'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30',
    secondary:
      'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30',
    gold:
      'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30',
    cyan:
      'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30',
    success:
      'bg-emerald-600 text-white border border-emerald-400/40 shadow-xs',
    neutral:
      'bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300/60 dark:border-slate-700',
    error:
      'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30',
    outline:
      'border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-transparent',
    teamA:
      'bg-rose-600 text-white font-extrabold border border-rose-400/40 shadow-xs',
    teamB:
      'bg-blue-600 text-white font-extrabold border border-blue-400/40 shadow-xs',
    live:
      'bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 border border-emerald-500/40 animate-pulse',
  };

  const sizes = {
    sm: 'text-[9px] px-1.5 py-0.2 gap-1 rounded',
    md: 'text-[10px] px-2 py-0.5 gap-1 rounded-md',
    lg: 'text-[11px] px-2.5 py-0.5 gap-1.5 font-extrabold rounded-md',
  };

  return (
    <span className={clsx(baseStyles, variants[variant], sizes[size], className)}>
      {dot && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
      )}
      {icon && <span className="material-symbols-outlined text-[14px]">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
