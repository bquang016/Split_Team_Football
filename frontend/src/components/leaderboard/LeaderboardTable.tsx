import React from 'react';
import { Link } from 'react-router-dom';
import { LeaderboardItem } from '../../types';
import { Avatar, Card } from '../../ui';
import { PlayerRank } from './PlayerRank';

interface LeaderboardTableProps {
  items: LeaderboardItem[];
  activeFilter: 'goals' | 'assists' | 'wins';
  onFilterChange: (filter: 'goals' | 'assists' | 'wins') => void;
  isLoading?: boolean;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  items,
  activeFilter,
  onFilterChange,
  isLoading,
}) => {
  return (
    <Card elevation="level1" className="flex flex-col gap-4 p-0 overflow-hidden">
      {/* Table controls */}
      <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-600 text-lg">
            format_list_numbered
          </span>
          <div>
            <h3 className="font-headline font-bold text-base text-slate-900">
              Bảng Xếp Hạng Toàn Câu Lạc Bộ
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Cập nhật tự động sau mỗi trận đấu chính thức
            </p>
          </div>
        </div>

        {/* Filter pills */}
        <div className="inline-flex p-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
          <button
            type="button"
            onClick={() => onFilterChange('goals')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              activeFilter === 'goals'
                ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bàn thắng (G)
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('assists')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              activeFilter === 'assists'
                ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kiến tạo (A)
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('wins')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              activeFilter === 'wins'
                ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Trận thắng (W)
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-2.5 px-3 w-12 text-center">#</th>
              <th className="py-2.5 px-3">Cầu thủ</th>
              <th className="py-2.5 px-3 text-center">Số áo</th>
              <th className="py-2.5 px-3 text-center">Số trận</th>
              <th className="py-2.5 px-3 text-center text-slate-900">Bàn thắng</th>
              <th className="py-2.5 px-3 text-center">Kiến tạo</th>
              <th className="py-2.5 px-3 text-center">Chiến thắng</th>
              <th className="py-2.5 px-3 text-right">Tỉ lệ thắng</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-sm text-slate-400">
                  Đang tải bảng xếp hạng...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-sm text-slate-400 italic">
                  Chưa có dữ liệu thống kê
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.user.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="py-3 px-3 text-center">
                    <PlayerRank rank={item.rank} />
                  </td>
                  <td className="py-3 px-3">
                    <Link
                      to={`/players/${item.user.id}`}
                      className="flex items-center gap-2.5 group-hover:text-emerald-700 transition-colors"
                    >
                      <Avatar
                        name={item.user.fullName}
                        jerseyNumber={item.user.jerseyNumber}
                        size="md"
                        showNumber
                      />
                      <div>
                        <span className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors block">
                          {item.user.fullName}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          @{item.user.username}
                        </span>
                      </div>
                    </Link>
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-xs text-slate-700">
                    {item.user.jerseyNumber ? `#${item.user.jerseyNumber}` : '—'}
                  </td>
                  <td className="py-3 px-3 text-center font-medium text-slate-600">
                    {item.totalMatches}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-slate-900 text-sm">
                    {item.totalGoals}
                  </td>
                  <td className="py-3 px-3 text-center font-medium text-slate-600">
                    {item.totalAssists}
                  </td>
                  <td className="py-3 px-3 text-center font-medium text-emerald-700">
                    {item.totalWins}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="inline-flex items-center gap-2 justify-end">
                      <span className="font-semibold text-xs text-emerald-700">
                        {item.winRate}%
                      </span>
                      <div className="w-14 h-1.5 rounded-full bg-slate-100 overflow-hidden hidden sm:block">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{ width: `${Math.min(item.winRate, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
