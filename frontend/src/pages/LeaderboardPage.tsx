import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { LeaderboardItem, RatingLeaderboardItem } from '../types';
import { leaderboardService } from '../services/leaderboardService';
import { useAuthStore } from '../store/authStore';
import { Avatar } from '../ui';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import {
  BallIcon,
  AssistIcon,
  SaveIcon,
  StarIcon,
  CrownIcon,
  TrophyIcon,
  MedalIcon,
  CalendarIcon,
  CalendarRangeIcon,
  ChartIcon,
} from '../components/common/AppIcons';

type SortMode = 'goals' | 'assists' | 'winrate' | 'mvp';
type MainTab = 'rating' | 'cumulative';
type RatingPeriod = 'week' | 'month' | 'all';

interface EnrichedLeaderboardItem extends LeaderboardItem {
  position: string;
  positionCode: string;
  mvpCount: number;
  form: ('W' | 'D' | 'L')[];
  teamName: string;
  isCurrentUser?: boolean;
}

export const LeaderboardPage: React.FC = () => {
  const [mainTab, setMainTab] = useState<MainTab>('rating');
  const [ratingPeriod, setRatingPeriod] = useState<RatingPeriod>('week');
  const [ratingItems, setRatingItems] = useState<RatingLeaderboardItem[]>([]);
  const [loadingRating, setLoadingRating] = useState(true);

  const [items, setItems] = useState<EnrichedLeaderboardItem[]>([]);
  const [sortMode, setSortMode] = useState<SortMode>('goals');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  // Dữ liệu mẫu BXH đánh giá điểm (Rating) theo Tuần
  const sampleRatingWeek: RatingLeaderboardItem[] = [
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
      totalRating: 27.6,
      averageRating: 9.2,
      ratedMatches: 3,
      totalMatches: 3,
      totalGoals: 5,
      totalAssists: 2,
      totalSaves: 0,
      totalMvp: 2,
      isBestPlayer: true,
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
      totalRating: 25.5,
      averageRating: 8.5,
      ratedMatches: 3,
      totalMatches: 3,
      totalGoals: 2,
      totalAssists: 3,
      totalSaves: 0,
      totalMvp: 1,
      isBestPlayer: false,
    },
    {
      rank: 3,
      user: {
        id: 'u-5',
        username: 'baotrong',
        fullName: 'Bảo Trọng (GK)',
        jerseyNumber: 1,
        role: 'PLAYER',
        status: 'ACTIVE',
        createdAt: '2025-01-01',
      },
      totalRating: 24.9,
      averageRating: 8.3,
      ratedMatches: 3,
      totalMatches: 3,
      totalGoals: 0,
      totalAssists: 1,
      totalSaves: 9,
      totalMvp: 0,
      isBestPlayer: false,
    },
    {
      rank: 4,
      user: {
        id: 'u-3',
        username: 'tuanchelsea',
        fullName: 'Tuấn Chelsea',
        jerseyNumber: 8,
        role: 'PLAYER',
        status: 'ACTIVE',
        createdAt: '2025-01-01',
      },
      totalRating: 23.4,
      averageRating: 7.8,
      ratedMatches: 3,
      totalMatches: 3,
      totalGoals: 2,
      totalAssists: 1,
      totalSaves: 0,
      totalMvp: 0,
      isBestPlayer: false,
    },
    {
      rank: 5,
      user: {
        id: 'u-4',
        username: 'quanghaiphui',
        fullName: 'Quang Hải Phủi',
        jerseyNumber: 19,
        role: 'PLAYER',
        status: 'ACTIVE',
        createdAt: '2025-01-01',
      },
      totalRating: 21.6,
      averageRating: 7.2,
      ratedMatches: 3,
      totalMatches: 3,
      totalGoals: 1,
      totalAssists: 2,
      totalSaves: 0,
      totalMvp: 0,
      isBestPlayer: false,
    },
  ];

  // Dữ liệu mẫu BXH đánh giá điểm (Rating) theo Tháng
  const sampleRatingMonth: RatingLeaderboardItem[] = [
    {
      rank: 1,
      user: {
        id: 'u-2',
        username: 'hungnguyen',
        fullName: 'Hùng Nguyễn',
        jerseyNumber: 10,
        role: 'ADMIN',
        status: 'ACTIVE',
        createdAt: '2025-01-01',
      },
      totalRating: 88.4,
      averageRating: 8.8,
      ratedMatches: 10,
      totalMatches: 10,
      totalGoals: 7,
      totalAssists: 9,
      totalSaves: 0,
      totalMvp: 4,
      isBestPlayer: true,
    },
    {
      rank: 2,
      user: {
        id: 'u-1',
        username: 'hoangminh',
        fullName: 'Hoàng Minh',
        jerseyNumber: 9,
        role: 'PLAYER',
        status: 'ACTIVE',
        createdAt: '2025-01-01',
      },
      totalRating: 85.0,
      averageRating: 8.5,
      ratedMatches: 10,
      totalMatches: 10,
      totalGoals: 11,
      totalAssists: 3,
      totalSaves: 0,
      totalMvp: 3,
      isBestPlayer: false,
    },
    {
      rank: 3,
      user: {
        id: 'u-5',
        username: 'baotrong',
        fullName: 'Bảo Trọng (GK)',
        jerseyNumber: 1,
        role: 'PLAYER',
        status: 'ACTIVE',
        createdAt: '2025-01-01',
      },
      totalRating: 81.2,
      averageRating: 8.1,
      ratedMatches: 10,
      totalMatches: 10,
      totalGoals: 0,
      totalAssists: 2,
      totalSaves: 21,
      totalMvp: 2,
      isBestPlayer: false,
    },
    {
      rank: 4,
      user: {
        id: 'u-3',
        username: 'tuanchelsea',
        fullName: 'Tuấn Chelsea',
        jerseyNumber: 8,
        role: 'PLAYER',
        status: 'ACTIVE',
        createdAt: '2025-01-01',
      },
      totalRating: 77.5,
      averageRating: 7.8,
      ratedMatches: 10,
      totalMatches: 10,
      totalGoals: 6,
      totalAssists: 4,
      totalSaves: 0,
      totalMvp: 1,
      isBestPlayer: false,
    },
    {
      rank: 5,
      user: {
        id: 'u-4',
        username: 'quanghaiphui',
        fullName: 'Quang Hải Phủi',
        jerseyNumber: 19,
        role: 'PLAYER',
        status: 'ACTIVE',
        createdAt: '2025-01-01',
      },
      totalRating: 73.0,
      averageRating: 7.3,
      ratedMatches: 10,
      totalMatches: 10,
      totalGoals: 4,
      totalAssists: 5,
      totalSaves: 0,
      totalMvp: 0,
      isBestPlayer: false,
    },
  ];

  // Dữ liệu mẫu BXH đánh giá điểm (Rating) Toàn thời gian
  const sampleRatingAll: RatingLeaderboardItem[] = [
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
      totalRating: 119.6,
      averageRating: 8.5,
      ratedMatches: 14,
      totalMatches: 14,
      totalGoals: 12,
      totalAssists: 4,
      totalSaves: 0,
      totalMvp: 3,
      isBestPlayer: true,
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
      totalRating: 118.2,
      averageRating: 8.4,
      ratedMatches: 14,
      totalMatches: 14,
      totalGoals: 9,
      totalAssists: 8,
      totalSaves: 4,
      totalMvp: 4,
      isBestPlayer: false,
    },
    {
      rank: 3,
      user: {
        id: 'u-5',
        username: 'baotrong',
        fullName: 'Bảo Trọng (GK)',
        jerseyNumber: 1,
        role: 'PLAYER',
        status: 'ACTIVE',
        createdAt: '2025-01-01',
      },
      totalRating: 114.8,
      averageRating: 8.2,
      ratedMatches: 14,
      totalMatches: 14,
      totalGoals: 0,
      totalAssists: 2,
      totalSaves: 24,
      totalMvp: 3,
      isBestPlayer: false,
    },
    {
      rank: 4,
      user: {
        id: 'u-3',
        username: 'tuanchelsea',
        fullName: 'Tuấn Chelsea',
        jerseyNumber: 8,
        role: 'PLAYER',
        status: 'ACTIVE',
        createdAt: '2025-01-01',
      },
      totalRating: 101.4,
      averageRating: 7.8,
      ratedMatches: 13,
      totalMatches: 13,
      totalGoals: 8,
      totalAssists: 6,
      totalSaves: 0,
      totalMvp: 2,
      isBestPlayer: false,
    },
    {
      rank: 5,
      user: {
        id: 'u-4',
        username: 'quanghaiphui',
        fullName: 'Quang Hải Phủi',
        jerseyNumber: 19,
        role: 'PLAYER',
        status: 'ACTIVE',
        createdAt: '2025-01-01',
      },
      totalRating: 92.4,
      averageRating: 7.7,
      ratedMatches: 12,
      totalMatches: 12,
      totalGoals: 6,
      totalAssists: 7,
      totalSaves: 0,
      totalMvp: 1,
      isBestPlayer: false,
    },
  ];

  // Danh sách cầu thủ mẫu thuộc CLB Chim Mọc Cánh - CMC University (Thống kê chung)
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

  // 1. Fetch BXH Đánh Giá Điểm (Rating)
  const fetchRatingLeaderboard = useCallback(async () => {
    setLoadingRating(true);
    try {
      const res = await leaderboardService.getRatingLeaderboard(ratingPeriod);
      if (res.success && res.data && res.data.length > 0) {
        setRatingItems(res.data);
      } else {
        const fallback =
          ratingPeriod === 'week'
            ? sampleRatingWeek
            : ratingPeriod === 'month'
            ? sampleRatingMonth
            : sampleRatingAll;
        setRatingItems(fallback);
      }
    } catch {
      const fallback =
        ratingPeriod === 'week'
          ? sampleRatingWeek
          : ratingPeriod === 'month'
          ? sampleRatingMonth
          : sampleRatingAll;
      setRatingItems(fallback);
    } finally {
      setLoadingRating(false);
    }
  }, [ratingPeriod]);

  // 2. Fetch BXH Thống Kê Chung
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

  const fetchCumulativeLeaderboard = useCallback(async () => {
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
    if (mainTab === 'rating') {
      fetchRatingLeaderboard();
    } else {
      fetchCumulativeLeaderboard();
    }
  }, [mainTab, fetchRatingLeaderboard, fetchCumulativeLeaderboard]);

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

  const handlePeriodChange = (period: RatingPeriod) => {
    setRatingPeriod(period);
    const label = period === 'week' ? 'Tuần này' : period === 'month' ? 'Tháng này' : 'Toàn thời gian';
    toast.success(`Đã chọn mốc: ${label}`);
  };

  // Lọc BXH Đánh Giá Điểm theo từ khoá tìm kiếm
  const filteredRatingItems = useMemo(() => {
    if (!searchQuery.trim()) return ratingItems;
    const q = searchQuery.toLowerCase().trim();
    return ratingItems.filter(
      (item) =>
        item.user.fullName?.toLowerCase().includes(q) ||
        item.user.username?.toLowerCase().includes(q) ||
        (item.user.jerseyNumber && item.user.jerseyNumber.toString().includes(q))
    );
  }, [ratingItems, searchQuery]);

  // Cầu thủ xuất sắc nhất trong bảng đánh giá (Rank 1 với điểm số > 0)
  const bestPlayer = useMemo(() => {
    if (filteredRatingItems.length === 0) return null;
    const top = filteredRatingItems.find((i) => i.rank === 1) || filteredRatingItems[0];
    return top && top.totalRating > 0 ? top : null;
  }, [filteredRatingItems]);

  // Top 3 Rating Podium
  const ratingRank1 = filteredRatingItems.find((i) => i.rank === 1) || filteredRatingItems[0];
  const ratingRank2 = filteredRatingItems.find((i) => i.rank === 2) || filteredRatingItems[1];
  const ratingRank3 = filteredRatingItems.find((i) => i.rank === 3) || filteredRatingItems[2];

  // Lọc BXH Thống Kê Chung theo từ khoá tìm kiếm
  const filteredCumulativeItems = useMemo(() => {
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

  // Top 3 Thống Kê Chung Podium
  const cumRank1 = items.find((i) => i.rank === 1) || items[0];
  const cumRank2 = items.find((i) => i.rank === 2) || items[1];
  const cumRank3 = items.find((i) => i.rank === 3) || items[2];

  const getCumulativeBadgeText = (item: EnrichedLeaderboardItem) => {
    if (sortMode === 'goals') return `${item.totalGoals} Bàn`;
    if (sortMode === 'assists') return `${item.totalAssists} Kiến tạo`;
    if (sortMode === 'mvp') return `${item.totalMvp || item.mvpCount} MVP`;
    return `${item.winRate}% Thắng`;
  };

  return (
    <div className="max-w-6xl mx-auto font-sans pb-12 transition-colors duration-300">
      {/* ========================================================================= */}
      {/* 1. HEADER SECTION & MAIN TAB SWITCHER                                      */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1 pt-1 mb-6">
        <div>
          <h1 className="font-space font-black text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
            Bảng Xếp Hạng
          </h1>
          <p className="text-xs font-space font-medium text-slate-500 dark:text-slate-400 mt-1">
            CLB Bóng Đá Chim Mọc Cánh — Đánh giá phong độ và vinh danh cầu thủ xuất sắc nhất
          </p>
        </div>

        {/* Chuyển đổi tab chính: BXH Điểm Đánh Giá vs Thống Kê Chung */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-200/80 dark:bg-[#151D2E] border border-slate-300/70 dark:border-slate-800 text-xs font-space font-bold self-start md:self-auto shadow-xs">
          <button
            type="button"
            onClick={() => setMainTab('rating')}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer',
              mainTab === 'rating'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
            )}
          >
            <StarIcon size={16} fill={mainTab === 'rating'} />
            <span>Phong Độ & Đánh Giá</span>
          </button>
          <button
            type="button"
            onClick={() => setMainTab('cumulative')}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer',
              mainTab === 'cumulative'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
            )}
          >
            <ChartIcon size={16} />
            <span>Thống Kê Tích Lũy</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TAB A: BXH ĐIỂM ĐÁNH GIÁ (RATING LEADERBOARD)                           */}
      {/* ========================================================================= */}
      {mainTab === 'rating' && (
        <div className="animate-in fade-in duration-200">
          {/* Sub-toolbar: Period Toggle + Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            {/* Bộ lọc mốc thời gian (Tuần / Tháng / Toàn thời gian) */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-200/70 dark:bg-[#151D2E] border border-slate-300/70 dark:border-slate-800 text-xs font-space font-bold w-fit">
              <button
                type="button"
                onClick={() => handlePeriodChange('week')}
                className={clsx(
                  'px-4 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5',
                  ratingPeriod === 'week'
                    ? 'bg-white dark:bg-[#202B42] text-amber-600 dark:text-amber-400 shadow-xs border border-amber-300/60 dark:border-amber-500/40 font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                )}
              >
                <CalendarIcon size={14} className="text-amber-500" />
                <span>Tuần Này</span>
              </button>
              <button
                type="button"
                onClick={() => handlePeriodChange('month')}
                className={clsx(
                  'px-4 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5',
                  ratingPeriod === 'month'
                    ? 'bg-white dark:bg-[#202B42] text-indigo-600 dark:text-indigo-400 shadow-xs border border-indigo-300/60 dark:border-indigo-500/40 font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                )}
              >
                <CalendarRangeIcon size={14} className="text-indigo-500" />
                <span>Tháng Này</span>
              </button>
              <button
                type="button"
                onClick={() => handlePeriodChange('all')}
                className={clsx(
                  'px-4 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5',
                  ratingPeriod === 'all'
                    ? 'bg-white dark:bg-[#202B42] text-emerald-600 dark:text-emerald-400 shadow-xs border border-emerald-300/60 dark:border-emerald-500/40 font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                )}
              >
                <TrophyIcon size={14} className="text-emerald-500" />
                <span>Tất Cả</span>
              </button>
            </div>

            <span className="text-xs text-slate-500 dark:text-slate-400 font-space font-medium">
              Xếp hạng theo <strong>Tổng điểm đánh giá sau trận</strong> (Thang điểm 10)
            </span>
          </div>

          {/* Informative notice if no players are rated yet */}
          {!bestPlayer && !loadingRating && filteredRatingItems.length > 0 && (
            <div className="rounded-2xl p-5 mb-8 bg-slate-100/80 dark:bg-[#151D2E] border border-dashed border-slate-300 dark:border-slate-800 flex items-center gap-4 text-slate-600 dark:text-slate-400">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">military_tech</span>
              </div>
              <div className="text-xs sm:text-sm">
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  Chưa có điểm đánh giá nào được ghi nhận cho mốc thời gian này
                </p>
                <p className="mt-0.5 text-slate-500 dark:text-slate-400">
                  Danh hiệu <strong>Cầu thủ xuất sắc nhất</strong> sẽ được tự động vinh danh ngay khi Quản trị viên nhập điểm đánh giá (thang điểm 10) trong bảng Thống Kê Sau Trận!
                </p>
              </div>
            </div>
          )}

          {/* SPOTLIGHT HERO BANNER: CẦU THỦ THI ĐẤU HAY NHẤT TUẦN / THÁNG */}
          {bestPlayer && (
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/15 via-indigo-500/10 to-purple-500/15 dark:from-amber-500/20 dark:via-indigo-900/30 dark:to-purple-950/30 border border-amber-300/50 dark:border-amber-500/30 p-6 sm:p-8 mb-8 shadow-xl backdrop-blur-md">
              <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Left: Avatar + Title + Bio */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                  <div className="relative shrink-0">
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-amber-300 text-slate-950 shadow-lg ring-2 ring-white dark:ring-slate-900 animate-bounce">
                      <CrownIcon size={18} className="text-slate-950" />
                    </div>
                    <div className="ring-4 ring-amber-400/80 rounded-full p-1 shadow-[0_0_24px_rgba(251,191,36,0.4)]">
                      <Avatar
                        name={bestPlayer.user?.fullName}
                        src={bestPlayer.user?.avatarUrl}
                        jerseyNumber={bestPlayer.user?.jerseyNumber}
                        size="xl"
                        showNumber
                        bgColor="#F59E0B"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-600 dark:text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
                      <CrownIcon size={14} className="text-amber-600 dark:text-amber-400" />
                      <span>
                        Cầu Thủ Xuất Sắc Nhất{' '}
                        {ratingPeriod === 'week' ? 'Tuần Này' : ratingPeriod === 'month' ? 'Tháng Này' : 'Mọi Thời Đại'}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black font-space text-slate-900 dark:text-white tracking-tight">
                      {bestPlayer.user?.fullName}
                    </h2>
                    <p className="text-xs sm:text-sm font-space text-slate-500 dark:text-slate-400 mt-1">
                      Số áo #{bestPlayer.user?.jerseyNumber || '—'} • @{bestPlayer.user?.username || 'player'}
                    </p>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300">
                        <BallIcon size={13} className="text-rose-500" />
                        <span>{bestPlayer.totalGoals} bàn</span>
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300">
                        <AssistIcon size={13} className="text-blue-500" />
                        <span>{bestPlayer.totalAssists} kiến tạo</span>
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300">
                        <CrownIcon size={13} className="text-amber-500" />
                        <span>{bestPlayer.totalMvp} MVP</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Big Scores Cards */}
                <div className="flex items-center gap-3 sm:gap-4 shrink-0 bg-white/95 dark:bg-[#151D2E]/95 p-4 sm:p-5 rounded-2xl border border-amber-300/40 dark:border-slate-700 shadow-md">
                  <div className="text-center px-2">
                    <span className="text-[11px] font-space font-bold uppercase text-slate-400 block mb-0.5">
                      Tổng Điểm
                    </span>
                    <span className="text-3xl sm:text-4xl font-black font-space text-amber-500 dark:text-amber-400 tabular-nums">
                      {bestPlayer.totalRating.toFixed(1)}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">điểm</span>
                  </div>
                  <div className="w-[1px] h-12 bg-slate-200 dark:bg-slate-700" />
                  <div className="text-center px-2">
                    <span className="text-[11px] font-space font-bold uppercase text-slate-400 block mb-0.5">
                      Điểm Trung Bình
                    </span>
                    <span className="text-2xl sm:text-3xl font-black font-space text-indigo-600 dark:text-indigo-400 tabular-nums">
                      {bestPlayer.averageRating.toFixed(1)}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">/ 10</span>
                  </div>
                  <div className="w-[1px] h-12 bg-slate-200 dark:bg-slate-700" />
                  <div className="text-center px-2">
                    <span className="text-[11px] font-space font-bold uppercase text-slate-400 block mb-0.5">
                      Trận Chấm
                    </span>
                    <span className="text-2xl sm:text-3xl font-black font-space text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {bestPlayer.ratedMatches}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">/{bestPlayer.totalMatches} trận</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3D PODIUM FOR RATING */}
          <div className="relative pt-6 pb-2 flex justify-center items-end select-none mb-6">
            <div className="flex items-end justify-center gap-2 sm:gap-4 max-w-lg w-full px-4">
              {/* Hạng 2 */}
              {ratingRank2 && (
                <div className="flex-1 flex flex-col items-center">
                  <div className="flex flex-col items-center mb-2.5">
                    <div className="relative mb-1">
                      <Avatar
                        name={ratingRank2.user.fullName}
                        src={ratingRank2.user.avatarUrl}
                        jerseyNumber={ratingRank2.user.jerseyNumber}
                        size="md"
                        showNumber
                        bgColor="#8B5CF6"
                      />
                    </div>
                    <span className="font-space font-bold text-xs text-slate-900 dark:text-slate-100 text-center line-clamp-1 max-w-[110px]">
                      {ratingRank2.user.fullName}
                    </span>
                    <div className="mt-1 px-3 py-0.5 rounded-full bg-[#3B82F6]/15 border border-[#3B82F6]/40 text-[#2563EB] dark:text-[#60A5FA] font-space font-black text-xs shadow-xs flex items-center gap-1">
                      <StarIcon size={12} className="text-amber-500 fill-amber-500" fill />
                      <span>{ratingRank2.totalRating.toFixed(1)}đ</span>
                    </div>
                    <span className="text-[10px] font-space text-slate-400 mt-0.5">
                      TB: {ratingRank2.averageRating.toFixed(1)}/10
                    </span>
                  </div>

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

              {/* Hạng 1 */}
              {ratingRank1 && (
                <div className="flex-1 flex flex-col items-center z-10">
                  <div className="flex flex-col items-center mb-2.5">
                    <div className="w-7 h-7 rounded-xl bg-amber-400/20 border border-amber-400/60 flex items-center justify-center text-amber-500 mb-1 shadow-[0_0_14px_rgba(251,191,36,0.5)]">
                      <span className="material-symbols-outlined text-base font-black">military_tech</span>
                    </div>
                    <div className="relative mb-1 ring-2 ring-amber-400/90 rounded-full p-0.5 shadow-[0_0_18px_rgba(251,191,36,0.3)]">
                      <Avatar
                        name={ratingRank1.user.fullName}
                        src={ratingRank1.user.avatarUrl}
                        jerseyNumber={ratingRank1.user.jerseyNumber}
                        size="lg"
                        showNumber
                        bgColor="#F59E0B"
                      />
                    </div>
                    <span className="font-space font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 text-center line-clamp-1 max-w-[130px]">
                      {ratingRank1.user.fullName}
                    </span>
                    <div className="mt-1 px-3.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-600 dark:text-amber-400 font-space font-black text-xs shadow-xs flex items-center gap-1">
                      <StarIcon size={12} className="text-amber-500 fill-amber-500" fill />
                      <span>{ratingRank1.totalRating.toFixed(1)}đ</span>
                    </div>
                    <span className="text-[10px] font-space text-slate-400 mt-0.5">
                      TB: {ratingRank1.averageRating.toFixed(1)}/10
                    </span>
                  </div>

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

              {/* Hạng 3 */}
              {ratingRank3 && (
                <div className="flex-1 flex flex-col items-center">
                  <div className="flex flex-col items-center mb-2.5">
                    <div className="relative mb-1">
                      <Avatar
                        name={ratingRank3.user.fullName}
                        src={ratingRank3.user.avatarUrl}
                        jerseyNumber={ratingRank3.user.jerseyNumber}
                        size="md"
                        showNumber
                        bgColor="#10B981"
                      />
                    </div>
                    <span className="font-space font-bold text-xs text-slate-900 dark:text-slate-100 text-center line-clamp-1 max-w-[110px]">
                      {ratingRank3.user.fullName}
                    </span>
                    <div className="mt-1 px-3 py-0.5 rounded-full bg-[#3B82F6]/15 border border-[#3B82F6]/40 text-[#2563EB] dark:text-[#60A5FA] font-space font-black text-xs shadow-xs flex items-center gap-1">
                      <StarIcon size={12} className="text-amber-500 fill-amber-500" fill />
                      <span>{ratingRank3.totalRating.toFixed(1)}đ</span>
                    </div>
                    <span className="text-[10px] font-space text-slate-400 mt-0.5">
                      TB: {ratingRank3.averageRating.toFixed(1)}/10
                    </span>
                  </div>

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

          {/* RATING LEADERBOARD TABLE */}
          <div
            className={clsx(
              'rounded-[28px] border transition-all shadow-sm overflow-hidden flex flex-col',
              'bg-white dark:bg-[#131927] border-slate-200 dark:border-slate-800/90'
            )}
          >
            {/* Header Toolbar */}
            <div className="p-5 sm:p-6 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-amber-500 text-xl">military_tech</span>
                <div>
                  <h3 className="font-space font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
                    Bảng Điểm Đánh Giá & Phong Độ
                  </h3>
                  <span className="text-[11px] font-space text-slate-400 font-medium">
                    Thống kê {ratingPeriod === 'week' ? 'tuần này' : ratingPeriod === 'month' ? 'tháng này' : 'toàn thời gian'} ({filteredRatingItems.length} cầu thủ)
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
                  placeholder="Tìm kiếm cầu thủ, số áo..."
                  className="bg-slate-100 dark:bg-[#0E1422] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-amber-500 w-full sm:w-64 font-space transition-all"
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
                    <th className="py-3 px-4 text-center text-amber-600 dark:text-amber-400 bg-amber-500/5">
                      <div className="inline-flex items-center justify-center gap-1">
                        <StarIcon size={13} className="text-amber-500 fill-amber-500" fill />
                        <span>Tổng Điểm</span>
                      </div>
                    </th>
                    <th className="py-3 px-3 text-center">Điểm TB (/10)</th>
                    <th className="py-3 px-3 text-center">Trận Chấm</th>
                    <th className="py-3 px-3 text-center">
                      <div className="inline-flex items-center justify-center gap-1">
                        <BallIcon size={13} className="text-rose-500" />
                        <span>Bàn</span>
                      </div>
                    </th>
                    <th className="py-3 px-3 text-center">
                      <div className="inline-flex items-center justify-center gap-1">
                        <AssistIcon size={13} className="text-blue-500" />
                        <span>Kiến tạo</span>
                      </div>
                    </th>
                    <th className="py-3 px-3 text-center">
                      <div className="inline-flex items-center justify-center gap-1">
                        <SaveIcon size={13} className="text-emerald-500" />
                        <span>Cứu thua</span>
                      </div>
                    </th>
                    <th className="py-3 px-3 text-center">
                      <div className="inline-flex items-center justify-center gap-1">
                        <CrownIcon size={13} className="text-amber-500" />
                        <span>MVP</span>
                      </div>
                    </th>
                    <th className="py-3 px-4 text-center">Danh hiệu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-space text-xs">
                  {loadingRating ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-xs text-slate-400">
                        Đang tải danh sách điểm đánh giá...
                      </td>
                    </tr>
                  ) : filteredRatingItems.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-xs text-slate-400 italic">
                        Không tìm thấy cầu thủ phù hợp bộ lọc
                      </td>
                    </tr>
                  ) : (
                    filteredRatingItems.map((item) => {
                      const isCurrentUser = user?.id === item.user.id;

                      return (
                        <tr
                          key={item.user.id}
                          className={clsx(
                            'transition-colors duration-150 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 group',
                            isCurrentUser ? 'bg-amber-50/30 dark:bg-amber-950/20' : ''
                          )}
                        >
                          {/* 1. Hạng */}
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

                          {/* 2. Cầu thủ */}
                          <td className="py-3.5 px-4 min-w-[200px]">
                            <div className="flex items-center gap-3">
                              <Avatar
                                name={item.user.fullName}
                                src={item.user.avatarUrl}
                                jerseyNumber={item.user.jerseyNumber}
                                size="md"
                                showNumber
                                bgColor={
                                  item.rank === 1
                                    ? '#F59E0B'
                                    : item.rank === 2
                                    ? '#8B5CF6'
                                    : item.rank === 3
                                    ? '#10B981'
                                    : undefined
                                }
                              />
                              <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <Link
                                    to={`/players/${item.user.id}`}
                                    className="font-bold text-sm text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors truncate"
                                  >
                                    {item.user.fullName}
                                  </Link>
                                  {isCurrentUser && (
                                    <span className="px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-[10px] font-black border border-amber-300 dark:border-amber-800">
                                      BẠN
                                    </span>
                                  )}
                                  {item.user.role === 'ADMIN' && (
                                    <span className="px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 text-[10px] font-black border border-blue-200 dark:border-blue-800">
                                      ADMIN
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                                  #{item.user.jerseyNumber || '—'} • @{item.user.username || 'user'}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* 3. Tổng Điểm Đánh Giá (Primary Sort) */}
                          <td className="py-3.5 px-4 text-center bg-amber-500/5">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-100/80 dark:bg-amber-950/60 border border-amber-300/80 dark:border-amber-700/60 shadow-xs">
                              <StarIcon size={13} className="text-amber-500 fill-amber-500" fill />
                              <span className="font-black text-sm sm:text-base text-amber-700 dark:text-amber-300 tabular-nums">
                                {item.totalRating.toFixed(1)}
                              </span>
                            </div>
                          </td>

                          {/* 4. Điểm Trung Bình */}
                          <td className="py-3.5 px-3 text-center">
                            <span className="font-bold text-sm text-slate-900 dark:text-white tabular-nums">
                              {item.averageRating.toFixed(1)}
                            </span>
                            <span className="text-[10px] text-slate-400">/10</span>
                          </td>

                          {/* 5. Trận Được Chấm */}
                          <td className="py-3.5 px-3 text-center text-slate-600 dark:text-slate-300 font-medium tabular-nums">
                            {item.ratedMatches} / {item.totalMatches}
                          </td>

                          {/* 6. Bàn Thắng */}
                          <td className="py-3.5 px-3 text-center font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                            {item.totalGoals > 0 ? item.totalGoals : '—'}
                          </td>

                          {/* 7. Kiến Tạo */}
                          <td className="py-3.5 px-3 text-center font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                            {item.totalAssists > 0 ? item.totalAssists : '—'}
                          </td>

                          {/* 8. Cứu Thua */}
                          <td className="py-3.5 px-3 text-center font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                            {item.totalSaves > 0 ? item.totalSaves : '—'}
                          </td>

                          {/* 9. MVP */}
                          <td className="py-3.5 px-3 text-center">
                            {item.totalMvp > 0 ? (
                              <span className="inline-flex items-center gap-0.5 text-amber-500 font-bold tabular-nums">
                                <span className="material-symbols-outlined text-xs">star</span>
                                {item.totalMvp}
                              </span>
                            ) : (
                              <span className="text-slate-300 dark:text-slate-600">—</span>
                            )}
                          </td>

                          {/* 10. Danh hiệu */}
                          <td className="py-3.5 px-4 text-center">
                            {item.rank === 1 ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 text-[10px] font-black uppercase shadow-xs">
                                <CrownIcon size={12} className="text-amber-600 dark:text-amber-400" />
                                <span>Xuất sắc nhất</span>
                              </span>
                            ) : item.rank <= 3 ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                                <MedalIcon size={12} className="text-indigo-500" />
                                <span>Top {item.rank}</span>
                              </span>
                            ) : (
                              <span className="text-slate-300 dark:text-slate-600 text-xs">—</span>
                            )}
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
      )}

      {/* ========================================================================= */}
      {/* 3. TAB B: BXH THỐNG KÊ TÍCH LŨY (CUMULATIVE METRICS)                       */}
      {/* ========================================================================= */}
      {mainTab === 'cumulative' && (
        <div className="animate-in fade-in duration-200">
          {/* Sub-toolbar: Metric Sort Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-200/70 dark:bg-[#151D2E] border border-slate-300/70 dark:border-slate-800 text-xs font-space font-bold">
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

            <span className="text-xs text-slate-500 dark:text-slate-400 font-space font-medium">
              Thống kê tích lũy toàn giải đấu của thành viên CLB
            </span>
          </div>

          {/* 3D PODIUM FOR CUMULATIVE */}
          <div className="relative pt-6 pb-2 flex justify-center items-end select-none mb-6">
            <div className="flex items-end justify-center gap-2 sm:gap-4 max-w-lg w-full px-4">
              {/* Hạng 2 */}
              {cumRank2 && (
                <div className="flex-1 flex flex-col items-center">
                  <div className="flex flex-col items-center mb-2.5">
                    <div className="relative mb-1">
                      <Avatar
                        name={cumRank2.user.fullName}
                        src={cumRank2.user.avatarUrl}
                        jerseyNumber={cumRank2.user.jerseyNumber}
                        size="md"
                        showNumber
                        bgColor="#8B5CF6"
                      />
                    </div>
                    <span className="font-space font-bold text-xs text-slate-900 dark:text-slate-100 text-center line-clamp-1 max-w-[110px]">
                      {cumRank2.user.fullName}
                    </span>
                    <div className="mt-1 px-3 py-0.5 rounded-full bg-[#3B82F6]/15 border border-[#3B82F6]/40 text-[#2563EB] dark:text-[#60A5FA] font-space font-black text-xs shadow-xs">
                      {getCumulativeBadgeText(cumRank2)}
                    </div>
                  </div>

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

              {/* Hạng 1 */}
              {cumRank1 && (
                <div className="flex-1 flex flex-col items-center z-10">
                  <div className="flex flex-col items-center mb-2.5">
                    <div className="w-7 h-7 rounded-xl bg-amber-400/20 border border-amber-400/60 flex items-center justify-center text-amber-500 mb-1 shadow-[0_0_14px_rgba(251,191,36,0.5)]">
                      <span className="material-symbols-outlined text-base font-black">military_tech</span>
                    </div>
                    <div className="relative mb-1 ring-2 ring-amber-400/90 rounded-full p-0.5 shadow-[0_0_18px_rgba(251,191,36,0.3)]">
                      <Avatar
                        name={cumRank1.user.fullName}
                        src={cumRank1.user.avatarUrl}
                        jerseyNumber={cumRank1.user.jerseyNumber}
                        size="lg"
                        showNumber
                        bgColor="#0EA5E9"
                      />
                    </div>
                    <span className="font-space font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 text-center line-clamp-1 max-w-[130px]">
                      {cumRank1.user.fullName}
                    </span>
                    <div className="mt-1 px-3.5 py-0.5 rounded-full bg-[#3B82F6]/15 border border-[#3B82F6]/40 text-[#2563EB] dark:text-[#60A5FA] font-space font-black text-xs shadow-xs">
                      {getCumulativeBadgeText(cumRank1)}
                    </div>
                  </div>

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

              {/* Hạng 3 */}
              {cumRank3 && (
                <div className="flex-1 flex flex-col items-center">
                  <div className="flex flex-col items-center mb-2.5">
                    <div className="relative mb-1">
                      <Avatar
                        name={cumRank3.user.fullName}
                        src={cumRank3.user.avatarUrl}
                        jerseyNumber={cumRank3.user.jerseyNumber}
                        size="md"
                        showNumber
                        bgColor="#10B981"
                      />
                    </div>
                    <span className="font-space font-bold text-xs text-slate-900 dark:text-slate-100 text-center line-clamp-1 max-w-[110px]">
                      {cumRank3.user.fullName}
                    </span>
                    <div className="mt-1 px-3 py-0.5 rounded-full bg-[#3B82F6]/15 border border-[#3B82F6]/40 text-[#2563EB] dark:text-[#60A5FA] font-space font-black text-xs shadow-xs">
                      {getCumulativeBadgeText(cumRank3)}
                    </div>
                  </div>

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

          {/* CUMULATIVE ROSTER TABLE */}
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
                    Toàn bộ thống kê thi đấu ({filteredCumulativeItems.length} cầu thủ)
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
                  ) : filteredCumulativeItems.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-xs text-slate-400 italic">
                        Không tìm thấy cầu thủ phù hợp
                      </td>
                    </tr>
                  ) : (
                    filteredCumulativeItems.map((item) => {
                      return (
                        <tr
                          key={item.user.id}
                          className={clsx(
                            'transition-colors duration-150 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 group',
                            item.isCurrentUser ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''
                          )}
                        >
                          {/* 1. Hạng */}
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

                          {/* 2. Cầu thủ */}
                          <td className="py-3.5 px-4 min-w-[200px]">
                            <div className="flex items-center gap-3">
                              <Avatar
                                name={item.user.fullName}
                                src={item.user.avatarUrl}
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

                          {/* 6. MVP */}
                          <td className="py-3.5 px-3 text-center">
                            <div
                              className={clsx(
                                'inline-flex items-center gap-1 font-bold',
                                sortMode === 'mvp' ? 'text-amber-500 font-black scale-105' : 'text-amber-500'
                              )}
                            >
                              <span className="material-symbols-outlined text-sm">star</span>
                              <span>{item.totalMvp || item.mvpCount}</span>
                            </div>
                          </td>

                          {/* 7. Phong độ */}
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
                                  title={result === 'W' ? 'Thắng' : result === 'D' ? 'Hoà' : 'Thua'}
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
      )}
    </div>
  );
};

export default LeaderboardPage;
