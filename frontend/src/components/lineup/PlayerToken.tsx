import React from 'react';
import { Position, Team, User } from '../../types';
import { GK_COLOR, TEAM_A_COLOR, TEAM_B_COLOR } from '../../utils/constants';
import { getInitials } from '../../utils/formatters';

interface PlayerTokenProps {
  user: User;
  team: Team;
  positionLabel?: Position;
  jerseyNumber?: number;
  xPercent: number;
  yPercent: number;
  isSelected?: boolean;
  onSelect?: () => void;
  onDragStart?: (e: React.MouseEvent | React.TouchEvent) => void;
}

export const PlayerToken: React.FC<PlayerTokenProps> = ({
  user,
  team,
  positionLabel,
  jerseyNumber,
  xPercent,
  yPercent,
  isSelected,
  onSelect,
  onDragStart,
}) => {
  const isGK = positionLabel === 'GK';
  const jerseyColor = isGK
    ? GK_COLOR
    : team === 'A'
    ? TEAM_A_COLOR
    : TEAM_B_COLOR;

  const initials = getInitials(user.fullName);
  const displayNumber = jerseyNumber ?? user.jerseyNumber ?? '';

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing flex flex-col items-center select-none group touch-none z-10"
      style={{ left: `${xPercent}%`, top: `${yPercent}%` }}
      onClick={onSelect}
      onMouseDown={onDragStart}
      onTouchStart={onDragStart}
    >
      {/* Player Token Circle */}
      <div
        className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 active:scale-95 ${
          isSelected
            ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-emerald-900 scale-110'
            : 'border-2 border-white/90'
        }`}
        style={{
          backgroundColor: jerseyColor,
          boxShadow: isSelected
            ? '0 0 20px rgba(245,158,11,0.8)'
            : '0 4px 10px rgba(0,0,0,0.3)',
        }}
      >
        <span className="font-heading font-black text-sm sm:text-base tracking-tight">
          {displayNumber || initials}
        </span>

        {/* Small position pill inside/adjacent */}
        {positionLabel && (
          <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 rounded-full bg-slate-900 border border-white/30 text-[9px] font-mono font-bold text-amber-300 shadow-xs">
            {positionLabel}
          </span>
        )}
      </div>

      {/* Name Label */}
      <div className="mt-1 px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-sm border border-slate-200 text-center shadow-md">
        <p className="text-[11px] sm:text-xs font-heading font-bold text-slate-900 whitespace-nowrap line-clamp-1 max-w-[85px]">
          {user.fullName}
        </p>
      </div>
    </div>
  );
};
