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
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-mono text-slate-500">Đang tải hồ sơ cầu thủ...</p>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Không tìm thấy cầu thủ</h2>
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
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Player Header Banner Card */}
      <Card elevation="level2" className="relative overflow-hidden p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Avatar name={player.fullName} jerseyNumber={player.jerseyNumber} size="xl" showNumber />

          <div className="flex flex-col items-center sm:items-start text-center sm:text-left flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900">
                {player.fullName}
              </h1>
              {player.jerseyNumber && (
                <span className="font-mono font-black text-xl text-amber-600">
                  #{player.jerseyNumber}
                </span>
              )}
            </div>

            <p className="text-xs font-mono text-slate-500 mb-3">
              @{player.username} · {player.email || 'Thành viên CLB'}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={player.role === 'ADMIN' ? 'teamA' : 'neutral'}>
                {player.role === 'ADMIN' ? 'Quản trị viên' : 'Cầu thủ'}
              </Badge>
              <Badge variant="gold">Thể thức 7v7</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Card elevation="level1" className="p-4 text-center">
          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Số trận</span>
          <span className="font-heading font-black text-2xl text-slate-900 mt-1 block">
            {totalMatches}
          </span>
        </Card>
        <Card elevation="level1" className="p-4 text-center">
          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Bàn thắng</span>
          <span className="font-heading font-black text-2xl text-red-600 mt-1 block">
            {totalGoals}
          </span>
        </Card>
        <Card elevation="level1" className="p-4 text-center">
          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Kiến tạo</span>
          <span className="font-heading font-black text-2xl text-blue-600 mt-1 block">
            {totalAssists}
          </span>
        </Card>
        <Card elevation="level1" className="p-4 text-center">
          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Chiến thắng</span>
          <span className="font-heading font-black text-2xl text-amber-600 mt-1 block">
            {totalWins} ({winRate}%)
          </span>
        </Card>
        <Card elevation="level1" className="p-4 text-center col-span-2 sm:col-span-1">
          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Danh hiệu MVP</span>
          <span className="font-heading font-black text-2xl text-amber-600 mt-1 block">
            ★ {totalMvps}
          </span>
        </Card>
      </div>

      {/* Recent Match Participation */}
      <Card elevation="level1">
        <h3 className="font-heading font-black text-lg text-slate-900 mb-4 pb-3 border-b border-slate-100">
          Lịch sử các trận đã thi đấu
        </h3>

        {statsHistory.length === 0 ? (
          <p className="text-center py-8 text-xs text-slate-400 italic">
            Chưa có thông số thi đấu nào được ghi nhận
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-slate-100">
            {statsHistory.map((s) => (
              <div key={s.id} className="py-3 flex items-center justify-between">
                <div>
                  <Link
                    to={`/matches/${s.matchId}`}
                    className="font-bold text-sm text-slate-900 hover:text-red-600 transition-colors block"
                  >
                    Xem trận đấu #{s.matchId.slice(0, 8)}
                  </Link>
                  <span className="text-[11px] font-mono text-slate-500">
                    {s.team === 'A' ? 'Đội A (Đỏ)' : 'Đội B (Xanh)'}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-red-600 font-bold">{s.goals} bàn</span>
                  <span className="text-blue-600 font-bold">{s.assists} kiến tạo</span>
                  {s.isMvp && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold border border-amber-200">
                      MVP
                    </span>
                  )}
                  <span
                    className={`font-bold ${
                      s.isWinner ? 'text-amber-600' : 'text-slate-500'
                    }`}
                  >
                    {s.isWinner ? 'Thắng' : 'Thua'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
