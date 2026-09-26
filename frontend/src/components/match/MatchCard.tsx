import React from 'react';
import { Link } from 'react-router-dom';
import { Match } from '../../types';
import { Card, Button } from '../../ui';
import { StatusBadge } from './StatusBadge';
import { formatDateVi, formatTimeVi } from '../../utils/formatters';
import { TEAM_A_COLOR, TEAM_A_NAME, TEAM_B_COLOR, TEAM_B_NAME } from '../../utils/constants';

export const MatchCard: React.FC<{ match: Match }> = ({ match }) => {
  const isFinished = match.status === 'COMPLETED';
  const isLive = match.status === 'IN_PROGRESS';
  const hasScore = isLive || isFinished;
  const participantCount = match.participants?.length || 0;

  return (
    <Card hoverable className="flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <StatusBadge status={match.status} />
          <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-slate-400">location_on</span>
            {match.location || 'Sân cố định'}
          </span>
        </div>

        <h3 className="font-heading font-black text-lg text-slate-900 mb-2 line-clamp-1 hover:text-red-600 transition-colors">
          {match.title || `Trận bóng ngày ${match.matchDate}`}
        </h3>

        <div className="flex items-center gap-3 text-xs text-slate-500 font-mono mb-4">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-red-500">calendar_today</span>
            {formatDateVi(match.matchDate)}
          </span>
          {match.matchTime && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-amber-500">schedule</span>
              {formatTimeVi(match.matchTime)}
            </span>
          )}
        </div>

        {/* Score or Team preview */}
        {hasScore ? (
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between px-6 mb-4 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full border border-red-400/40" style={{ backgroundColor: TEAM_A_COLOR }} />
              <span className="text-xs font-bold text-slate-900">{TEAM_A_NAME}</span>
            </div>
            <div className="font-heading font-black text-xl">
              <span className="text-red-600">{match.scoreTeamA}</span>
              <span className="text-slate-400 mx-2">-</span>
              <span className="text-blue-600">{match.scoreTeamB}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">{TEAM_B_NAME}</span>
              <span className="w-2.5 h-2.5 rounded-full border border-blue-400/40" style={{ backgroundColor: TEAM_B_COLOR }} />
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600 mb-4 shadow-xs">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-blue-500">groups</span>
              <span>Cầu thủ tham gia:</span>
            </span>
            <span className="font-mono font-bold text-slate-900">{participantCount} / 14+</span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-mono text-slate-400">
          {match.createdBy?.fullName ? `Tạo bởi: ${match.createdBy.fullName}` : 'Thể thức 7v7'}
        </span>
        <Link to={`/matches/${match.id}`}>
          <Button size="sm" variant={isLive ? 'secondary' : 'primary'} rightIcon="arrow_forward">
            {isLive ? 'Vào trận trực tiếp' : 'Xem chi tiết'}
          </Button>
        </Link>
      </div>
    </Card>
  );
};
