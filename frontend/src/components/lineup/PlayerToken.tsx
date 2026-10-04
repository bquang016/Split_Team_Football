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
  isCaptain?: boolean;
  showNames?: boolean;
  showNumbers?: boolean;
  showPositions?: boolean;
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
  isSelected = false,
  isCaptain = false,
  showNames = true,
  showNumbers = true,
  showPositions = true,
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
  const displayNumber = jerseyNumber ?? user.jerseyNumber;

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing flex flex-col items-center select-none group touch-none z-10 transition-[box-shadow,transform] duration-150"
      style={{ left: `${xPercent}%`, top: `${yPercent}%` }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
      onMouseDown={onDragStart}
      onTouchStart={onDragStart}
    >
      {/* Player Token Circle */}
      <div
        className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white shadow-xl transition-all group-hover:scale-105 active:scale-95 ${
          isSelected
            ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-900 scale-110 shadow-amber-500/40'
            : 'border-2 border-white/90 group-hover:border-white shadow-black/40'
        }`}
        style={{
          backgroundColor: jerseyColor,
          boxShadow: isSelected
            ? '0 0 24px rgba(245, 158, 11, 0.7)'
            : '0 8px 16px -2px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Main Number or Initials */}
        <span
          className="font-space font-black text-sm sm:text-base tracking-tighter"
          style={{
            color: '#FFFFFF',
            lineHeight: 1,
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.9)',
            display: 'block',
          }}
        >
          {showNumbers && displayNumber !== undefined && displayNumber !== null
            ? displayNumber
            : initials}
        </span>

        {/* Golden Captain Armband Badge */}
        {isCaptain && (
          <span
            className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[9px] flex items-center justify-center border border-white shadow-sm font-space"
            title="Đội trưởng"
          >
            C
          </span>
        )}

        {/* Position Tag */}
        {showPositions && positionLabel && (
          <span
            className={`absolute -top-1.5 -right-2 px-1.5 py-0.5 rounded-full text-[9px] font-space font-black border tracking-wider shadow-sm uppercase ${
              isGK
                ? 'bg-amber-500 text-slate-950 border-amber-300'
                : 'bg-slate-950/90 text-amber-300 border-white/30'
            }`}
          >
            {positionLabel}
          </span>
        )}
      </div>

      {/* Clean Minimalist Name Label */}
      {showNames && (
        <div className="mt-1 px-2 py-0.5 rounded-lg bg-slate-950/85 backdrop-blur-md border border-white/15 text-center shadow-lg pointer-events-none transition-all group-hover:border-amber-400/50">
          <p className="text-[10px] sm:text-[11px] font-space font-bold text-white whitespace-nowrap line-clamp-1 max-w-[90px] tracking-tight">
            {user.fullName}
          </p>
        </div>
      )}
    </div>
  );
};
