import React from 'react';
import { MatchStatus } from '../../types';
import { MATCH_STATUS_MAP } from '../../utils/constants';

export const StatusBadge: React.FC<{ status: MatchStatus; className?: string }> = ({
  status,
  className,
}) => {
  const config = MATCH_STATUS_MAP[status] || MATCH_STATUS_MAP.PENDING;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold tracking-wide uppercase ${className || ''}`}
      style={{
        backgroundColor: config.bg,
        color: config.color,
        border: `1px solid ${config.color}40`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: config.color }}
      />
      <span>{config.label}</span>
    </span>
  );
};
