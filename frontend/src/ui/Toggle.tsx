import React from 'react';
import clsx from 'clsx';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  sublabel?: string;
  disabled?: boolean;
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  sublabel,
  disabled = false,
  className,
}) => {
  // Kiểu 1: Neon Glow Switch
  return (
    <div
      className={clsx(
        'inline-flex items-center justify-between gap-3 select-none',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        className
      )}
      onClick={() => !disabled && onChange(!checked)}
    >
      {(label || sublabel) && (
        <div className="flex flex-col text-left">
          {label && (
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 font-space">
              {label}
            </span>
          )}
          {sublabel && (
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-sans">
              {sublabel}
            </span>
          )}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={clsx(
          'switch-neon-track',
          checked ? 'active' : 'inactive'
        )}
      >
        <div className="switch-neon-thumb" />
      </button>
    </div>
  );
};
