import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  variant?: 'primary' | 'secondary' | 'surface' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  ariaLabel: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, variant = 'surface', size = 'md', className, ariaLabel, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none active:scale-95';

    const variants = {
      primary: 'bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-xs',
      secondary: 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-xs',
      surface: 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 shadow-xs',
      ghost: 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 bg-transparent',
      danger: 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 shadow-xs',
    };

    const sizes = {
      sm: 'w-8 h-8 text-[18px]',
      md: 'w-10 h-10 text-[20px]',
      lg: 'w-12 h-12 text-[24px]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        aria-label={ariaLabel}
        className={clsx(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        <span className="material-symbols-outlined">{icon}</span>
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
