import React from 'react';
import clsx from 'clsx';

export interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
}) => {
  const variantStyles = {
    rectangular: 'rounded-xl',
    circular: 'rounded-full',
    text: 'rounded h-4',
  };

  return (
    <div
      className={clsx(
        'animate-pulse bg-slate-200 border border-slate-300/50',
        variantStyles[variant],
        className
      )}
    />
  );
};
