import React from 'react';
import clsx from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'surface' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: string;
  rightIcon?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-bold tracking-tight rounded-xl transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none btn-athletic';

  const variants = {
    // Primary: Athletic Yellow background with Deep Emerald Green text for maximum contrast
    primary:
      'bg-[#FED01B] hover:bg-[#E5BC17] text-[#064E3B] font-extrabold shadow-sm shadow-[#FED01B]/30 border border-[#E5BC17]/40',
    // Secondary: Deep Emerald background with White text
    secondary:
      'bg-[#064E3B] hover:bg-[#003527] text-white font-bold shadow-sm shadow-[#064E3B]/20 border border-[#064E3B]',
    gold:
      'bg-[#FED01B] hover:bg-[#E5BC17] text-[#064E3B] font-extrabold shadow-sm',
    surface:
      'bg-[#F0F3FF] hover:bg-[#E2E8F8] text-[#151C27] border border-[#E2E8F8] shadow-xs',
    outline:
      'bg-transparent hover:bg-[#F0F3FF] text-[#064E3B] border border-[#064E3B]/30',
    danger:
      'bg-[#BA1A1A] hover:bg-[#93000A] text-white font-bold shadow-xs',
    ghost:
      'bg-transparent hover:bg-[#F0F3FF] text-[#404944]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : leftIcon ? (
        <span className="material-symbols-outlined text-[18px]">{leftIcon}</span>
      ) : null}
      {children}
      {!isLoading && rightIcon && (
        <span className="material-symbols-outlined text-[18px]">{rightIcon}</span>
      )}
    </button>
  );
};
