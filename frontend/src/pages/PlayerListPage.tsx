import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';
import api from '../services/api';
import { Avatar, Badge, Card, Input } from '../ui';
import toast from 'react-hot-toast';

export const PlayerListPage: React.FC = () => {
  const [players, setPlayers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/players');
        if (res.data?.success) {
          setPlayers(res.data.data || []);
        }
      } catch {
        toast.error('Không thể tải danh sách cầu thủ');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const filteredPlayers = players.filter(
    (p) =>
      p.fullName.toLowerCase().includes(search.toLowerCase()) ||
      p.username.toLowerCase().includes(search.toLowerCase()) ||
      (p.jerseyNumber && p.jerseyNumber.toString().includes(search))
  );

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto font-sans">
      {/* Header Bar */}
      <Card elevation="glass" glow className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="primary" dot size="sm">
                Đội hình CLB
              </Badge>
              <span className="text-xs text-slate-400 font-space font-medium">Saigon Sunday League</span>
            </div>
            <h1 className="font-space font-black text-2xl sm:text-3xl text-slate-900 dark:text-white mt-2 tracking-tight">
              Danh Sách Cầu Thủ
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Tổng cộng <strong className="text-slate-900 dark:text-slate-100">{players.length}</strong> cầu thủ chính thức và ban cán sự đang hoạt động.
            </p>
          </div>

          <div className="w-full sm:w-72">
            <Input
              placeholder="Tìm theo tên hoặc số áo..."
              leftIcon="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch('')}
            />
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="py-20 text-center text-sm text-slate-500">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Đang tải danh sách cầu thủ...
        </div>
      ) : filteredPlayers.length === 0 ? (
        <Card elevation="level1" className="py-12 text-center text-sm text-slate-400 italic">
          Không tìm thấy cầu thủ nào phù hợp
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPlayers.map((player) => (
            <Link key={player.id} to={`/players/${player.id}`}>
              <Card hoverable elevation="level1" className="flex items-center gap-3.5 p-4 group">
                <Avatar
                  name={player.fullName}
                  src={player.avatarUrl}
                  jerseyNumber={player.jerseyNumber}
                  size="lg"
                  showNumber
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-space font-black text-sm text-slate-900 dark:text-white truncate group-hover:text-emerald-500 transition-colors">
                    {player.fullName}
                  </h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-space truncate">
                    @{player.username}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    {player.jerseyNumber && (
                      <Badge variant="gold" size="sm">
                        #{player.jerseyNumber}
                      </Badge>
                    )}
                    <Badge
                      variant={player.role === 'ADMIN' ? 'primary' : 'neutral'}
                      size="sm"
                    >
                      {player.role === 'ADMIN' ? 'Admin' : 'Cầu thủ'}
                    </Badge>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
