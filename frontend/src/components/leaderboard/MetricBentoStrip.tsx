import React from 'react';
import { LeaderboardItem } from '../../types';
import { Avatar, Card } from '../../ui';

interface MetricBentoStripProps {
  topScorer?: LeaderboardItem;
  topAssister?: LeaderboardItem;
  topWinner?: LeaderboardItem;
}

export const MetricBentoStrip: React.FC<MetricBentoStripProps> = ({
  topScorer,
  topAssister,
  topWinner,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Top Scorer Bento */}
      <Card elevation="level1" className="relative overflow-hidden group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase text-red-600 dark:text-red-400 tracking-wide flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">sports_soccer</span>
            Vua phá lưới
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
            #1 BÀN THẮNG
          </span>
        </div>
        {topScorer ? (
          <div className="flex items-center gap-3.5">
            <Avatar name={topScorer.user.fullName} jerseyNumber={topScorer.user.jerseyNumber} size="lg" showNumber bgColor="#DC2626" />
            <div>
              <h4 className="font-space font-bold text-base text-slate-950 dark:text-white line-clamp-1">
                {topScorer.user.fullName}
              </h4>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-space font-black text-2xl text-slate-950 dark:text-white">
                  {topScorer.totalGoals}
                </span>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">bàn thắng</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic py-2">Chưa có dữ liệu</p>
        )}
      </Card>

      {/* Top Assister Bento */}
      <Card elevation="level1" className="relative overflow-hidden group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400 tracking-wide flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">assistant_direction</span>
            Vua kiến tạo
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            #1 KIẾN TẠO
          </span>
        </div>
        {topAssister ? (
          <div className="flex items-center gap-3.5">
            <Avatar name={topAssister.user.fullName} jerseyNumber={topAssister.user.jerseyNumber} size="lg" showNumber bgColor="#2563EB" />
            <div>
              <h4 className="font-space font-bold text-base text-slate-950 dark:text-white line-clamp-1">
                {topAssister.user.fullName}
              </h4>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-space font-black text-2xl text-slate-950 dark:text-white">
                  {topAssister.totalAssists}
                </span>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">kiến tạo</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic py-2">Chưa có dữ liệu</p>
        )}
      </Card>

      {/* Top Winner Bento */}
      <Card elevation="level1" className="relative overflow-hidden group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase text-amber-700 dark:text-amber-400 tracking-wide flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">military_tech</span>
            Vua chiến thắng
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            #1 CHIẾN THẮNG
          </span>
        </div>
        {topWinner ? (
          <div className="flex items-center gap-3.5">
            <Avatar name={topWinner.user.fullName} jerseyNumber={topWinner.user.jerseyNumber} size="lg" showNumber bgColor="#D97706" />
            <div>
              <h4 className="font-space font-bold text-base text-slate-950 dark:text-white line-clamp-1">
                {topWinner.user.fullName}
              </h4>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-space font-black text-2xl text-slate-950 dark:text-white">
                  {topWinner.totalWins}
                </span>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">trận thắng ({topWinner.winRate}%)</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic py-2">Chưa có dữ liệu</p>
        )}
      </Card>
    </div>
  );
};
