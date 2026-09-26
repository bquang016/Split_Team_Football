import React, { HTMLAttributes } from 'react';
import clsx from 'clsx';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevation?: 'level0' | 'level1' | 'level2';
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  elevation = 'level1',
  hoverable = false,
  ...props
}) => {
  const elevations = {
    level0: 'bg-slate-50 border border-slate-200/80',
    level1: 'bg-white border border-slate-200 shadow-xs hover:border-slate-300',
    level2: 'bg-white border border-slate-200/90 shadow-md shadow-slate-900/5',
  };

  return (
    <div
      className={clsx(
        'rounded-2xl p-5 transition-all duration-200 text-slate-900',
        elevations[elevation],
        hoverable && 'hover:shadow-lg hover:shadow-slate-900/5 hover:-translate-y-0.5 hover:border-slate-300 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
