import React from 'react';
import { MatchParticipant } from '../../types';
import { Avatar, Badge } from '../../ui';
import { TEAM_A_COLOR, TEAM_B_COLOR } from '../../utils/constants';
import spainJerseyImg from '../../assets/ao_dau/taybannha.webp';
import franceJerseyImg from '../../assets/ao_dau/phap.webp';

interface PlayerPickCardProps {
  participant: MatchParticipant;
  canPick?: boolean;
  canPickA?: boolean;
  canPickB?: boolean;
  canPickBench?: boolean;
  onPickA?: () => void;
  onPickB?: () => void;
  onPickBench?: () => void;
  onReset?: () => void;
}

export const PlayerPickCard: React.FC<PlayerPickCardProps> = ({
  participant,
  canPick = false,
  canPickA = true,
  canPickB = true,
  canPickBench = true,
  onPickA,
  onPickB,
  onPickBench,
  onReset,
}) => {
  const { user, team, isHost, pickOrder } = participant;

  return (
    <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs transition-all group">
      <div className="flex items-center gap-3">
        <Avatar name={user.fullName} src={user.avatarUrl} jerseyNumber={user.jerseyNumber} size="md" showNumber />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-heading font-black text-sm text-slate-900 dark:text-white">{user.fullName}</span>
            {isHost && (
              <Badge variant="gold" size="sm">
                Đội trưởng
              </Badge>
            )}
            {pickOrder !== undefined && pickOrder !== null && pickOrder > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700">
                Lượt #{pickOrder}
              </span>
            )}
          </div>
          <div className="text-xs text-slate-500 font-mono">
            {user.jerseyNumber ? `Số áo #${user.jerseyNumber}` : 'Chưa có số áo'}
          </div>
        </div>
      </div>

      {/* Pick action buttons */}
      {canPick && (
        <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          {team === 'NONE' || !team ? (
            <>
              {canPickA && onPickA && (
                <button
                  onClick={onPickA}
                  title="Chọn vào Đội A (Tây Ban Nha)"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold text-white shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  style={{ backgroundColor: TEAM_A_COLOR }}
                >
                  <img src={spainJerseyImg} alt="Áo Tây Ban Nha" className="w-4 h-4 object-contain" />
                  <span>+ Đội A</span>
                </button>
              )}
              {canPickB && onPickB && (
                <button
                  onClick={onPickB}
                  title="Chọn vào Đội B (Pháp)"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold text-white shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  style={{ backgroundColor: TEAM_B_COLOR }}
                >
                  <img src={franceJerseyImg} alt="Áo Pháp" className="w-4 h-4 object-contain" />
                  <span>+ Đội B</span>
                </button>
              )}
              {canPickBench && onPickBench && (
                <button
                  onClick={onPickBench}
                  title="Xếp vào Dự bị"
                  className="px-2 py-1.5 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                >
                  Dự bị
                </button>
              )}
            </>
          ) : !isHost && onReset ? (
            <button
              onClick={onReset}
              title="Đặt lại vào danh sách chờ"
              className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">undo</span>
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
};
