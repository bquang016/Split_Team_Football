import React from 'react';
import { MatchParticipant, Team } from '../../types';
import { Avatar } from '../../ui';

interface BenchReservesProps {
  benchPlayers: MatchParticipant[];
  team: Team;
}

export const BenchReserves: React.FC<BenchReservesProps> = ({
  benchPlayers,
}) => {
  if (benchPlayers.length === 0) return null;

  return (
    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 overflow-x-auto shadow-xs">
      <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-slate-500 whitespace-nowrap">
        <span className="material-symbols-outlined text-[18px]">event_seat</span>
        <span>Dự bị:</span>
      </div>
      <div className="flex items-center gap-2">
        {benchPlayers.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 shadow-xs"
          >
            <Avatar name={p.user.fullName} jerseyNumber={p.user.jerseyNumber} size="sm" showNumber />
            <span className="font-bold whitespace-nowrap">{p.user.fullName}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
