import React from 'react';
import { MatchParticipant, Team } from '../../types';
import { TeamColumn } from './TeamColumn';
import { PlayerPickCard } from './PlayerPickCard';
import { Card } from '../../ui';

interface PickListProps {
  participants: MatchParticipant[];
  canPick: boolean;
  onPick: (userId: string, team: Team) => void;
  onReset: (userId: string) => void;
}

export const PickList: React.FC<PickListProps> = ({
  participants,
  canPick,
  onPick,
  onReset,
}) => {
  const teamAPlayers = participants.filter((p) => p.team === 'A');
  const teamBPlayers = participants.filter((p) => p.team === 'B');
  const benchPlayers = participants.filter((p) => p.team === 'BENCH');
  const availablePlayers = participants.filter((p) => p.team === 'NONE' || !p.team);

  return (
    <div className="flex flex-col gap-6">
      {/* 2 Team Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TeamColumn
          team="A"
          players={teamAPlayers}
          canPick={canPick}
          onResetPlayer={onReset}
        />
        <TeamColumn
          team="B"
          players={teamBPlayers}
          canPick={canPick}
          onResetPlayer={onReset}
        />
      </div>

      {/* Available Pool */}
      <Card elevation="level1">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-heading font-black text-lg text-slate-900">
              Danh sách chờ chọn ({availablePlayers.length})
            </h4>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Bấm chọn vào Đội A hoặc Đội B để bổ sung cầu thủ
            </p>
          </div>
          {canPick && (
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              Chế độ phân đội đang bật
            </span>
          )}
        </div>

        {availablePlayers.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-400 italic">
            Tất cả cầu thủ đã được phân vào các đội!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {availablePlayers.map((p) => (
              <PlayerPickCard
                key={p.id}
                participant={p}
                canPick={canPick}
                onPickA={() => onPick(p.user.id, 'A')}
                onPickB={() => onPick(p.user.id, 'B')}
                onPickBench={() => onPick(p.user.id, 'BENCH')}
              />
            ))}
          </div>
        )}
      </Card>

      {/* Bench / Reserves */}
      {benchPlayers.length > 0 && (
        <Card elevation="level1">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-heading font-black text-base text-slate-800">
              Cầu thủ dự bị (Bench) — {benchPlayers.length}
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {benchPlayers.map((p) => (
              <PlayerPickCard
                key={p.id}
                participant={p}
                canPick={canPick}
                onPickA={() => onPick(p.user.id, 'A')}
                onPickB={() => onPick(p.user.id, 'B')}
                onReset={() => onReset(p.user.id)}
              />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
