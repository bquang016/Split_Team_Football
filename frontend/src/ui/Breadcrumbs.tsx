import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

export interface StepItem {
  step: number;
  label: string;
  status: 'completed' | 'current' | 'upcoming';
  onClick?: () => void;
}

export interface BreadcrumbLink {
  label: string;
  to?: string;
  icon?: string;
}

export interface BreadcrumbsProps {
  steps?: StepItem[];
  links?: BreadcrumbLink[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  steps,
  links,
  className,
}) => {
  // If steps are provided, render Kiểu 3: Match Stepper Step Flow
  if (steps && steps.length > 0) {
    return (
      <nav
        aria-label="Tiến trình trận đấu"
        className={clsx(
          'p-2 sm:p-2.5 rounded-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-x-auto scrollbar-none',
          className
        )}
      >
        <div className="flex items-center justify-between min-w-[320px] gap-2">
          {steps.map((item, idx) => {
            const isCompleted = item.status === 'completed';
            const isCurrent = item.status === 'current';

            return (
              <React.Fragment key={item.step}>
                <div
                  onClick={item.onClick}
                  className={clsx(
                    'flex items-center gap-1.5 text-xs font-space font-bold uppercase tracking-wider select-none transition-all',
                    item.onClick && 'cursor-pointer hover:opacity-80',
                    isCompleted && 'text-emerald-600 dark:text-emerald-400',
                    isCurrent && 'text-slate-900 dark:text-white',
                    item.status === 'upcoming' && 'text-slate-400 dark:text-slate-600'
                  )}
                >
                  <span
                    className={clsx(
                      'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black transition-all shrink-0',
                      isCompleted && 'bg-emerald-500 text-slate-950 shadow-2xs shadow-emerald-500/30',
                      isCurrent && 'bg-emerald-600 text-white ring-1 ring-emerald-400/50 animate-pulse',
                      item.status === 'upcoming' && 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    )}
                  >
                    {isCompleted ? (
                      <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                    ) : (
                      item.step
                    )}
                  </span>
                  <span className="whitespace-nowrap">{item.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={clsx(
                      'h-0.5 flex-1 min-w-[14px] transition-colors',
                      isCompleted
                        ? 'bg-emerald-500/50'
                        : 'bg-slate-200 dark:bg-slate-800'
                    )}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </nav>
    );
  }

  // Fallback to standard path links with glass badge
  if (links && links.length > 0) {
    return (
      <nav
        aria-label="Breadcrumb"
        className={clsx(
          'inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 text-xs font-space font-medium',
          className
        )}
      >
        {links.map((link, idx) => {
          const isLast = idx === links.length - 1;

          return (
            <React.Fragment key={idx}>
              {link.to && !isLast ? (
                <Link
                  to={link.to}
                  className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  {link.icon && (
                    <span className="material-symbols-outlined text-[16px]">{link.icon}</span>
                  )}
                  <span>{link.label}</span>
                </Link>
              ) : (
                <span
                  className={clsx(
                    'flex items-center gap-1 font-bold',
                    isLast
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-700 dark:text-slate-300'
                  )}
                >
                  {link.icon && (
                    <span className="material-symbols-outlined text-[16px]">{link.icon}</span>
                  )}
                  <span>{link.label}</span>
                </span>
              )}
              {!isLast && <span className="text-slate-300 dark:text-slate-700">/</span>}
            </React.Fragment>
          );
        })}
      </nav>
    );
  }

  return null;
};
