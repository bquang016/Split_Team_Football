import React, { HTMLAttributes } from 'react';
import clsx from 'clsx';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevation?: 'level0' | 'level1' | 'level2' | 'glass';
  hoverable?: boolean;
  glow?: boolean;
  overflowHidden?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  elevation = 'level1',
  hoverable = false,
  glow = false,
  overflowHidden = false,
  ...props
}) => {
  // Kiểu 1: Bento Glass Card (Compact)
  const baseCard =
    'relative rounded-2xl p-3.5 sm:p-4 transition-all duration-300';

  const elevations = {
    level0:
      'bg-slate-100/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80',
    level1:
      'bento-glass-card',
    level2:
      'bento-glass-card shadow-xl dark:shadow-2xl',
    glass:
      'bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/20 dark:border-slate-700/60 shadow-xl',
  };

  return (
    <div
      className={clsx(
        baseCard,
        overflowHidden ? 'overflow-hidden' : 'overflow-visible',
        elevations[elevation],
        hoverable &&
          'hover:scale-[1.01] hover:border-emerald-500/40 dark:hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-950/20 cursor-pointer',
        glow && 'ring-1 ring-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.15)]',
        className
      )}
      {...props}
    >
      {glow && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      )}
      {children}
    </div>
  );
};
