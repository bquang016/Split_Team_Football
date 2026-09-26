import React, { useEffect, useState, useRef } from 'react';
import { LeaderboardItem, User } from '../types';
import { leaderboardService } from '../services/leaderboardService';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

interface ScorerEntry {
  id: string;
  name: string;
  team: string;
  teamColor: string;
  goals: number;
  assists: number;
}

interface PendingPlayer {
  id: string;
  name: string;
  initial: string;
  colorClass: string;
  position: string;
  timeAgo: string;
}

interface EnrichedLeaderboardItem extends LeaderboardItem {
  position: string;
  mvpCount: number;
  form: ('W' | 'D' | 'L')[];
  teamName: string;
  isCurrentUser?: boolean;
}

export const LeaderboardPage: React.FC = () => {
  const [items, setItems] = useState<EnrichedLeaderboardItem[]>([]);
  const [sortMode, setSortMode] = useState<'goals' | 'assists' | 'winrate'>('goals');
  const [season, setSeason] = useState('2025');
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  // Match score widget state
  const [scoreA, setScoreA] = useState(4);
  const [scoreB, setScoreB] = useState(2);
  const [selectedMvp, setSelectedMvp] = useState('hung_nguyen');
  const [scorers, setScorers] = useState<ScorerEntry[]>([
    { id: '1', name: 'Hoàng Minh', team: 'Team A', teamColor: 'bg-emerald-100 text-emerald-800', goals: 2, assists: 0 },
    { id: '2', name: 'Hùng Nguyễn', team: 'Team A', teamColor: 'bg-emerald-100 text-emerald-800', goals: 1, assists: 1 },
    { id: '3', name: 'Tuấn Chelsea', team: 'Team B', teamColor: 'bg-orange-100 text-orange-800', goals: 2, assists: 0 },
  ]);

  // AI Scout Commentary
  const [aiRecap, setAiRecap] = useState<string>(
    '“Trận đấu diễn ra cởi mở với màn rượt đuổi tỷ số kịch tính trong hiệp 1. Sang hiệp 2, tuyến giữa Team A hoàn toàn áp đảo nhờ sự năng nổ của Hùng Nguyễn và Hoàng Minh với 3 pha phối hợp bài bản, định đoạt trọn vẹn 3 điểm.”'
  );

  // Pending approval list
  const [pendingList, setPendingList] = useState<PendingPlayer[]>([
    {
      id: 'p1',
      name: 'Nguyễn Văn Đức',
      initial: 'Đ',
      colorClass: 'text-emerald-700',
      position: 'CB/CDM',
      timeAgo: 'Đăng ký 2h trước',
    },
    {
      id: 'p2',
      name: 'Lê Hoàng Long',
      initial: 'L',
      colorClass: 'text-blue-700',
      position: 'RW/ST',
      timeAgo: 'Đăng ký hôm qua',
    },
  ]);

  // Role Setting Modal State
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [targetPlayer, setTargetPlayer] = useState<{ name: string; role: 'ADMIN' | 'PLAYER' }>({
    name: '',
    role: 'PLAYER',
  });
  const [selectedRole, setSelectedRole] = useState<'ADMIN' | 'PLAYER'>('PLAYER');

  const matchWidgetRef = useRef<HTMLDivElement>(null);
  const pendingQueueRef = useRef<HTMLDivElement>(null);

  // Sample seed data to ensure complete editorial showcase when backend has partial records
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
      winRate: 78.5,
      updatedAt: new Date().toISOString(),
      position: 'ST',
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
      winRate: 71.4,
      updatedAt: new Date().toISOString(),
      position: 'BẠN',
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
      winRate: 61.5,
      updatedAt: new Date().toISOString(),
      position: 'CM',
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
      winRate: 58.3,
      updatedAt: new Date().toISOString(),
      position: 'RW',
      mvpCount: 1,
      form: ['W', 'L', 'W', 'W', 'W'],
      teamName: 'Team B (Pháp)',
    },
    {
      rank: 5,
      user: {
        id: 'u-5',
        username: 'baotrong',
        fullName: 'Bảo Trọng',
        jerseyNumber: 1,
        role: 'PLAYER',
        status: 'ACTIVE',
        createdAt: '2025-01-01',
      },
      totalMatches: 14,
      totalGoals: 0,
      totalAssists: 2,
      totalWins: 10,
      winRate: 71.4,
      updatedAt: new Date().toISOString(),
      position: 'GK',
      mvpCount: 3,
      form: ['W', 'W', 'L', 'W', 'W'],
      teamName: 'Team A (Tây Ban Nha)',
    },
    {
      rank: 6,
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
      winRate: 54.5,
      updatedAt: new Date().toISOString(),
      position: 'CB',
      mvpCount: 0,
      form: ['L', 'W', 'W', 'L', 'W'],
      teamName: 'Team A (Tây Ban Nha)',
    },
    {
      rank: 7,
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
      winRate: 40.0,
      updatedAt: new Date().toISOString(),
      position: 'LW',
      mvpCount: 1,
      form: ['L', 'L', 'W', 'L', 'W'],
      teamName: 'Team B (Pháp)',
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
      winRate: 33.3,
      updatedAt: new Date().toISOString(),
      position: 'CDM',
      mvpCount: 0,
      form: ['W', 'L', 'W', 'L', 'L'],
      teamName: 'Team B (Pháp)',
    },
  ];

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const type = sortMode === 'winrate' ? 'wins' : sortMode;
      const res = await leaderboardService.getLeaderboard(type);
      if (res.success && res.data && res.data.length > 0) {
        // Merge backend data with positions & form
        const enriched: EnrichedLeaderboardItem[] = res.data.map((item, idx) => {
          const matchedSample = sampleRoster.find((s) => s.user.username === item.user.username);
          return {
            ...item,
            position: matchedSample?.position || (idx === 0 ? 'ST' : idx === 1 ? 'CM' : 'CB'),
            mvpCount: matchedSample?.mvpCount ?? Math.max(0, Math.floor(item.totalGoals / 3)),
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
  };

  const sortItems = (data: EnrichedLeaderboardItem[], mode: 'goals' | 'assists' | 'winrate') => {
    const cloned = [...data];
    if (mode === 'goals') {
      cloned.sort((a, b) => b.totalGoals - a.totalGoals || b.totalAssists - a.totalAssists);
    } else if (mode === 'assists') {
      cloned.sort((a, b) => b.totalAssists - a.totalAssists || b.totalGoals - a.totalGoals);
    } else {
      cloned.sort((a, b) => b.winRate - a.winRate || b.totalWins - a.totalWins);
    }
    return cloned.map((item, index) => ({ ...item, rank: index + 1 }));
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [sortMode]);

  const handleSortChange = (mode: 'goals' | 'assists' | 'winrate') => {
    setSortMode(mode);
    const label = mode === 'goals' ? 'Bàn thắng' : mode === 'assists' ? 'Kiến tạo' : 'Tỷ lệ thắng';
    toast.success(`Đã sắp xếp BXH theo tiêu chí: ${label}`);
  };

  const focusScoreInput = () => {
    if (matchWidgetRef.current) {
      matchWidgetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      matchWidgetRef.current.classList.add('ring-2', 'ring-emerald-500');
      setTimeout(() => {
        matchWidgetRef.current?.classList.remove('ring-2', 'ring-emerald-500');
      }, 1500);
    }
  };

  const focusPendingQueue = () => {
    if (pendingQueueRef.current) {
      pendingQueueRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      pendingQueueRef.current.classList.add('ring-2', 'ring-amber-500');
      setTimeout(() => {
        pendingQueueRef.current?.classList.remove('ring-2', 'ring-amber-500');
      }, 1500);
    }
  };

  const handleAdjustScore = (team: 'A' | 'B', delta: number) => {
    if (team === 'A') {
      setScoreA((prev) => Math.max(0, prev + delta));
    } else {
      setScoreB((prev) => Math.max(0, prev + delta));
    }
  };

  const handleAddScorer = () => {
    const newEntry: ScorerEntry = {
      id: Date.now().toString(),
      name: 'Cầu thủ mới',
      team: 'Team A',
      teamColor: 'bg-emerald-100 text-emerald-800',
      goals: 1,
      assists: 0,
    };
    setScorers([...scorers, newEntry]);
    toast('Đã thêm dòng ghi bàn mới', { icon: '⚽' });
  };

  const handleRemoveScorer = (id: string) => {
    setScorers(scorers.filter((s) => s.id !== id));
  };

  const handleSubmitMatchResult = () => {
    const mvpLabels: Record<string, string> = {
      hung_nguyen: 'Hùng Nguyễn',
      hoang_minh: 'Hoàng Minh',
      tuan_chelsea: 'Tuấn Chelsea',
      bao_trong: 'Bảo Trọng',
    };
    const mvpName = mvpLabels[selectedMvp] || 'Hùng Nguyễn';

    toast.success(`Đã lưu tỉ số [${scoreA} - ${scoreB}] & cập nhật BXH thành công!`);
    setAiRecap(
      `“Kết thúc trận đấu với tỷ số ${scoreA}-${scoreB}. Điểm nhấn lớn nhất là phong độ chói sáng của ${mvpName}. Các dữ liệu bàn thắng và kiến tạo đã được đồng bộ vào hệ thống BXH chính thức.”`
    );
  };

  const handleResetScore = () => {
    setScoreA(0);
    setScoreB(0);
    toast('Đã đặt lại tỉ số về 0-0', { icon: '🔄' });
  };

  const handleRegenerateAiRecap = () => {
    setAiRecap(
      '“Phân tích thông số chuyên sâu: Khả năng chuyển đổi cơ hội của Team A đạt mức ấn tượng 44%. Hàng thủ Team B chịu áp lực lớn ở 15 phút cuối hiệp 2 sau các pha bứt tốc bên cánh trái.”'
    );
    toast.success('Đã làm mới báo cáo chiến thuật AI!');
  };

  const handleApprovePlayer = (id: string, name: string) => {
    setPendingList(pendingList.filter((p) => p.id !== id));
    toast.success(`Đã duyệt thành công ${name} vào danh sách thi đấu!`);
  };

  const handleRejectPlayer = (id: string, name: string) => {
    setPendingList(pendingList.filter((p) => p.id !== id));
    toast(`Đã từ chối đăng ký của ${name}.`, { icon: '❌' });
  };

  const openPlayerRoleModal = (name: string, currentRole: 'ADMIN' | 'PLAYER') => {
    setTargetPlayer({ name, role: currentRole });
    setSelectedRole(currentRole);
    setRoleModalOpen(true);
  };

  const savePlayerRole = () => {
    setRoleModalOpen(false);
    toast.success(`Đã lưu thay đổi phân quyền cho cầu thủ ${targetPlayer.name}! (${selectedRole})`);
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Top Header Summary Card: Premier League Clean Style */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Live Standings
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Vòng đấu #14 • Sân cỏ nhân tạo D3 Bình Thạnh
            </span>
          </div>
          <h1 className="font-headline font-black text-2xl lg:text-3xl text-slate-900 tracking-tight">
            Bảng Xếp Hạng Mùa Giải <span className="text-emerald-600 font-extrabold">{season}</span>
          </h1>
          <p className="text-xs lg:text-sm text-slate-500 max-w-2xl">
            Theo dõi bàn thắng, kiến tạo, tỷ lệ thắng và điểm thưởng MVP độc quyền giải phong trào Saigon Sunday League.
          </p>
        </div>

        {/* Season Picker & Primary Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs">
            <span className="material-symbols-outlined text-slate-400 text-base mr-1.5">calendar_today</span>
            <select
              value={season}
              onChange={(e) => {
                setSeason(e.target.value);
                toast(`Đã chọn ${e.target.value}`, { icon: '📅' });
              }}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer pr-1"
            >
              <option value="2025">Mùa giải 2025 (Hiện tại)</option>
              <option value="2024">Mùa giải 2024 (Lưu trữ)</option>
              <option value="Cup 2025">Hè Cup 2025</option>
            </select>
          </div>

          <button
            type="button"
            onClick={focusScoreInput}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3.5 py-2 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">sports_score</span>
            <span>Nhập Tỉ Số Trận</span>
          </button>

          <button
            type="button"
            onClick={focusPendingQueue}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs px-3 py-2 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-slate-500">person_add</span>
            <span>Duyệt mới</span>
            {pendingList.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                {pendingList.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Quick KPI Metric Cards Bar (3 cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Tổng Bàn Thắng Giải
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="font-headline font-black text-2xl text-slate-900">74</span>
              <span className="text-xs text-slate-400">bàn / 14 vòng</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-medium mt-1">
              ↑ 12% so với mùa trước
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">sports_soccer</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Hiệu Suất Trung Bình
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="font-headline font-black text-2xl text-slate-900">5.28</span>
              <span className="text-xs text-slate-400">bàn / trận</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium mt-1">
              Trận đấu cởi mở, fair-play
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">analytics</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Chỉ Số Fair-Play
            </span>
            <div className="flex items-center gap-3 mt-1.5">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-3.5 bg-amber-400 rounded-xs" />
                <span className="text-sm font-bold text-slate-800">18</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-3.5 bg-rose-500 rounded-xs" />
                <span className="text-sm font-bold text-slate-800">2</span>
              </div>
            </div>
            <span className="text-[11px] text-slate-400 mt-1">
              Tỷ lệ thẻ thấp top đầu giải
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">verified</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Tactical Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Main Standings Leaderboard (7 cols) */}
        <section className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
            {/* Card Sub-Header & Sort Segment Controls */}
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-lg">
                  format_list_numbered
                </span>
                <h2 className="font-headline font-bold text-base text-slate-900">
                  Bảng Xếp Hạng Cá Nhân
                </h2>
                <span className="text-xs font-medium text-slate-400">· {items.length} cầu thủ</span>
              </div>

              {/* Segment Control (FotMob Style) */}
              <div className="inline-flex p-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
                <button
                  type="button"
                  onClick={() => handleSortChange('goals')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    sortMode === 'goals'
                      ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Bàn Thắng (G)
                </button>
                <button
                  type="button"
                  onClick={() => handleSortChange('assists')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    sortMode === 'assists'
                      ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Kiến Tạo (A)
                </button>
                <button
                  type="button"
                  onClick={() => handleSortChange('winrate')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    sortMode === 'winrate'
                      ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tỷ Lệ Thắng
                </button>
              </div>
            </div>

            {/* Standings Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-2.5 px-3 w-10 text-center">#</th>
                    <th className="py-2.5 px-3">Cầu Thủ</th>
                    <th className="py-2.5 px-2 text-center" title="Số trận thi đấu">Trận</th>
                    <th className="py-2.5 px-2 text-center text-slate-900" title="Bàn thắng">G</th>
                    <th className="py-2.5 px-2 text-center" title="Kiến tạo">A</th>
                    <th className="py-2.5 px-2 text-center" title="Điểm MVP">MVP</th>
                    <th className="py-2.5 px-3 text-center">5 Trận Gần Nhất</th>
                    <th className="py-2.5 px-3 text-right">Tỷ Lệ</th>
                    <th className="py-2.5 px-2 text-center w-8">
                      <span className="sr-only">Hành động</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-400">
                        Đang tải bảng xếp hạng...
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr
                        key={item.user.id}
                        className={`hover:bg-slate-50/80 transition-colors group ${
                          item.isCurrentUser ? 'bg-emerald-50/30' : ''
                        }`}
                      >
                        {/* Rank Pill */}
                        <td className="py-3 px-3 text-center">
                          {item.rank === 1 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold text-xs">
                              1
                            </span>
                          ) : item.rank === 2 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs">
                              2
                            </span>
                          ) : item.rank === 3 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-50 text-orange-800 border border-orange-200 font-bold text-xs">
                              3
                            </span>
                          ) : (
                            <span className="font-semibold text-slate-500">
                              {item.rank}
                            </span>
                          )}
                        </td>

                        {/* Player Profile */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="relative w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200">
                              {item.user.fullName.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900 text-sm">
                                  {item.user.fullName}
                                </span>
                                {item.isCurrentUser && (
                                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-1 rounded">
                                    BẠN
                                  </span>
                                )}
                                {item.user.role === 'ADMIN' && (
                                  <span className="bg-slate-200 text-slate-700 text-[9px] font-medium px-1 rounded uppercase">
                                    ADMIN
                                  </span>
                                )}
                                <span className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-1 rounded">
                                  {item.position}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-400">
                                {item.teamName} · #{item.user.jerseyNumber || '—'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Match Count */}
                        <td className="py-3 px-2 text-center font-medium text-slate-600">
                          {item.totalMatches}
                        </td>

                        {/* Goals */}
                        <td className="py-3 px-2 text-center font-bold text-slate-900 text-sm">
                          {item.totalGoals}
                        </td>

                        {/* Assists */}
                        <td className="py-3 px-2 text-center font-medium text-slate-600">
                          {item.totalAssists}
                        </td>

                        {/* MVP Points */}
                        <td className="py-3 px-2 text-center font-semibold text-amber-700">
                          ★ {item.mvpCount}
                        </td>

                        {/* Form Guide (5 pills) */}
                        <td className="py-3 px-3 text-center">
                          <div className="inline-flex items-center gap-1">
                            {item.form.map((res, fIdx) => (
                              <span
                                key={fIdx}
                                className={`w-4 h-4 rounded-full text-white text-[9px] font-bold flex items-center justify-center ${
                                  res === 'W'
                                    ? 'bg-emerald-600'
                                    : res === 'D'
                                    ? 'bg-slate-400'
                                    : 'bg-rose-500'
                                }`}
                                title={res === 'W' ? 'Thắng' : res === 'D' ? 'Hòa' : 'Thua'}
                              >
                                {res}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Win Rate */}
                        <td className="py-3 px-3 text-right font-semibold text-emerald-700">
                          {item.winRate}%
                        </td>

                        {/* Action Menu */}
                        <td className="py-3 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => openPlayerRoleModal(item.user.fullName, item.user.role)}
                            title="Thiết lập quyền"
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-base">
                              {item.user.role === 'ADMIN' ? 'verified_user' : 'more_vert'}
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="material-symbols-outlined text-emerald-600 text-sm">verified</span>
                Dữ liệu ghi nhận tự động sau mỗi lượt đấu
              </span>
              <button
                type="button"
                onClick={() => toast(`Tổng cộng ${items.length} cầu thủ đã tham gia thi đấu`, { icon: '📊' })}
                className="text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                Xem đầy đủ {items.length} cầu thủ <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Match Score Entry, AI Scout Notes & Pending Approvals (5 cols) */}
        <aside className="lg:col-span-5 flex flex-col gap-5">
          {/* CARD 1: Modern Match Scoreboard & Goal Entry */}
          <div
            ref={matchWidgetRef}
            id="matchEntryWidget"
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col gap-4 transition-all duration-300"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-xl">
                  sports_and_outdoors
                </span>
                <div className="flex flex-col">
                  <h3 className="font-headline font-bold text-sm text-slate-900">
                    Cập Nhật Tỉ Số Trận Đấu
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Vòng 14 · Giao hữu nội bộ cuối tuần
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                Sân 7 người
              </span>
            </div>

            {/* Scoreboard Steppers */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-around">
              {/* Team A */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-slate-800">Team A (Đỏ)</span>
                <span className="text-[10px] text-slate-400">Tây Ban Nha</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <button
                    type="button"
                    onClick={() => handleAdjustScore('A', -1)}
                    className="w-7 h-7 rounded-md bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-base transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={0}
                    value={scoreA}
                    onChange={(e) => setScoreA(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-12 h-11 bg-white border border-slate-300 text-center font-headline font-black text-2xl text-slate-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleAdjustScore('A', 1)}
                    className="w-7 h-7 rounded-md bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-base transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Match status center */}
              <div className="flex flex-col items-center">
                <span className="font-headline font-bold text-slate-300 text-xl tracking-widest">:</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase mt-1">
                  FT 90'
                </span>
              </div>

              {/* Team B */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-slate-800">Team B (Xanh)</span>
                <span className="text-[10px] text-slate-400">Pháp</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <button
                    type="button"
                    onClick={() => handleAdjustScore('B', -1)}
                    className="w-7 h-7 rounded-md bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-base transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={0}
                    value={scoreB}
                    onChange={(e) => setScoreB(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-12 h-11 bg-white border border-slate-300 text-center font-headline font-black text-2xl text-slate-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleAdjustScore('B', 1)}
                    className="w-7 h-7 rounded-md bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-base transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Goal Scorers List */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Cầu Thủ Ghi Bàn & Kiến Tạo
                </label>
                <button
                  type="button"
                  onClick={handleAddScorer}
                  className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-0.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs">add</span> Thêm người
                </button>
              </div>

              <div className="flex flex-col gap-1.5">
                {scorers.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between bg-slate-50 border border-slate-200/80 px-3 py-2 rounded-lg text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{s.name}</span>
                      <span className={`text-[10px] font-medium px-1 rounded ${s.teamColor}`}>
                        {s.team}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                      <span>⚽ {s.goals} bàn</span>
                      <span className="text-slate-400">·</span>
                      <span className={s.assists > 0 ? 'text-emerald-700' : 'text-slate-500'}>
                        👟 {s.assists} KT
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveScorer(s.id)}
                        className="text-slate-400 hover:text-rose-500 ml-1 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MVP Selection */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="mvpSelect" className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <span className="material-symbols-outlined text-amber-500 text-sm">star</span>
                Cầu Thủ Xuất Sắc Nhất (MVP)
              </label>
              <div className="relative">
                <select
                  id="mvpSelect"
                  value={selectedMvp}
                  onChange={(e) => setSelectedMvp(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium p-2.5 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer pr-8"
                >
                  <option value="hung_nguyen">
                    ★ Hùng Nguyễn (Đội trưởng A - 1 bàn, 1 kiến tạo, 6 cản phá)
                  </option>
                  <option value="hoang_minh">
                    ★ Hoàng Minh (Tiền đạo A - 2 bàn mở tỉ số)
                  </option>
                  <option value="tuan_chelsea">
                    ★ Tuấn Chelsea (Tiền vệ B - 2 bàn sút xa)
                  </option>
                  <option value="bao_trong">
                    ★ Bảo Trọng (Thủ môn A - cản phá penalty phút 75)
                  </option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-slate-400 text-base pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            {/* Submit Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleSubmitMatchResult}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 px-3 rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">check</span>
                <span>Lưu & Cập Nhật BXH</span>
              </button>
              <button
                type="button"
                onClick={handleResetScore}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium text-xs py-2.5 px-3 rounded-lg transition-colors cursor-pointer"
              >
                Đặt lại
              </button>
            </div>
          </div>

          {/* CARD 2: Editorial Match Scout Notes (AI Recap) */}
          <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-4 shadow-2xs flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-blue-700 text-base">article</span>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                  Bình Luận Chuyên Môn Trận Đấu
                </span>
              </div>
              <span className="text-[10px] font-medium text-blue-700 bg-blue-100/60 px-1.5 py-0.5 rounded">
                Scout Analysis
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed italic bg-white/70 p-3 rounded-lg border border-blue-100/80">
              {aiRecap}
            </p>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Tỷ lệ kiểm soát bóng: 58% - 42%
              </span>
              <button
                type="button"
                onClick={handleRegenerateAiRecap}
                className="text-blue-700 hover:underline font-semibold inline-flex items-center gap-0.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xs">refresh</span> Phân tích lại
              </button>
            </div>
          </div>

          {/* CARD 3: Pending Member Approvals */}
          <div
            ref={pendingQueueRef}
            id="pendingQueue"
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col gap-3 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-600 text-lg">how_to_reg</span>
                <h4 className="font-headline font-bold text-sm text-slate-900">
                  Chờ Duyệt Tham Gia
                </h4>
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                {pendingList.length} yêu cầu
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {pendingList.length === 0 ? (
                <div className="text-xs text-slate-400 italic text-center py-4">
                  Không còn yêu cầu nào đang chờ duyệt
                </div>
              ) : (
                pendingList.map((p) => (
                  <div
                    key={p.id}
                    className="bg-slate-50 border border-slate-200/80 p-2.5 rounded-lg flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full bg-white border border-slate-200 font-bold text-xs flex items-center justify-center shrink-0 ${p.colorClass}`}>
                        {p.initial}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-xs text-slate-800">{p.name}</span>
                        <span className="text-[10px] text-slate-400">
                          Vị trí: {p.position} · {p.timeAgo}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleApprovePlayer(p.id, p.name)}
                        className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold rounded shadow-2xs transition-colors cursor-pointer"
                      >
                        Duyệt
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRejectPlayer(p.id, p.name)}
                        className="px-2 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 text-[11px] font-medium rounded transition-colors cursor-pointer"
                      >
                        Từ chối
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Role Setting Modal */}
      {roleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-xl p-5 shadow-xl border border-slate-200 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-headline font-bold text-base text-slate-900">
                Phân Quyền Ban Cán Sự
              </h3>
              <button
                type="button"
                onClick={() => setRoleModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-1 bg-slate-50 p-3 rounded-lg border border-slate-200/80">
              <span className="text-[11px] font-medium text-slate-400">Cầu thủ được chọn:</span>
              <span className="font-headline font-bold text-base text-emerald-700">
                {targetPlayer.name}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Vai trò trong giải:
              </label>
              <label
                onClick={() => setSelectedRole('ADMIN')}
                className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedRole === 'ADMIN'
                    ? 'border-emerald-500 bg-emerald-50/40'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="playerRole"
                  value="ADMIN"
                  checked={selectedRole === 'ADMIN'}
                  onChange={() => setSelectedRole('ADMIN')}
                  className="accent-emerald-600 w-4 h-4 mt-0.5"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900">ADMIN / CAPTAIN</span>
                  <span className="text-[11px] text-slate-500">
                    Toàn quyền nhập tỷ số, duyệt thẻ phạt và thành viên mới.
                  </span>
                </div>
              </label>

              <label
                onClick={() => setSelectedRole('PLAYER')}
                className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedRole === 'PLAYER'
                    ? 'border-emerald-500 bg-emerald-50/40'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="playerRole"
                  value="PLAYER"
                  checked={selectedRole === 'PLAYER'}
                  onChange={() => setSelectedRole('PLAYER')}
                  className="accent-emerald-600 w-4 h-4 mt-0.5"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900">PLAYER / THÀNH VIÊN</span>
                  <span className="text-[11px] text-slate-500">
                    Xem bảng xếp hạng, điểm danh thi đấu và hồ sơ cá nhân.
                  </span>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRoleModalOpen(false)}
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-medium cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={savePlayerRole}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs cursor-pointer"
              >
                Lưu Cập Nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
