import React from 'react';
import { MatchParticipant, Team } from '../../types';
import { PlayerPickCard } from './PlayerPickCard';
import { TEAM_A_COLOR, TEAM_A_NAME, TEAM_B_COLOR, TEAM_B_NAME } from '../../utils/constants';

import spainJerseyImg from '../../assets/ao_dau/taybannha.webp';
import franceJerseyImg from '../../assets/ao_dau/phap.webp';

interface TeamColumnProps {
  team: Team;
  players: MatchParticipant[];
  canPick: boolean;
  onResetPlayer: (userId: string) => void;
}

export const TeamColumn: React.FC<TeamColumnProps> = ({
  team,
  players,
  canPick,
  onResetPlayer,
}) => {
  const isTeamA = team === 'A';
  const teamName = isTeamA ? TEAM_A_NAME : TEAM_B_NAME;
  const teamColor = isTeamA ? TEAM_A_COLOR : TEAM_B_COLOR;
  const teamBg = isTeamA ? 'bg-red-50/60 border-red-200' : 'bg-blue-50/60 border-blue-200';
  const jerseyImg = isTeamA ? spainJerseyImg : franceJerseyImg;

  return (
    <div className={`flex flex-col rounded-3xl p-5 border shadow-xs ${teamBg}`}>
      {/* Team Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/80 mb-3.5">
        <div className="flex items-center gap-3">
          <img
            src={jerseyImg}
            alt={teamName}
            className="w-10 h-10 object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]"
          />
          <div>
            <h4 className="font-heading font-black text-base text-slate-900 dark:text-white">
              ĐỘI {team} — {teamName}
            </h4>
            <p className="text-xs font-mono text-slate-500 font-medium">
              Trang phục thi đấu: {teamName}
            </p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white shadow-xs">
          {players.length} Cầu thủ
        </span>
      </div>

      {/* Players List */}
      <div className="flex flex-col gap-2.5 min-h-[220px]">
        {players.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-xs text-slate-400 py-8 italic border-2 border-dashed border-slate-200 rounded-2xl bg-white/50">
            Chưa có cầu thủ nào được chọn
          </div>
        ) : (
          players.map((p) => (
            <PlayerPickCard
              key={p.id}
              participant={p}
              canPick={canPick}
              onReset={() => onResetPlayer(p.user.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};
