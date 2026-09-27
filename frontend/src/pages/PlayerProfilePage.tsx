import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlayerStats, User } from '../types';
import { statsService } from '../services/statsService';
import api from '../services/api';
import { Avatar, Badge, Button, Card } from '../ui';
import toast from 'react-hot-toast';

export const PlayerProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [player, setPlayer] = useState<User | null>(null);
  const [statsHistory, setStatsHistory] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [playerRes, statsRes] = await Promise.all([
          api.get(`/api/players/${id}`),
          statsService.getPlayerStats(id),
        ]);

        if (playerRes.data?.success) setPlayer(playerRes.data.data);
        if (statsRes.success) setStatsHistory(statsRes.data || []);
      } catch {
        toast.error('Không thể tải thông tin cầu thủ');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-space text-slate-500">Đang tải hồ sơ cầu thủ...</p>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="text-center py-20 font-sans">
        <h2 className="text-xl font-space font-black text-slate-900 dark:text-white mb-3">
          Không tìm thấy cầu thủ
        </h2>
        <Link to="/players">
          <Button variant="primary">Quay lại danh sách</Button>
        </Link>
      </div>
    );
  }

  // Aggregate stats
  const totalMatches = statsHistory.length;
  const totalGoals = statsHistory.reduce((acc, s) => acc + (s.goals || 0), 0);
  const totalAssists = statsHistory.reduce((acc, s) => acc + (s.assists || 0), 0);
  const totalWins = statsHistory.filter((s) => s.isWinner).length;
  const totalMvps = statsHistory.filter((s) => s.isMvp).length;
  const winRate = totalMatches > 0 ? Math.round((totalWins / totalMatches) * 1000) / 10 : 0;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto font-sans">
      {/* Player Header Banner Card */}
      <Card elevation="glass" glow className="relative overflow-hidden p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Avatar name={player.fullName} jerseyNumber={player.jerseyNumber} size="xl" showNumber />

          <div className="flex flex-col items-center sm:items-start text-center sm:text-left flex-1">
            <div className="flex items-center gap-2.5 mb-1">
              <h1 className="font-space font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
                {player.fullName}
              </h1>
              {player.jerseyNumber && (
                <span className="font-space font-black text-2xl text-amber-600 dark:text-amber-400">
                  #{player.jerseyNumber}
                </span>
              )}
            </div>

            <p className="text-xs font-space text-slate-600 dark:text-slate-400 mb-3">
              @{player.username} - {player.email || 'Thành viên chính thức CLB'}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={player.role === 'ADMIN' ? 'primary' : 'neutral'}>
                {player.role === 'ADMIN' ? 'Quản trị viên' : 'Cầu thủ'}
              </Badge>
              <Badge variant="gold">Thể thức 7v7</Badge>
              {totalMvps > 0 && (
                <Badge variant="primary">
                  {totalMvps} lần MVP
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Aggregate Stats Bento Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card elevation="level1" className="text-center p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-space font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            Trận đấu
          </span>
          <span className="font-space font-black text-3xl sm:text-4xl text-slate-950 dark:text-white mt-1 block">
            {totalMatches}
          </span>
        </Card>

        <Card elevation="level1" className="text-center p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-space font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            Bàn thắng
          </span>
          <span className="font-space font-black text-3xl sm:text-4xl text-rose-600 dark:text-rose-400 mt-1 block">
            {totalGoals}
          </span>
        </Card>

        <Card elevation="level1" className="text-center p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-space font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            Kiến tạo
          </span>
          <span className="font-space font-black text-3xl sm:text-4xl text-blue-600 dark:text-blue-400 mt-1 block">
            {totalAssists}
          </span>
        </Card>

        <Card elevation="level1" className="text-center p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-space font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            Tỷ lệ thắng
          </span>
          <span className="font-space font-black text-3xl sm:text-4xl text-emerald-600 dark:text-emerald-400 mt-1 block">
            {winRate}%
          </span>
        </Card>
      </div>

      {/* Match History Table */}
      <Card elevation="level1" className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="font-space font-extrabold text-lg text-slate-950 dark:text-white mb-4">
          Lịch Sử Thi Đấu
        </h3>

        {statsHistory.length === 0 ? (
          <p className="text-sm text-slate-400 italic text-center py-6">
            Chưa có thông số thi đấu nào được ghi nhận.
          </p>
        ) : (
          <div className="space-y-2">
            {statsHistory.map((stat) => (
              <div
                key={stat.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-space"
              >
                <div className="flex items-center gap-3">
                  <Badge variant={stat.team === 'A' ? 'teamA' : 'teamB'} size="sm">
                    Đội {stat.team}
                  </Badge>
                  <span className="font-bold text-slate-950 dark:text-white">
                    {stat.isWinner ? 'Thắng trận' : 'Thua trận'}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-slate-900 dark:text-slate-200 font-medium">
                  <span>{stat.goals || 0} Bàn thắng</span>
                  <span>{stat.assists || 0} Kiến tạo</span>
                  {stat.isMvp && <Badge variant="primary" size="sm">MVP</Badge>}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
