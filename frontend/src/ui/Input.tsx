import { InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: string;
  rightIcon?: string;
  onClear?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, onClear, className, id, value, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1 text-left group">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-space"
          >
            {label}
          </label>
        )}
        <div
          className={clsx(
            'relative flex items-center border-b-2 transition-colors pb-0.5',
            error
              ? 'border-rose-500 dark:border-rose-500'
              : 'border-slate-300 dark:border-slate-700/80 focus-within:border-emerald-500 dark:focus-within:border-emerald-400'
          )}
        >
          {leftIcon && (
            <span
              className={clsx(
                'material-symbols-outlined text-[20px] mr-2 pointer-events-none transition-colors',
                error
                  ? 'text-rose-500'
                  : 'text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500'
              )}
            >
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            value={value}
            className={clsx(
              'w-full bg-transparent py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none font-sans',
              error && 'text-rose-500',
              className
            )}
            {...props}
          />
          {onClear && value && (
            <button
              type="button"
              onClick={onClear}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
          {rightIcon && !onClear && (
            <span className="material-symbols-outlined text-slate-400 text-[20px] ml-2 pointer-events-none">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <span className="text-xs text-rose-500 font-semibold mt-0.5">{error}</span>}
        {helperText && !error && (
          <span className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
