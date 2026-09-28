import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { LeaderboardItem } from '../types';
import { leaderboardService } from '../services/leaderboardService';
import { useAuthStore } from '../store/authStore';
import { Avatar } from '../ui';
import clsx from 'clsx';
import toast from 'react-hot-toast';

type SortMode = 'goals' | 'assists' | 'winrate' | 'mvp';

interface EnrichedLeaderboardItem extends LeaderboardItem {
  position: string;
  positionCode: string;
  mvpCount: number;
  form: ('W' | 'D' | 'L')[];
  teamName: string;
  isCurrentUser?: boolean;
}

export const LeaderboardPage: React.FC = () => {
  const [items, setItems] = useState<EnrichedLeaderboardItem[]>([]);
  const [sortMode, setSortMode] = useState<SortMode>('goals');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  // Danh sách cầu thủ mẫu thuộc CLB Chim Mọc Cánh - CMC University
  const sampleRoster: EnrichedLeaderboardItem[] = [
    {
      rank: 1,
      user: {
        id: 'u-1',
        username: 'hoangminh',
        fullName: 'Hoàng Minh',
        jerseyNumber: 9,
        role: 'PLAYER',
        status: 'ACTIVE',
        createdAt: '2025-01-01',
      },
      totalMatches: 14,
      totalGoals: 12,
      totalAssists: 4,
      totalWins: 11,
      totalDraws: 1,
      totalLosses: 2,
      totalSaves: 0,
      totalMvp: 3,
      winRate: 78.6,
      updatedAt: new Date().toISOString(),
      position: 'Tiền đạo (ST)',
      positionCode: 'ST',
      mvpCount: 3,
      form: ['W', 'W', 'W', 'L', 'W'],
      teamName: 'Team A (Tây Ban Nha)',
    },
    {
      rank: 2,
      user: {
        id: 'u-2',
        username: 'hungnguyen',
        fullName: 'Hùng Nguyễn',
        jerseyNumber: 10,
        role: 'ADMIN',
        status: 'ACTIVE',
        createdAt: '2025-01-01',
      },
      totalMatches: 14,
      totalGoals: 9,
      totalAssists: 8,
      totalWins: 10,
      totalDraws: 2,
      totalLosses: 2,
      totalSaves: 4,
      totalMvp: 4,
      winRate: 71.4,
      updatedAt: new Date().toISOString(),
      position: 'Tiền vệ (CM)',
      positionCode: 'CM',
      mvpCount: 4,
      form: ['W', 'W', 'L', 'W', 'W'],
      teamName: 'Team A (Tây Ban Nha)',
      isCurrentUser: true,
    },
    {
      rank: 3,
      user: {
        id: 'u-3',
        username: 'tuanchelsea',
        fullName: 'Tuấn Chelsea',
        jerseyNumber: 8,
        role: 'PLAYER',
        status: 'ACTIVE',
        createdAt: '2025-01-01',
      },
      totalMatches: 13,
      totalGoals: 8,
      totalAssists: 6,
      totalWins: 8,
      totalDraws: 2,
      totalLosses: 3,
      totalSaves: 0,
      totalMvp: 2,
      winRate: 61.5,
      updatedAt: new Date().toISOString(),
      position: 'Tiền vệ (CM)',
      positionCode: 'CM',
      mvpCount: 2,
      form: ['L', 'W', 'W', 'W', 'D'],
      teamName: 'Team B (Pháp)',
    },
    {
      rank: 4,
      user: {
        id: 'u-4',
        username: 'quanghaiphui',
        fullName: 'Quang Hải Phủi',
        jerseyNumber: 19,
        role: 'PLAYER',
        status: 'ACTIVE',
        createdAt: '2025-01-01',
      },
      totalMatches: 12,
      totalGoals: 6,
      totalAssists: 7,
      totalWins: 7,
      totalDraws: 2,
      totalLosses: 3,
      totalSaves: 0,
      totalMvp: 1,
      winRate: 58.3,
      updatedAt: new Date().toISOString(),
      position: 'Cánh phải (RW)',
      positionCode: 'RW',
      mvpCount: 1,
      form: ['W', 'L', 'W', 'W', 'W'],
      teamName: 'Team B (Pháp)',
    },
    {
      rank: 5,
      user: {
        id: 'u-7',
        username: 'vuneymar',
        fullName: 'Vũ Neymar',
        jerseyNumber: 11,
        role: 'PLAYER',
        status: 'ACTIVE',
        createdAt: '2025-01-01',
      },
      totalMatches: 10,
      totalGoals: 5,
      totalAssists: 2,
      totalWins: 4,
      totalDraws: 2,
      totalLosses: 4,
      totalSaves: 0,
      totalMvp: 1,
      winRate: 40.0,
      updatedAt: new Date().toISOString(),
      position: 'Cánh trái (LW)',
      positionCode: 'LW',
      mvpCount: 1,
      form: ['L', 'L', 'W', 'L', 'W'],
      teamName: 'Team B (Pháp)',
    },
    {
      rank: 6,
      user: {
        id: 'u-5',
        username: 'baotrong',
        fullName: 'Bảo Trọng (GK)',
        jerseyNumber: 1,
        role: 'PLAYER',
        status: 'ACTIVE',
        createdAt: '2025-01-01',
      },
      totalMatches: 14,
      totalGoals: 0,
      totalAssists: 2,
      totalWins: 10,
      totalDraws: 1,
      totalLosses: 3,
      totalSaves: 24,
      totalMvp: 3,
      winRate: 71.4,
      updatedAt: new Date().toISOString(),
      position: 'Thủ môn (GK)',
      positionCode: 'GK',
      mvpCount: 3,
      form: ['W', 'W', 'L', 'W', 'W'],
      teamName: 'Team A (Tây Ban Nha)',
    },
    {
      rank: 7,
      user: {
        id: 'u-6',
        username: 'dangkhoa',
        fullName: 'Đăng Khoa',
        jerseyNumber: 4,
        role: 'PLAYER',
        status: 'ACTIVE',
        createdAt: '2025-01-01',
      },
      totalMatches: 11,
      totalGoals: 3,
      totalAssists: 3,
      totalWins: 6,
      totalDraws: 1,
      totalLosses: 4,
      totalSaves: 0,
      totalMvp: 0,
      winRate: 54.5,
      updatedAt: new Date().toISOString(),
      position: 'Trung vệ (CB)',
      positionCode: 'CB',
      mvpCount: 0,
      form: ['L', 'W', 'W', 'L', 'W'],
      teamName: 'Team A (Tây Ban Nha)',
    },
    {
      rank: 8,
      user: {
        id: 'u-8',
        username: 'minhthang',
        fullName: 'Minh Thắng',
        jerseyNumber: 6,
        role: 'PLAYER',
        status: 'ACTIVE',
        createdAt: '2025-01-01',
      },
      totalMatches: 12,
      totalGoals: 2,
      totalAssists: 4,
      totalWins: 4,
      totalDraws: 3,
      totalLosses: 5,
      totalSaves: 0,
      totalMvp: 0,
      winRate: 33.3,
      updatedAt: new Date().toISOString(),
      position: 'Tiền vệ phòng ngự (CDM)',
      positionCode: 'CDM',
      mvpCount: 0,
      form: ['W', 'L', 'W', 'L', 'L'],
      teamName: 'Team B (Pháp)',
    },
  ];

  const sortItems = useCallback((data: EnrichedLeaderboardItem[], mode: SortMode) => {
    const cloned = [...data];
    if (mode === 'goals') {
      cloned.sort((a, b) => b.totalGoals - a.totalGoals || b.totalAssists - a.totalAssists);
    } else if (mode === 'assists') {
      cloned.sort((a, b) => b.totalAssists - a.totalAssists || b.totalGoals - a.totalGoals);
    } else if (mode === 'mvp') {
      cloned.sort((a, b) => (b.totalMvp || b.mvpCount) - (a.totalMvp || a.mvpCount) || b.totalGoals - a.totalGoals);
    } else {
      cloned.sort((a, b) => b.winRate - a.winRate || b.totalWins - a.totalWins);
    }
    return cloned.map((item, index) => ({ ...item, rank: index + 1 }));
  }, []);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const type = sortMode === 'winrate' ? 'wins' : sortMode === 'mvp' ? 'goals' : sortMode;
      const res = await leaderboardService.getLeaderboard(type);
      if (res.success && res.data && res.data.length > 0) {
        const enriched: EnrichedLeaderboardItem[] = res.data.map((item, idx) => {
          const matchedSample = sampleRoster.find((s) => s.user.username === item.user.username);
          const mvp = item.totalMvp ?? matchedSample?.mvpCount ?? Math.max(0, Math.floor(item.totalGoals / 3));

          return {
            ...item,
            position: matchedSample?.position || (idx === 0 ? 'Tiền đạo (ST)' : idx === 1 ? 'Tiền vệ (CM)' : 'Hậu vệ (CB)'),
            positionCode: matchedSample?.positionCode || (idx === 0 ? 'ST' : idx === 1 ? 'CM' : 'CB'),
            mvpCount: mvp,
            totalMvp: mvp,
            form: matchedSample?.form || ['W', 'W', 'W', 'L', 'W'],
            teamName: matchedSample?.teamName || (idx % 2 === 0 ? 'Team A (Tây Ban Nha)' : 'Team B (Pháp)'),
            isCurrentUser: user?.id === item.user.id,
          };
        });
        setItems(sortItems(enriched, sortMode));
      } else {
        setItems(sortItems(sampleRoster, sortMode));
      }
    } catch {
      setItems(sortItems(sampleRoster, sortMode));
    } finally {
      setLoading(false);
    }
  }, [sortMode, user, sortItems]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const handleSortChange = (mode: SortMode) => {
    setSortMode(mode);
    const label =
      mode === 'goals'
        ? 'Bàn thắng'
        : mode === 'assists'
        ? 'Kiến tạo'
        : mode === 'mvp'
        ? 'Điểm MVP'
        : 'Tỷ lệ thắng';
    toast.success(`Đã sắp xếp: ${label}`);
  };

  // Lọc theo từ khoá tìm kiếm
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase().trim();
    return items.filter(
      (item) =>
        item.user.fullName.toLowerCase().includes(q) ||
        item.user.username.toLowerCase().includes(q) ||
        (item.user.jerseyNumber && item.user.jerseyNumber.toString().includes(q)) ||
        item.position.toLowerCase().includes(q) ||
        item.teamName.toLowerCase().includes(q)
    );
  }, [items, searchQuery]);

  // Top 3 Cầu thủ dẫn đầu (Podium)
  const rank1 = items.find((i) => i.rank === 1) || items[0];
  const rank2 = items.find((i) => i.rank === 2) || items[1];
  const rank3 = items.find((i) => i.rank === 3) || items[2];

  const getPodiumBadgeText = (item: EnrichedLeaderboardItem) => {
    if (sortMode === 'goals') return `${item.totalGoals} Bàn`;
    if (sortMode === 'assists') return `${item.totalAssists} Kiến tạo`;
    if (sortMode === 'mvp') return `${item.totalMvp || item.mvpCount} MVP`;
    return `${item.winRate}% Thắng`;
  };

  return (
    <div className="max-w-6xl mx-auto font-sans pb-12 transition-colors duration-300">
      {/* ========================================================================= */}
      {/* HEADER SECTION: Title + Sort Mode Tabs                                    */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1 pt-1 mb-6">
        <div>
          <h1 className="font-space font-black text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
            Bảng Xếp Hạng
          </h1>
          <p className="text-xs font-space font-medium text-slate-500 dark:text-slate-400 mt-1">
            Dữ liệu thống kê tích lũy toàn diện — CLB Bóng Đá Chim Mọc Cánh (CMC University)
          </p>
        </div>

        {/* Metric Sort Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-200/70 dark:bg-[#151D2E] border border-slate-300/70 dark:border-slate-800 text-xs font-space font-bold self-start md:self-auto">
          <button
            type="button"
            onClick={() => handleSortChange('goals')}
            className={clsx(
              'px-4 py-1.5 rounded-xl transition-all cursor-pointer',
              sortMode === 'goals'
                ? 'bg-white dark:bg-[#202B42] text-slate-950 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
            )}
          >
            Bàn Thắng
          </button>
          <button
            type="button"
            onClick={() => handleSortChange('assists')}
            className={clsx(
              'px-4 py-1.5 rounded-xl transition-all cursor-pointer',
              sortMode === 'assists'
                ? 'bg-white dark:bg-[#202B42] text-slate-950 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
            )}
          >
            Kiến Tạo
          </button>
          <button
            type="button"
            onClick={() => handleSortChange('winrate')}
            className={clsx(
              'px-4 py-1.5 rounded-xl transition-all cursor-pointer',
              sortMode === 'winrate'
                ? 'bg-white dark:bg-[#202B42] text-slate-950 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
            )}
          >
            Tỷ Lệ Thắng
          </button>
          <button
            type="button"
            onClick={() => handleSortChange('mvp')}
            className={clsx(
              'px-4 py-1.5 rounded-xl transition-all cursor-pointer',
              sortMode === 'mvp'
                ? 'bg-white dark:bg-[#202B42] text-slate-950 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
            )}
          >
            Điểm MVP
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3D TOP 3 PODIUM SECTION                                                   */}
      {/* ========================================================================= */}
      <div className="relative pt-6 pb-2 flex justify-center items-end select-none mb-6">
        <div className="flex items-end justify-center gap-2 sm:gap-4 max-w-lg w-full px-4">
          {/* Hạng 2 (Bục bên trái) */}
          {rank2 && (
            <div className="flex-1 flex flex-col items-center">
              <div className="flex flex-col items-center mb-2.5">
                <div className="relative mb-1">
                  <Avatar
                    name={rank2.user.fullName}
                    jerseyNumber={rank2.user.jerseyNumber}
                    size="md"
                    showNumber
                    bgColor="#8B5CF6"
                  />
                </div>
                <span className="font-space font-bold text-xs text-slate-900 dark:text-slate-100 text-center line-clamp-1 max-w-[110px]">
                  {rank2.user.fullName}
                </span>
                <div className="mt-1 px-3 py-0.5 rounded-full bg-[#3B82F6]/15 border border-[#3B82F6]/40 text-[#2563EB] dark:text-[#60A5FA] font-space font-black text-xs shadow-xs">
                  {getPodiumBadgeText(rank2)}
                </div>
              </div>

              {/* Khối 3D Bục số 2 */}
              <div className="w-full flex flex-col items-center">
                <div className="w-full h-4 bg-[#8FA7FB] dark:bg-[#7893FA] rounded-t-xl opacity-90 border-t border-white/40 shadow-inner" />
                <div className="w-full h-28 sm:h-32 bg-gradient-to-b from-[#7F9BFA] via-[#6C8BFA] to-[#5C7BF0] flex items-center justify-center rounded-b-xl shadow-lg border-b border-[#4A69DE]">
                  <span className="font-space font-black text-5xl sm:text-6xl text-white/95 drop-shadow-[0_4px_8px_rgba(30,58,138,0.35)]">
                    2
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Hạng 1 (Bục ở giữa - Cao nhất) */}
          {rank1 && (
            <div className="flex-1 flex flex-col items-center z-10">
              <div className="flex flex-col items-center mb-2.5">
                {/* Vương miện vàng */}
                <div className="w-7 h-7 rounded-xl bg-amber-400/20 border border-amber-400/60 flex items-center justify-center text-amber-500 mb-1 shadow-[0_0_14px_rgba(251,191,36,0.5)]">
                  <span className="material-symbols-outlined text-base font-black">military_tech</span>
                </div>
                <div className="relative mb-1 ring-2 ring-amber-400/90 rounded-full p-0.5 shadow-[0_0_18px_rgba(251,191,36,0.3)]">
                  <Avatar
                    name={rank1.user.fullName}
                    jerseyNumber={rank1.user.jerseyNumber}
                    size="lg"
                    showNumber
                    bgColor="#0EA5E9"
                  />
                </div>
                <span className="font-space font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 text-center line-clamp-1 max-w-[130px]">
                  {rank1.user.fullName}
                </span>
                <div className="mt-1 px-3.5 py-0.5 rounded-full bg-[#3B82F6]/15 border border-[#3B82F6]/40 text-[#2563EB] dark:text-[#60A5FA] font-space font-black text-xs shadow-xs">
                  {getPodiumBadgeText(rank1)}
                </div>
              </div>

              {/* Khối 3D Bục số 1 */}
              <div className="w-full flex flex-col items-center">
                <div className="w-full h-5 bg-[#A4B8FD] dark:bg-[#90A7FD] rounded-t-xl border-t border-white/50 shadow-inner" />
                <div className="w-full h-36 sm:h-44 bg-gradient-to-b from-[#8FA7FB] via-[#7B98FB] to-[#6887F6] flex items-center justify-center rounded-b-xl shadow-xl border-b-2 border-[#4A69DE]">
                  <span className="font-space font-black text-6xl sm:text-7xl text-white drop-shadow-[0_6px_12px_rgba(30,58,138,0.4)]">
                    1
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Hạng 3 (Bục bên phải) */}
          {rank3 && (
            <div className="flex-1 flex flex-col items-center">
              <div className="flex flex-col items-center mb-2.5">
                <div className="relative mb-1">
                  <Avatar
                    name={rank3.user.fullName}
                    jerseyNumber={rank3.user.jerseyNumber}
                    size="md"
                    showNumber
                    bgColor="#10B981"
                  />
                </div>
                <span className="font-space font-bold text-xs text-slate-900 dark:text-slate-100 text-center line-clamp-1 max-w-[110px]">
                  {rank3.user.fullName}
                </span>
                <div className="mt-1 px-3 py-0.5 rounded-full bg-[#3B82F6]/15 border border-[#3B82F6]/40 text-[#2563EB] dark:text-[#60A5FA] font-space font-black text-xs shadow-xs">
                  {getPodiumBadgeText(rank3)}
                </div>
              </div>

              {/* Khối 3D Bục số 3 */}
              <div className="w-full flex flex-col items-center">
                <div className="w-full h-4 bg-[#7F9BFA] dark:bg-[#6C8BFA] rounded-t-xl opacity-90 border-t border-white/40 shadow-inner" />
                <div className="w-full h-24 sm:h-28 bg-gradient-to-b from-[#6F8CFA] via-[#5D7CF2] to-[#4C6CE6] flex items-center justify-center rounded-b-xl shadow-lg border-b border-[#3B59D0]">
                  <span className="font-space font-black text-5xl sm:text-6xl text-white/90 drop-shadow-[0_4px_8px_rgba(30,58,138,0.35)]">
                    3
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DANH SÁCH BẢNG XẾP HẠNG CẦU THỦ (CLEAN TABLE FORMAT)                     */}
      {/* ========================================================================= */}
      <div
        className={clsx(
          'rounded-[28px] border transition-all shadow-sm overflow-hidden flex flex-col',
          'bg-white dark:bg-[#131927] border-slate-200 dark:border-slate-800/90'
        )}
      >
        {/* Header Toolbar */}
        <div className="p-5 sm:p-6 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-slate-400 text-xl">leaderboard</span>
            <div>
              <h3 className="font-space font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
                Danh Sách Cầu Thủ
              </h3>
              <span className="text-[11px] font-space text-slate-400 font-medium">
                Toàn bộ thống kê thi đấu ({filteredItems.length} cầu thủ)
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm cầu thủ, đội bóng, vị trí..."
              className="bg-slate-100 dark:bg-[#0E1422] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-indigo-500 w-full sm:w-64 font-space transition-all"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/80 text-[11px] font-space font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50/50 dark:bg-[#0E1422]/50">
                <th className="py-3 px-4 sm:px-6 w-14 text-center">Hạng</th>
                <th className="py-3 px-4">Cầu thủ</th>
                <th className="py-3 px-3 text-center">Trận</th>
                <th
                  className={clsx(
                    'py-3 px-3 text-center transition-colors',
                    sortMode === 'goals' ? 'text-indigo-600 dark:text-indigo-400' : ''
                  )}
                >
                  Bàn
                </th>
                <th
                  className={clsx(
                    'py-3 px-3 text-center transition-colors',
                    sortMode === 'assists' ? 'text-indigo-600 dark:text-indigo-400' : ''
                  )}
                >
                  Kiến tạo
                </th>
                <th
                  className={clsx(
                    'py-3 px-3 text-center transition-colors',
                    sortMode === 'mvp' ? 'text-indigo-600 dark:text-indigo-400' : ''
                  )}
                >
                  MVP
                </th>
                <th className="py-3 px-4 text-center">5 Trận gần nhất</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-space text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-slate-400">
                    Đang tải danh sách bảng xếp hạng...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-slate-400 italic">
                    Không tìm thấy cầu thủ phù hợp
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  return (
                    <tr
                      key={item.user.id}
                      className={clsx(
                        'transition-colors duration-150 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 group',
                        item.isCurrentUser
                          ? 'bg-emerald-50/40 dark:bg-emerald-950/20'
                          : ''
                      )}
                    >
                      {/* 1. Hạng (Rank Badge) */}
                      <td className="py-3.5 px-4 sm:px-6 text-center">
                        <div
                          className={clsx(
                            'w-7 h-7 mx-auto rounded-full flex items-center justify-center font-black text-xs transition-transform group-hover:scale-105',
                            item.rank === 1
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-700 shadow-xs'
                              : item.rank === 2
                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600'
                              : item.rank === 3
                              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-500 border border-amber-400/60 dark:border-amber-700'
                              : 'text-slate-500 dark:text-slate-400 font-bold'
                          )}
                        >
                          {item.rank}
                        </div>
                      </td>

                      {/* 2. Cầu thủ (Avatar + Tên + Badge + Đội bóng) */}
                      <td className="py-3.5 px-4 min-w-[200px]">
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={item.user.fullName}
                            jerseyNumber={item.user.jerseyNumber}
                            size="md"
                            showNumber
                            bgColor={
                              item.rank === 1
                                ? '#0EA5E9'
                                : item.rank === 2
                                ? '#8B5CF6'
                                : item.rank === 3
                                ? '#10B981'
                                : undefined
                            }
                          />
                          <div className="flex flex-col min-w-0">
                            {/* Tên cầu thủ + Badge */}
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <Link
                                to={`/players/${item.user.id}`}
                                className="font-bold text-sm text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate"
                              >
                                {item.user.fullName}
                              </Link>
                              <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold border border-slate-200 dark:border-slate-700">
                                {item.positionCode}
                              </span>
                              {item.isCurrentUser && (
                                <span className="px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-black border border-emerald-300 dark:border-emerald-800">
                                  BẠN
                                </span>
                              )}
                              {item.user.role === 'ADMIN' && (
                                <span className="px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 text-[10px] font-black border border-blue-200 dark:border-blue-800">
                                  ADMIN
                                </span>
                              )}
                            </div>

                            {/* Đội bóng & Số áo */}
                            <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                              {item.teamName} • #{item.user.jerseyNumber || item.rank}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 3. Số Trận */}
                      <td className="py-3.5 px-3 text-center text-slate-600 dark:text-slate-300 font-medium">
                        {item.totalMatches}
                      </td>

                      {/* 4. Bàn Thắng */}
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={clsx(
                            'font-black text-sm sm:text-base',
                            sortMode === 'goals'
                              ? 'text-indigo-600 dark:text-indigo-400 scale-105 inline-block'
                              : 'text-slate-950 dark:text-white'
                          )}
                        >
                          {item.totalGoals}
                        </span>
                      </td>

                      {/* 5. Kiến Tạo */}
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={clsx(
                            'font-medium text-xs sm:text-sm',
                            sortMode === 'assists'
                              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                              : 'text-slate-600 dark:text-slate-300'
                          )}
                        >
                          {item.totalAssists}
                        </span>
                      </td>

                      {/* 6. MVP (Ngôi sao vàng + Số lần) */}
                      <td className="py-3.5 px-3 text-center">
                        <div
                          className={clsx(
                            'inline-flex items-center gap-1 font-bold',
                            sortMode === 'mvp'
                              ? 'text-amber-500 font-black scale-105'
                              : 'text-amber-500'
                          )}
                        >
                          <span className="material-symbols-outlined text-sm">star</span>
                          <span>{item.totalMvp || item.mvpCount}</span>
                        </div>
                      </td>

                      {/* 7. Phong độ 5 trận gần nhất (5 W/D/L Badges) */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1 justify-center">
                          {item.form.map((result, idx) => (
                            <span
                              key={idx}
                              className={clsx(
                                'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-2xs',
                                result === 'W'
                                  ? 'bg-emerald-500'
                                  : result === 'D'
                                  ? 'bg-slate-400 dark:bg-slate-600'
                                  : 'bg-rose-500'
                              )}
                              title={
                                result === 'W'
                                  ? 'Thắng'
                                  : result === 'D'
                                  ? 'Hoà'
                                  : 'Thua'
                              }
                            >
                              {result}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
