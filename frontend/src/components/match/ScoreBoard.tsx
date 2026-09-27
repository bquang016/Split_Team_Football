import React from 'react';
import { TEAM_A_COLOR, TEAM_A_NAME, TEAM_B_COLOR, TEAM_B_NAME } from '../../utils/constants';
import { Badge } from '../../ui';

interface ScoreBoardProps {
  scoreTeamA: number;
  scoreTeamB: number;
  hostAName?: string;
  hostBName?: string;
  isLive?: boolean;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  scoreTeamA,
  scoreTeamB,
  hostAName,
  hostBName,
  isLive,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bento-glass-card !p-5 sm:!p-7 shadow-xl">
      {/* Stadium Team Glow Highlights */}
      <div
        className="absolute -top-10 -left-10 w-40 h-40 opacity-20 blur-3xl rounded-full pointer-events-none"
        style={{ backgroundColor: TEAM_A_COLOR }}
      />
      <div
        className="absolute -top-10 -right-10 w-40 h-40 opacity-20 blur-3xl rounded-full pointer-events-none"
        style={{ backgroundColor: TEAM_B_COLOR }}
      />

      {isLive && (
        <div className="flex justify-center mb-4">
          <Badge variant="live" size="sm" dot>
            ĐANG THI ĐẤU TRỰC TIẾP (7v7)
          </Badge>
        </div>
      )}

      <div className="grid grid-cols-3 items-center text-center relative z-10">
        {/* Team A */}
        <div className="flex flex-col items-center gap-2.5">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md font-black text-lg font-space transition-transform hover:scale-105 border border-white/20"
            style={{ backgroundColor: TEAM_A_COLOR }}
          >
            A
          </div>
          <div>
            <h4 className="font-space font-black text-base sm:text-lg text-slate-900 dark:text-white">
              {TEAM_A_NAME}
            </h4>
            <Badge variant="teamA" size="sm" className="mt-1">
              Áo Đỏ
            </Badge>
            {hostAName && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-space">
                Cơ trưởng: <strong className="text-slate-900 dark:text-slate-100">{hostAName}</strong>
              </p>
            )}
          </div>
        </div>

        {/* Score Display (Cyber Scoreboard Impact) */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-3 sm:gap-5 font-space font-black text-5xl sm:text-6xl tracking-tight">
            <span className="text-rose-500 drop-shadow-[0_0_16px_rgba(244,63,94,0.4)]">
              {scoreTeamA}
            </span>
            <span className="text-slate-400 dark:text-slate-600 text-3xl sm:text-4xl font-light select-none">
              :
            </span>
            <span className="text-blue-500 drop-shadow-[0_0_16px_rgba(59,130,246,0.4)]">
              {scoreTeamB}
            </span>
          </div>
          <span className="text-[11px] font-space font-extrabold text-emerald-500 uppercase tracking-widest mt-2 bg-emerald-500/10 px-3 py-0.5 rounded-full border border-emerald-500/30">
            Tỉ số trận đấu
          </span>
        </div>

        {/* Team B */}
        <div className="flex flex-col items-center gap-2.5">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md font-black text-lg font-space transition-transform hover:scale-105 border border-white/20"
            style={{ backgroundColor: TEAM_B_COLOR }}
          >
            B
          </div>
          <div>
            <h4 className="font-space font-black text-base sm:text-lg text-slate-900 dark:text-white">
              {TEAM_B_NAME}
            </h4>
            <Badge variant="teamB" size="sm" className="mt-1">
              Áo Xanh
            </Badge>
            {hostBName && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-space">
                Cơ trưởng: <strong className="text-slate-900 dark:text-slate-100">{hostBName}</strong>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
