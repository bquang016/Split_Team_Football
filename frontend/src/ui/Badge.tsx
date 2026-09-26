import React from 'react';
import clsx from 'clsx';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'gold' | 'cyan' | 'neutral' | 'error' | 'success' | 'outline' | 'teamA' | 'teamB';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className,
  icon,
}) => {
  const baseStyles = 'inline-flex items-center font-mono font-bold uppercase tracking-wider rounded-lg select-none';

  const variants = {
    primary: 'bg-red-50 text-red-700 border border-red-200',
    secondary: 'bg-blue-50 text-blue-700 border border-blue-200',
    gold: 'bg-amber-50 text-amber-800 border border-amber-200',
    cyan: 'bg-sky-50 text-sky-700 border border-sky-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
    error: 'bg-red-50 text-red-700 border border-red-200',
    outline: 'border border-slate-300 text-slate-700 bg-transparent',
    teamA: 'bg-red-50 text-red-700 border border-red-200',
    teamB: 'bg-blue-50 text-blue-700 border border-blue-200',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-xs px-3 py-1.5 gap-1.5 font-bold',
  };

  return (
    <span className={clsx(baseStyles, variants[variant], sizes[size], className)}>
      {icon && <span className="material-symbols-outlined text-[14px]">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
