import React from 'react';
import clsx from 'clsx';

export interface TabItem {
  id: string | number;
  label: string;
  icon?: string;
  count?: number;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string | number;
  onChange: (id: string | number) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
}) => {
  // Kiểu 2: Neon Underline Glow Tabs
  return (
    <div
      className={clsx(
        'flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-0.5 scrollbar-none',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            disabled={tab.disabled}
            onClick={() => !tab.disabled && onChange(tab.id)}
            className={clsx(
              'tab-neon-btn flex items-center gap-2 whitespace-nowrap',
              isActive && 'active',
              tab.disabled && 'opacity-40 cursor-not-allowed hover:text-slate-500'
            )}
            title={tab.disabled ? 'Bước này đang bị khóa' : undefined}
          >
            {tab.disabled ? (
              <span className="material-symbols-outlined text-[15px] text-slate-500">
                lock
              </span>
            ) : tab.icon ? (
              <span className="material-symbols-outlined text-[15px]">
                {tab.icon}
              </span>
            ) : null}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={clsx(
                  'text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold',
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
