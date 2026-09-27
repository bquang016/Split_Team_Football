import React from 'react';
import { MatchStatus } from '../../types';
import { MATCH_STATUS_MAP } from '../../utils/constants';
import clsx from 'clsx';

export const StatusBadge: React.FC<{ status: MatchStatus; className?: string }> = ({
  status,
  className,
}) => {
  const config = MATCH_STATUS_MAP[status] || MATCH_STATUS_MAP.PENDING;
  const isLive = status === 'IN_PROGRESS';

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-space font-bold tracking-wider uppercase shadow-2xs transition-all',
        className
      )}
      style={{
        backgroundColor: `${config.color}18`,
        color: config.color,
        border: `1px solid ${config.color}50`,
      }}
    >
      <span className="relative flex h-2 w-2">
        {isLive && (
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ backgroundColor: config.color }}
          />
        )}
        <span
          className="relative inline-flex rounded-full h-2 w-2"
          style={{ backgroundColor: config.color }}
        />
      </span>
      <span>{config.label}</span>
    </span>
  );
};
