import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

export interface SelectOption {
  value: string | number;
  label: string;
  avatar?: string;
  jerseyNumber?: number;
  badge?: string;
  sublabel?: string;
  icon?: string;
}

export interface SelectProps {
  label?: string;
  error?: string;
  options: SelectOption[];
  value?: string | number;
  defaultValue?: string | number;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
  onChange?: (e: any) => void;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options = [],
  value,
  defaultValue,
  placeholder = 'Chọn một mục...',
  disabled = false,
  className,
  id,
  name,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string | number | undefined>(
    value !== undefined ? value : defaultValue
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const safeOptions = Array.isArray(options) ? options : [];
  const currentValue = value !== undefined ? value : internalValue;
  const selectedOption = safeOptions.find((opt) => String(opt.value) === String(currentValue));

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // Attach listener with a microtask delay so the triggering mousedown isn't immediately caught
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (option: SelectOption) => {
    if (disabled) return;
    setInternalValue(option.value);
    setIsOpen(false);

    if (onChange) {
      // Create synthetic event for compatibility with standard React event handlers
      const syntheticEvent = {
        target: {
          value: option.value,
          name: name || id || '',
        },
      };
      onChange(syntheticEvent as any);
    }
  };

  return (
    <div
      ref={containerRef}
      data-dropdown-open={isOpen ? 'true' : undefined}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      className={clsx(
        'w-full flex flex-col gap-1 text-left relative font-vietnam',
        isOpen ? 'z-50' : 'z-auto',
        className
      )}
    >
      {label && (
        <label
          htmlFor={id}
          className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider select-none"
        >
          {label}
        </label>
      )}

      {/* Trigger Button: Kiểu 1 Glass Panel Trigger (Compact) */}
      <div
        className={clsx('relative', isOpen ? 'z-50' : 'z-auto')}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          id={id}
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) setIsOpen(!isOpen);
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className={clsx(
            'w-full flex items-center justify-between gap-1.5 py-1.5 px-2.5 rounded-xl transition-all duration-200 select-none text-left cursor-pointer border',
            isOpen
              ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-white/90 dark:bg-slate-900/90 shadow-sm'
              : 'border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs',
            disabled && 'opacity-50 cursor-not-allowed',
            error && 'border-rose-500 ring-rose-500/20'
          )}
        >
          <div className="flex items-center gap-2 min-w-0 truncate">
            {selectedOption ? (
              <>
                {selectedOption.avatar ? (
                  <img
                    src={selectedOption.avatar}
                    alt={selectedOption.label}
                    className="w-4.5 h-4.5 rounded-full object-cover shrink-0 ring-1 ring-slate-300 dark:ring-slate-700"
                  />
                ) : selectedOption.jerseyNumber !== undefined ? (
                  <span className="w-4.5 h-4.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-[9px] flex items-center justify-center shrink-0 border border-emerald-500/30">
                    #{selectedOption.jerseyNumber}
                  </span>
                ) : selectedOption.icon ? (
                  <span className="material-symbols-outlined text-sm text-slate-400 shrink-0">
                    {selectedOption.icon}
                  </span>
                ) : null}

                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                  {selectedOption.label}
                </span>

                {selectedOption.badge && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0 font-mono">
                    {selectedOption.badge}
                  </span>
                )}
              </>
            ) : (
              <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">
                {placeholder}
              </span>
            )}
          </div>

          <span
            className={clsx(
              'material-symbols-outlined text-base text-slate-400 transition-transform duration-200 shrink-0',
              isOpen ? 'rotate-180 text-emerald-500' : 'rotate-0'
            )}
          >
            expand_more
          </span>
        </button>

        {/* Floating Glass Panel Menu */}
        {isOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="absolute top-full left-0 right-0 mt-1.5 p-1 rounded-xl bg-white/95 dark:bg-[#0E1726]/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-xl z-[99999] max-h-56 overflow-y-auto space-y-0.5 animate-in fade-in zoom-in-95 duration-150"
          >
            {safeOptions.length === 0 ? (
              <div className="px-2.5 py-2 text-center text-xs text-slate-400 italic">
                Không có lựa chọn nào
              </div>
            ) : (
              safeOptions.map((option) => {
                const isSelected = String(option.value) === String(currentValue);

                return (
                  <button
                    key={option.value}
                    type="button"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(option);
                    }}
                    className={clsx(
                      'w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-left text-xs font-bold transition-all duration-150 cursor-pointer',
                      isSelected
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-extrabold shadow-2xs'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {option.avatar ? (
                        <img
                          src={option.avatar}
                          alt={option.label}
                          className="w-4.5 h-4.5 rounded-full object-cover shrink-0 ring-1 ring-slate-300 dark:ring-slate-700"
                        />
                      ) : option.jerseyNumber !== undefined ? (
                        <span className="w-4.5 h-4.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-[9px] flex items-center justify-center shrink-0 border border-emerald-500/30">
                          #{option.jerseyNumber}
                        </span>
                      ) : option.icon ? (
                        <span className="material-symbols-outlined text-sm text-slate-400 shrink-0">
                          {option.icon}
                        </span>
                      ) : null}

                      <div className="flex flex-col min-w-0">
                        <span className="truncate">{option.label}</span>
                        {option.sublabel && (
                          <span className="text-[9px] font-normal text-slate-400 truncate">
                            {option.sublabel}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {option.badge && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                          {option.badge}
                        </span>
                      )}
                      {isSelected && (
                        <span className="material-symbols-outlined text-sm text-emerald-500 font-black animate-in fade-in duration-150">
                          check
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {error && <span className="text-xs text-rose-500 font-semibold mt-0.5">{error}</span>}
    </div>
  );
};

Select.displayName = 'Select';
