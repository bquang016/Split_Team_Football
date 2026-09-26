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
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              Đội hình CLB
            </span>
            <span className="text-xs text-slate-400 font-medium">Saigon Sunday League</span>
          </div>
          <h1 className="font-headline font-black text-2xl sm:text-3xl text-slate-900 mt-1">
            Danh Sách Cầu Thủ
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tổng cộng {players.length} cầu thủ chính thức và ban cán sự đang hoạt động.
          </p>
        </div>

        <div className="w-full sm:w-72">
          <Input
            placeholder="Tìm theo tên hoặc số áo..."
            leftIcon="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-sm text-slate-500">
          <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Đang tải danh sách cầu thủ...
        </div>
      ) : filteredPlayers.length === 0 ? (
        <Card elevation="level1" className="py-12 text-center text-sm text-slate-400 italic">
          Không tìm thấy cầu thủ nào
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPlayers.map((player) => (
            <Link key={player.id} to={`/players/${player.id}`}>
              <Card hoverable className="flex items-center gap-3.5 p-4 group">
                <Avatar
                  name={player.fullName}
                  jerseyNumber={player.jerseyNumber}
                  size="lg"
                  showNumber
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-headline font-bold text-sm text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                    {player.fullName}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono truncate">
                    @{player.username}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    {player.jerseyNumber && (
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                        #{player.jerseyNumber}
                      </span>
                    )}
                    {player.role === 'ADMIN' && (
                      <Badge variant="teamA" size="sm">Admin</Badge>
                    )}
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
