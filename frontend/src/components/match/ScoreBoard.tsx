import React from 'react';
import { TEAM_A_COLOR, TEAM_A_NAME, TEAM_B_COLOR, TEAM_B_NAME } from '../../utils/constants';

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
    <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
      {/* Subtle Team Color Highlights */}
      <div
        className="absolute top-0 left-0 w-1/3 h-full opacity-5 blur-3xl pointer-events-none"
        style={{ backgroundColor: TEAM_A_COLOR }}
      />
      <div
        className="absolute top-0 right-0 w-1/3 h-full opacity-5 blur-3xl pointer-events-none"
        style={{ backgroundColor: TEAM_B_COLOR }}
      />

      {isLive && (
        <div className="flex justify-center mb-5">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-bold animate-pulse shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            ĐANG THI ĐẤU TRỰC TIẾP (7v7)
          </span>
        </div>
      )}

      <div className="grid grid-cols-3 items-center text-center">
        {/* Team A */}
        <div className="flex flex-col items-center gap-2.5">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md font-black text-2xl font-heading transition-transform hover:scale-105"
            style={{ backgroundColor: TEAM_A_COLOR }}
          >
            A
          </div>
          <div>
            <h4 className="font-heading font-black text-base sm:text-xl text-slate-900">
              {TEAM_A_NAME}
            </h4>
            <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-red-50 text-red-700 font-mono text-xs font-bold border border-red-200">
              Áo Đỏ
            </span>
            {hostAName && (
              <p className="text-xs text-slate-500 mt-1.5 font-medium">
                Đội trưởng: <span className="text-slate-900 font-bold">{hostAName}</span>
              </p>
            )}
          </div>
        </div>

        {/* Score Display */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-3 sm:gap-6 font-heading font-black text-5xl sm:text-7xl">
            <span className="text-[#DC2626] drop-shadow-xs">{scoreTeamA}</span>
            <span className="text-slate-300 text-3xl sm:text-5xl font-light">-</span>
            <span className="text-[#2563EB] drop-shadow-xs">{scoreTeamB}</span>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mt-2">
            Tỉ số trận đấu
          </span>
        </div>

        {/* Team B */}
        <div className="flex flex-col items-center gap-2.5">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md font-black text-2xl font-heading transition-transform hover:scale-105"
            style={{ backgroundColor: TEAM_B_COLOR }}
          >
            B
          </div>
          <div>
            <h4 className="font-heading font-black text-base sm:text-xl text-slate-900">
              {TEAM_B_NAME}
            </h4>
            <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-mono text-xs font-bold border border-blue-200">
              Áo Xanh
            </span>
            {hostBName && (
              <p className="text-xs text-slate-500 mt-1.5 font-medium">
                Đội trưởng: <span className="text-slate-900 font-bold">{hostBName}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
