import React from 'react';

export const PlayerRank: React.FC<{ rank: number }> = ({ rank }) => {
  if (rank === 1) {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold text-xs">
        1
      </span>
    );
  }
  if (rank === 2) {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs">
        2
      </span>
    );
  }
  if (rank === 3) {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-50 text-orange-800 border border-orange-200 font-bold text-xs">
        3
      </span>
    );
  }

  return (
    <span className="font-semibold text-slate-500 text-xs">
      {rank}
    </span>
  );
};
