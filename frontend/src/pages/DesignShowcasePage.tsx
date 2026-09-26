import React, { useState } from 'react';
import {
  Button,
  Badge,
  Card,
  Input,
  Select,
  Avatar,
  ConnectionBanner,
  IconButton,
  Modal,
} from '../ui';
import { ScoreBoard } from '../components/match/ScoreBoard';
import { StatusBadge } from '../components/match/StatusBadge';
import { SpinWheel } from '../components/spin/SpinWheel';
import { FootballPitch } from '../components/lineup/FootballPitch';
import { FormationPreset } from '../components/lineup/FormationPreset';
import { MetricBentoStrip } from '../components/leaderboard/MetricBentoStrip';
import { LeaderboardTable } from '../components/leaderboard/LeaderboardTable';
import { MatchLineup, MatchStatus, Position, Team, User } from '../types';
import {
  FORMATION_PRESETS_7V7,
  TEAM_A_COLOR,
  TEAM_A_NAME,
  TEAM_B_COLOR,
  TEAM_B_NAME,
} from '../utils/constants';
import toast from 'react-hot-toast';

export const DesignShowcasePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'components' | 'pitch' | 'wheel' | 'match'>('all');
  const [btnLoading, setBtnLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState(0);
  const [activePitchTeam, setActivePitchTeam] = useState<Team>('A');

  // Spin wheel test state
  const [isSpinning, setIsSpinning] = useState(false);

  // Mock Users
  const sampleUserA: User = {
    id: 'u-1',
    username: 'quangbui',
    fullName: 'Quang Bùi',
    jerseyNumber: 7,
    role: 'PLAYER',
    status: 'ACTIVE',
    createdAt: '2026-09-01',
  };

  const sampleUserB: User = {
    id: 'u-2',
    username: 'minhduc',
    fullName: 'Minh Đức',
    jerseyNumber: 10,
    role: 'ADMIN',
    status: 'ACTIVE',
    createdAt: '2026-09-01',
  };

  const samplePlayers: User[] = [
    sampleUserA,
    sampleUserB,
    { id: 'u-3', username: 'tuananh', fullName: 'Tuấn Anh', jerseyNumber: 11, role: 'PLAYER', status: 'ACTIVE', createdAt: '' },
    { id: 'u-4', username: 'hailong', fullName: 'Hải Long', jerseyNumber: 6, role: 'PLAYER', status: 'ACTIVE', createdAt: '' },
    { id: 'u-5', username: 'vanlam', fullName: 'Văn Lâm', jerseyNumber: 1, role: 'PLAYER', status: 'ACTIVE', createdAt: '' },
    { id: 'u-6', username: 'tiendat', fullName: 'Tiến Đạt', jerseyNumber: 9, role: 'PLAYER', status: 'ACTIVE', createdAt: '' },
    { id: 'u-7', username: 'hoangnam', fullName: 'Hoàng Nam', jerseyNumber: 14, role: 'PLAYER', status: 'ACTIVE', createdAt: '' },
  ];

  // Mock Lineup
  const [mockLineups, setMockLineups] = useState<MatchLineup[]>(() => {
    const preset = FORMATION_PRESETS_7V7[0];
    return samplePlayers.slice(0, 7).map((p, idx) => ({
      id: `lineup-${p.id}`,
      matchId: 'm-1',
      user: p,
      team: 'A',
      positionLabel: preset.positions[idx].position as Position,
      xPercent: preset.positions[idx].x,
      yPercent: preset.positions[idx].y,
      jerseyNumber: p.jerseyNumber,
    }));
  });

  const handleApplyFormation = (idx: number) => {
    setSelectedFormation(idx);
    const preset = FORMATION_PRESETS_7V7[idx];
    setMockLineups(
      samplePlayers.slice(0, 7).map((p, pIdx) => ({
        id: `lineup-${p.id}`,
        matchId: 'm-1',
        user: p,
        team: activePitchTeam,
        positionLabel: preset.positions[pIdx].position as Position,
        xPercent: preset.positions[pIdx].x,
        yPercent: preset.positions[pIdx].y,
        jerseyNumber: p.jerseyNumber,
      }))
    );
    toast.success(`Đã áp dụng sơ đồ ${preset.name}`);
  };

  const handleUpdatePosition = (userId: string, x: number, y: number) => {
    setMockLineups((prev) =>
      prev.map((l) => (l.user.id === userId ? { ...l, xPercent: x, yPercent: y } : l))
    );
  };

  const handleUpdatePosLabel = (userId: string, pos: Position) => {
    setMockLineups((prev) =>
      prev.map((l) => (l.user.id === userId ? { ...l, positionLabel: pos } : l))
    );
  };

  // Mock Leaderboard Items
  const sampleLeaderboard = [
    { rank: 1, user: sampleUserA, totalGoals: 18, totalAssists: 8, totalWins: 12, totalMatches: 14, winRate: 85.7, updatedAt: '2026-09-27' },
    { rank: 2, user: sampleUserB, totalGoals: 14, totalAssists: 15, totalWins: 11, totalMatches: 14, winRate: 78.6, updatedAt: '2026-09-27' },
    { rank: 3, user: samplePlayers[2], totalGoals: 11, totalAssists: 6, totalWins: 9, totalMatches: 13, winRate: 69.2, updatedAt: '2026-09-27' },
    { rank: 4, user: samplePlayers[3], totalGoals: 8, totalAssists: 12, totalWins: 8, totalMatches: 12, winRate: 66.7, updatedAt: '2026-09-27' },
    { rank: 5, user: samplePlayers[5], totalGoals: 7, totalAssists: 4, totalWins: 7, totalMatches: 11, winRate: 63.6, updatedAt: '2026-09-27' },
  ];

  const statuses: MatchStatus[] = [
    'PENDING',
    'CAPTAIN_SPINNING',
    'CAPTAIN_PICKING',
    'LINEUP_SETTING',
    'IN_PROGRESS',
    'COMPLETED',
  ];

  return (
    <div className="flex flex-col gap-10 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-50 via-white to-blue-50 border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="px-3 py-1 rounded-full bg-red-100 border border-red-200 text-red-700 font-mono text-xs font-bold uppercase tracking-wider">
                Bản duyệt thiết kế mới
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-800 font-mono text-xs font-bold uppercase tracking-wider">
                Giao diện sáng · Light Mode
              </span>
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
              Bảng mẫu Giao diện & Thư viện UI Components
            </h1>
            <p className="text-sm text-slate-600 mt-1.5 max-w-2xl leading-relaxed">
              Giao diện thể thao sáng sủa, sạch sẽ, chuẩn phong cách châu Âu (UEFA / FotMob). Phối màu áo đấu Tây Ban Nha (Đỏ) & Pháp (Xanh) cùng trải nghiệm sa bàn 7v7 chân thực.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-xs">
            {[
              { key: 'all', label: 'Tất cả' },
              { key: 'components', label: 'Linh kiện UI' },
              { key: 'match', label: 'Bảng tỉ số & Bento' },
              { key: 'pitch', label: 'Sa bàn 7v7' },
              { key: 'wheel', label: 'Vòng quay' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer ${
                  activeTab === tab.key
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 1: COLOR PALETTE & TOKENS */}
      {(activeTab === 'all' || activeTab === 'components') && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h2 className="font-heading font-black text-xl text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-red-600">palette</span>
              Bảng màu chính & Màu áo đấu Câu Lạc Bộ
            </h2>
            <span className="text-xs font-mono text-slate-500">Chuẩn Light Mode</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col gap-2.5 shadow-xs">
              <div className="w-full h-12 rounded-xl bg-[#DC2626] shadow-xs flex items-center justify-center text-white font-mono font-bold text-xs">
                #DC2626
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">{TEAM_A_NAME}</h4>
                <p className="text-[11px] text-slate-500 font-mono">Áo Đỏ · Chủ lực</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col gap-2.5 shadow-xs">
              <div className="w-full h-12 rounded-xl bg-[#2563EB] shadow-xs flex items-center justify-center text-white font-mono font-bold text-xs">
                #2563EB
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">{TEAM_B_NAME}</h4>
                <p className="text-[11px] text-slate-500 font-mono">Áo Xanh · Đối đầu</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col gap-2.5 shadow-xs">
              <div className="w-full h-12 rounded-xl bg-[#F59E0B] shadow-xs flex items-center justify-center text-slate-950 font-mono font-bold text-xs">
                #F59E0B
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Thủ môn / Gold</h4>
                <p className="text-[11px] text-slate-500 font-mono">Áo Vàng · MVP · Cúp</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col gap-2.5 shadow-xs">
              <div className="w-full h-12 rounded-xl bg-[#10B981] shadow-xs flex items-center justify-center text-white font-mono font-bold text-xs">
                #10B981
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Thắng trận / Live</h4>
                <p className="text-[11px] text-slate-500 font-mono">Trực tiếp · Hoàn thành</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col gap-2.5 shadow-xs">
              <div className="w-full h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-mono font-bold text-xs">
                #F1F5F9
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Slate Surface</h4>
                <p className="text-[11px] text-slate-500 font-mono">Nền khối · Nút phụ</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col gap-2.5 shadow-xs">
              <div className="w-full h-12 rounded-xl bg-[#F8FAFC] border border-slate-300 flex items-center justify-center text-slate-600 font-mono font-bold text-xs">
                #F8FAFC
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Light Background</h4>
                <p className="text-[11px] text-slate-500 font-mono">Nền trang sạch sẽ</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 2: UI COMPONENTS SHOWCASE */}
      {(activeTab === 'all' || activeTab === 'components') && (
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h2 className="font-heading font-black text-xl text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500">widgets</span>
              Các linh kiện dùng chung (Shared Reusable UI - src/ui/)
            </h2>
            <span className="text-xs font-mono text-slate-500">Đồng bộ mọi trang</span>
          </div>

          {/* Buttons Matrix */}
          <Card elevation="level1" className="flex flex-col gap-4">
            <h3 className="font-heading font-bold text-base text-slate-900">1. Nút bấm (Button Variants & States)</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" leftIcon="sports_soccer">
                Primary (Đỏ Tây Ban Nha)
              </Button>
              <Button variant="secondary" leftIcon="groups">
                Secondary (Xanh Pháp)
              </Button>
              <Button variant="gold" leftIcon="military_tech">
                Gold (Vô địch / MVP)
              </Button>
              <Button variant="surface" leftIcon="settings">
                Surface (Mặc định)
              </Button>
              <Button variant="outline" leftIcon="tune">
                Outline
              </Button>
              <Button variant="danger" leftIcon="delete">
                Danger
              </Button>
              <Button variant="ghost" leftIcon="arrow_back">
                Ghost
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
              <Button size="sm" variant="primary">Size SM</Button>
              <Button size="md" variant="primary">Size MD (Chuẩn)</Button>
              <Button size="lg" variant="primary">Size LG (Nổi bật)</Button>
              <Button
                variant="surface"
                isLoading={btnLoading}
                onClick={() => {
                  setBtnLoading(true);
                  setTimeout(() => setBtnLoading(false), 2000);
                }}
              >
                Bấm để thử Loading
              </Button>
              <IconButton icon="favorite" ariaLabel="Thích" variant="surface" />
              <IconButton icon="share" ariaLabel="Chia sẻ" variant="primary" />
              <IconButton icon="delete" ariaLabel="Xóa" variant="danger" />
            </div>
          </Card>

          {/* Badges & Tags */}
          <Card elevation="level1" className="flex flex-col gap-4">
            <h3 className="font-heading font-bold text-base text-slate-900">2. Huy hiệu & Thẻ trạng thái (Badges & Statuses)</h3>
            <div className="flex flex-wrap items-center gap-3">
              {statuses.map((s) => (
                <StatusBadge key={s} status={s} />
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
              <Badge variant="teamA" icon="shield">Đội A - Tây Ban Nha</Badge>
              <Badge variant="teamB" icon="shield">Đội B - Pháp</Badge>
              <Badge variant="gold" icon="star">MVP Trận đấu</Badge>
              <Badge variant="success" icon="check_circle">Đã duyệt</Badge>
              <Badge variant="cyan" icon="sports_soccer">Tiền đạo ST</Badge>
              <Badge variant="neutral">Số áo #10</Badge>
              <ConnectionBanner />
            </div>
          </Card>

          {/* Avatars & Forms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Avatars */}
            <Card elevation="level1" className="flex flex-col gap-4">
              <h3 className="font-heading font-bold text-base text-slate-900">3. Avatar Cầu thủ (Initials + Số áo)</h3>
              <p className="text-xs text-slate-500 font-mono">
                Chữ cái đầu tên cầu thủ, phối màu thể thao kèm huy hiệu số áo đấu
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Avatar name="Quang Bùi" jerseyNumber={7} size="sm" showNumber />
                <Avatar name="Minh Đức" jerseyNumber={10} size="md" showNumber />
                <Avatar name="Tuấn Anh" jerseyNumber={11} size="lg" showNumber />
                <Avatar name="Hải Long" jerseyNumber={6} size="xl" showNumber />
                <Avatar name="Văn Lâm" jerseyNumber={1} size="lg" showNumber bgColor="#F59E0B" />
              </div>
            </Card>

            {/* Form Controls */}
            <Card elevation="level1" className="flex flex-col gap-4">
              <h3 className="font-heading font-bold text-base text-slate-900">4. Ô nhập liệu (Input & Select)</h3>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Họ và tên" placeholder="VD: Quang Bùi" leftIcon="person" defaultValue="Quang Bùi" />
                <Input label="Số áo thi đấu" type="number" placeholder="7" leftIcon="tag" defaultValue="7" />
              </div>
              <Select
                label="Chọn sơ đồ chiến thuật"
                options={[
                  { value: '2-3-1', label: '2-3-1 (Cân bằng & Phổ biến nhất)' },
                  { value: '3-2-1', label: '3-2-1 (Phòng ngự phản công)' },
                  { value: '2-1-2-1', label: '2-1-2-1 (Kiểm soát tuyến giữa)' },
                ]}
              />
            </Card>
          </div>
        </section>
      )}

      {/* SECTION 3: MATCH SCOREBOARD & BENTO DEMO */}
      {(activeTab === 'all' || activeTab === 'match') && (
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h2 className="font-heading font-black text-xl text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">scoreboard</span>
              Bảng điểm Trực tiếp & Khối thống kê Bento
            </h2>
            <span className="text-xs font-mono text-slate-500">Mẫu trận đấu thực tế</span>
          </div>

          <ScoreBoard
            scoreTeamA={4}
            scoreTeamB={2}
            hostAName="Quang Bùi"
            hostBName="Minh Đức"
            isLive
          />

          <MetricBentoStrip
            topScorer={sampleLeaderboard[0]}
            topAssister={sampleLeaderboard[1]}
            topWinner={sampleLeaderboard[0]}
          />
        </section>
      )}

      {/* SECTION 4: TACTICAL 7V7 PITCH DEMO */}
      {(activeTab === 'all' || activeTab === 'pitch') && (
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h2 className="font-heading font-black text-xl text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600">sports</span>
              Sa bàn Chiến thuật 7v7 (Interactive Tactical Pitch)
            </h2>
            <span className="text-xs font-mono text-emerald-600 font-bold">Có thể kéo thả thử trực tiếp</span>
          </div>

          <Card elevation="level1" className="flex flex-col gap-4">
            {/* Pitch toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              {/* Team switch */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setActivePitchTeam('A')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    activePitchTeam === 'A'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Đội A: {TEAM_A_NAME} (Đỏ)
                </button>
                <button
                  type="button"
                  onClick={() => setActivePitchTeam('B')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    activePitchTeam === 'B'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Đội B: {TEAM_B_NAME} (Xanh)
                </button>
              </div>

              {/* Formations */}
              <FormationPreset
                activeFormation={selectedFormation}
                onSelectFormation={handleApplyFormation}
              />

              <Button
                size="sm"
                variant="primary"
                leftIcon="save"
                onClick={() => toast.success('Đã lưu sơ đồ đội hình!')}
              >
                Lưu sơ đồ
              </Button>
            </div>

            {/* Pitch Canvas */}
            <FootballPitch
              lineups={mockLineups}
              activeTeam={activePitchTeam}
              isEditable
              onUpdatePosition={handleUpdatePosition}
              onUpdatePositionLabel={handleUpdatePosLabel}
            />
          </Card>
        </section>
      )}

      {/* SECTION 5: WHEEL SPIN DEMO */}
      {(activeTab === 'all' || activeTab === 'wheel') && (
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h2 className="font-heading font-black text-xl text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500">casino</span>
              Vòng quay Bánh xe chọn Đội trưởng (Live Spin Wheel)
            </h2>
            <span className="text-xs font-mono text-slate-500">Canvas xoay giảm tốc & pháo hoa</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-6 flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-xs">
              <SpinWheel
                hostA={sampleUserA}
                hostB={sampleUserB}
                winner={sampleUserA}
                isSpinning={isSpinning}
                durationMs={4000}
                onSpinComplete={() => {
                  setIsSpinning(false);
                  toast.success('🎉 Đội trưởng Quang Bùi thắng quyền chọn trước!');
                }}
              />
            </div>

            <div className="md:col-span-6 flex flex-col gap-4">
              <Card elevation="level1" className="flex flex-col gap-4">
                <h3 className="font-heading font-black text-lg text-slate-900">
                  Thử nghiệm quay số trực tiếp
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Bánh xe 10 nan xen kẽ màu áo Đỏ ({TEAM_A_NAME}) và Xanh ({TEAM_B_NAME}). Thuật toán xác định người thắng dựa trên seed ngẫu nhiên từ máy chủ để đồng bộ tuyệt đối giữa tất cả người xem.
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <Button
                    variant="primary"
                    size="lg"
                    isLoading={isSpinning}
                    onClick={() => setIsSpinning(true)}
                    leftIcon="casino"
                  >
                    {isSpinning ? 'Đang quay bánh xe...' : 'Bấm để Quay Thử Ngay'}
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 6: LEADERBOARD TABLE PREVIEW */}
      {(activeTab === 'all' || activeTab === 'components') && (
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h2 className="font-heading font-black text-xl text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500">leaderboard</span>
              Bảng xếp hạng Mẫu
            </h2>
          </div>

          <LeaderboardTable
            items={sampleLeaderboard}
            activeFilter="goals"
            onFilterChange={(f) => toast(`Chuyển sang lọc theo: ${f}`)}
          />
        </section>
      )}

      {/* Modal Preview */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Xem trước Hộp thoại (Modal Dialog)">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-600">
            Đây là mẫu hộp thoại pop-up tiêu chuẩn với nền trắng sáng, viền sắc nét và nút bấm tiện dụng.
          </p>
          <Input label="Tiêu đề trận đấu" placeholder="Nhập tiêu đề..." defaultValue="Trận Siêu Cúp CLB" />
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button variant="primary" onClick={() => { setIsModalOpen(false); toast.success('Thao tác thành công!'); }}>Xác nhận</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
