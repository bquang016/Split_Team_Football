import React from 'react';
import { Link } from 'react-router-dom';
import { Match } from '../../types';
import { Card, Button } from '../../ui';
import { StatusBadge } from './StatusBadge';
import { formatDateVi, formatTimeVi } from '../../utils/formatters';
import { TEAM_A_COLOR, TEAM_A_NAME, TEAM_B_COLOR, TEAM_B_NAME } from '../../utils/constants';

export const MatchCard: React.FC<{
  match: Match;
  onDelete?: (matchId: string) => void;
  onRestore?: (matchId: string) => void;
  isAdmin?: boolean;
}> = ({ match, onDelete, onRestore, isAdmin }) => {
  const isFinished = match.status === 'COMPLETED';
  const isLive = match.status === 'IN_PROGRESS';
  const isDeleted = match.isDeleted;
  const hasScore = isLive || isFinished;
  const participantCount = match.participants?.length || 0;

  return (
    <Card hoverable elevation="level1" className={`flex flex-col justify-between group !p-4 sm:!p-5 !rounded-2xl ${isDeleted ? 'opacity-75 border-dashed border-rose-400 dark:border-rose-800' : ''}`}>
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          {isDeleted ? (
            <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-[11px] font-space font-bold inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">delete</span>
              Đã xóa mềm
            </span>
          ) : (
            <StatusBadge status={match.status} />
          )}
          <span className="text-xs font-space text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">location_on</span>
            <span className="truncate max-w-[120px]">{match.location || 'Sân cố định'}</span>
          </span>
        </div>

        <h3 className="font-space font-bold text-base text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-emerald-500 transition-colors">
          {match.title || `Trận bóng ngày ${match.matchDate}`}
        </h3>

        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-space mb-3">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-rose-500">calendar_today</span>
            {formatDateVi(match.matchDate)}
          </span>
          {match.matchTime && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-amber-500">schedule</span>
              {formatTimeVi(match.matchTime)}
            </span>
          )}
        </div>

        {/* Score or Team preview */}
        {hasScore ? (
          <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 mb-3 shadow-inner">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full border border-rose-400/50 shadow-xs"
                style={{ backgroundColor: TEAM_A_COLOR }}
              />
              <span className="text-xs font-space font-bold text-slate-800 dark:text-slate-200">
                {TEAM_A_NAME}
              </span>
            </div>
            <div className="font-space font-black text-lg tracking-tight">
              <span className="text-rose-500">{match.scoreTeamA}</span>
              <span className="text-slate-400 dark:text-slate-600 mx-2">-</span>
              <span className="text-blue-500">{match.scoreTeamB}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-space font-bold text-slate-800 dark:text-slate-200">
                {TEAM_B_NAME}
              </span>
              <span
                className="w-3 h-3 rounded-full border border-blue-400/50 shadow-xs"
                style={{ backgroundColor: TEAM_B_COLOR }}
              />
            </div>
          </div>
        ) : (
          <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-3 shadow-inner">
            <span className="flex items-center gap-1.5 font-space">
              <span className="material-symbols-outlined text-base text-emerald-500">groups</span>
              <span>Cầu thủ đăng ký:</span>
            </span>
            <span className="font-space font-extrabold text-slate-900 dark:text-slate-100">
              {participantCount} / 14+
            </span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
        <span className="text-[11px] font-space text-slate-400 dark:text-slate-500 truncate max-w-[110px]">
          {match.createdBy?.fullName ? `Tạo bởi: ${match.createdBy.fullName}` : 'Sân 7v7'}
        </span>

        <div className="flex items-center gap-1.5">
          {isDeleted && onRestore && (
            <Button
              size="sm"
              variant="primary"
              leftIcon="restore_from_trash"
              onClick={() => onRestore(match.id)}
            >
              Khôi phục
            </Button>
          )}

          {!isDeleted && (
            <>
              {isAdmin && onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(match.id)}
                  title="Xóa mềm trận đấu"
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              )}
              <Link to={`/matches/${match.id}`}>
                <Button size="sm" variant={isLive ? 'primary' : 'secondary'} rightIcon="arrow_forward">
                  {isLive ? 'Vào phòng LIVE' : 'Xem chi tiết'}
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};
