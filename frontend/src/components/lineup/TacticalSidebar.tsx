import React, { useState } from 'react';
import { Match, MatchLineup, MatchParticipant, Position, Team } from '../../types';
import { Avatar, Badge, Button } from '../../ui';
import { FORMATION_PRESETS_7V7 } from '../../utils/constants';

interface TacticalSidebarProps {
  match: Match;
  activeTeam: Team;
  teamLabel: string;
  isEditable: boolean;
  lineups: MatchLineup[];
  benchPlayers: MatchParticipant[];
  selectedUserId: string | null;
  activePresetIndex?: number;
  pitchTheme: 'emerald' | 'midnight' | 'charcoal' | 'daylight';
  showNames: boolean;
  showNumbers: boolean;
  showPositions: boolean;
  showZones: boolean;
  onSelectUser: (userId: string | null) => void;
  onSelectFormation: (index: number) => void;
  onUpdatePositionLabel: (userId: string, pos: Position) => void;
  onBenchPlayer: (userId: string) => void;
  onStartPlayer: (userId: string) => void;
  onChangePitchTheme: (theme: 'emerald' | 'midnight' | 'charcoal' | 'daylight') => void;
  onToggleNames: () => void;
  onToggleNumbers: () => void;
  onTogglePositions: () => void;
  onToggleZones: () => void;
  onExportPng: () => void;
  isExportingPng?: boolean;
}

const POSITIONS_LIST: Position[] = [
  'GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LM', 'RM', 'ST', 'LW', 'RW'
];

export const TacticalSidebar: React.FC<TacticalSidebarProps> = ({
  match,
  activeTeam,
  teamLabel,
  isEditable,
  lineups,
  benchPlayers,
  selectedUserId,
  activePresetIndex,
  pitchTheme,
  showNames,
  showNumbers,
  showPositions,
  showZones,
  onSelectUser,
  onSelectFormation,
  onUpdatePositionLabel,
  onBenchPlayer,
  onStartPlayer,
  onChangePitchTheme,
  onToggleNames,
  onToggleNumbers,
  onTogglePositions,
  onToggleZones,
  onExportPng,
  isExportingPng = false,
}) => {
  const [activeTab, setActiveTab] = useState<'squad' | 'tactics' | 'visuals' | 'export'>('squad');

  const currentStarters = lineups.filter((l) => l.team === activeTeam);
  const selectedPlayer = currentStarters.find((p) => p.user.id === selectedUserId);

  return (
    <aside className="w-full lg:w-88 shrink-0 flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden font-space text-slate-800 dark:text-slate-100">
      {/* Sidebar Header & Tab Navigation */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/60">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">
            <span className="material-symbols-outlined text-emerald-500 text-base">tune</span>
            <span>Bảng Điều Khiển</span>
          </div>
          <Badge variant={activeTeam === 'A' ? 'teamA' : 'teamB'} size="sm">
            {teamLabel}
          </Badge>
        </div>

        {/* Minimalist Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80">
          <button
            type="button"
            onClick={() => setActiveTab('squad')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
              activeTab === 'squad'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/50'
            }`}
          >
            <span className="material-symbols-outlined text-base">groups</span>
            <span>Đội hình</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tactics')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
              activeTab === 'tactics'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/50'
            }`}
          >
            <span className="material-symbols-outlined text-base">tactic</span>
            <span>Sơ đồ</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('visuals')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
              activeTab === 'visuals'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/50'
            }`}
          >
            <span className="material-symbols-outlined text-base">visibility</span>
            <span>Hiển thị</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
              activeTab === 'export'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/50'
            }`}
          >
            <span className="material-symbols-outlined text-base">ios_share</span>
            <span>Xuất ảnh</span>
          </button>
        </div>
      </div>

      {/* Tab Contents Scrollable Area */}
      <div className="p-4 flex-1 overflow-y-auto max-h-[580px] scrollbar-thin scrollbar-thumb-slate-700 flex flex-col gap-4">
        {/* ========================================================= */}
        {/* TAB 1: SQUAD (ĐỘI HÌNH & VỊ TRÍ) */}
        {/* ========================================================= */}
        {activeTab === 'squad' && (
          <div className="flex flex-col gap-4">
            {/* Selected Player Inspector */}
            {selectedPlayer && isEditable && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 animate-in fade-in duration-200">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Avatar
                      name={selectedPlayer.user.fullName}
                      jerseyNumber={selectedPlayer.user.jerseyNumber}
                      size="sm"
                      showNumber
                    />
                    <div>
                      <div className="text-xs font-bold text-white leading-tight">
                        {selectedPlayer.user.fullName}
                      </div>
                      <div className="text-[10px] text-amber-400 font-mono">
                        Vị trí hiện tại: <strong>{selectedPlayer.positionLabel || 'Chưa đặt'}</strong>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectUser(null)}
                    className="text-slate-400 hover:text-white p-1"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>

                <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Đổi vai trò thi đấu:
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {POSITIONS_LIST.map((pos) => (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => onUpdatePositionLabel(selectedPlayer.user.id, pos)}
                      className={`px-1.5 py-1 rounded-lg text-[10px] font-bold font-mono transition-colors cursor-pointer border ${
                        selectedPlayer.positionLabel === pos
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>

                <div className="mt-2.5 pt-2 border-t border-amber-500/20 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Không muốn đá chính?</span>
                  <button
                    type="button"
                    onClick={() => onBenchPlayer(selectedPlayer.user.id)}
                    className="flex items-center gap-1 text-[11px] font-bold text-rose-400 hover:text-rose-300 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">chair</span>
                    Cho ra dự bị
                  </button>
                </div>
              </div>
            )}

            {/* Starters List */}
            <div>
              <div className="flex items-center justify-between text-xs font-black uppercase text-slate-300 mb-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Đá chính ({currentStarters.length}/7)
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {currentStarters.length === 7 ? 'Đã đủ 7 người' : `Còn thiếu ${7 - currentStarters.length}`}
                </span>
              </div>

              {currentStarters.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 text-center text-xs text-slate-500 italic">
                  Chưa có cầu thủ đá chính. Hãy chọn sơ đồ mẫu hoặc kéo cầu thủ từ hàng ghế dự bị vào sân.
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {currentStarters.map((player) => {
                    const isSelected = selectedUserId === player.user.id;
                    const isCaptain = (match.participants ?? []).some(
                      (p) => p.user.id === player.user.id && p.isHost
                    );
                    return (
                      <div
                        key={player.user.id}
                        onClick={() => onSelectUser(player.user.id)}
                        className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer select-none ${
                          isSelected
                            ? 'bg-slate-800 border-amber-400 shadow-md ring-1 ring-amber-400/40'
                            : 'bg-slate-800/60 hover:bg-slate-800/90 border-slate-750'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 text-amber-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                            {player.jerseyNumber ?? player.user.jerseyNumber ?? '--'}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-white truncate max-w-[110px]">
                                {player.user.fullName}
                              </span>
                              {isCaptain && (
                                <span className="text-[9px] font-black text-amber-400 font-mono">
                                  [C]
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono uppercase">
                              Vị trí: <strong className="text-emerald-400">{player.positionLabel || 'CM'}</strong>
                            </span>
                          </div>
                        </div>

                        {isEditable && (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onBenchPlayer(player.user.id);
                              }}
                              className="p-1 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                              title="Đưa ra ghế dự bị"
                            >
                              <span className="material-symbols-outlined text-sm">chair</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bench / Reserves Section */}
            <div>
              <div className="flex items-center justify-between text-xs font-black uppercase text-slate-300 mb-2">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-amber-400">chair</span>
                  Dự bị ({benchPlayers.length})
                </span>
                <span className="text-[10px] font-mono text-slate-400">Kéo vào sân</span>
              </div>

              {benchPlayers.length === 0 ? (
                <div className="p-3 rounded-2xl bg-slate-800/30 border border-slate-800 text-center text-xs text-slate-500 italic">
                  Không còn cầu thủ nào ở hàng dự bị.
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {benchPlayers.map((p) => (
                    <div
                      key={p.user.id}
                      draggable={isEditable}
                      onDragStart={(e) => {
                        if (!isEditable) return;
                        e.dataTransfer.setData(
                          'application/json',
                          JSON.stringify({ userId: p.user.id, from: 'bench' })
                        );
                      }}
                      className={`flex items-center justify-between p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800/70 border border-slate-800 transition-all select-none ${
                        isEditable ? 'cursor-grab active:cursor-grabbing hover:border-slate-700' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar
                          name={p.user.fullName}
                          jerseyNumber={p.user.jerseyNumber}
                          size="sm"
                          showNumber
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-200 truncate max-w-[120px]">
                            {p.user.fullName}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            #{p.user.jerseyNumber ?? '--'} • Sẵn sàng
                          </div>
                        </div>
                      </div>

                      {isEditable && (
                        <button
                          type="button"
                          onClick={() => onStartPlayer(p.user.id)}
                          className="px-2 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-white text-[10px] font-bold font-space transition-colors cursor-pointer flex items-center gap-1"
                          title="Đưa vào sân"
                        >
                          <span className="material-symbols-outlined text-xs">add</span>
                          Vào sân
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: TACTICS & FORMATIONS (CHIẾN THUẬT & SƠ ĐỒ) */}
        {/* ========================================================= */}
        {activeTab === 'tactics' && (
          <div className="flex flex-col gap-3.5">
            <div>
              <div className="text-xs font-black uppercase text-slate-300 mb-1">
                Sơ Đồ Mẫu 7v7 Tiêu Chuẩn
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Bấm vào sơ đồ để tự động dàn trải 7 cầu thủ đá chính theo cấu trúc chiến thuật chuẩn.
              </p>

              <div className="grid grid-cols-1 gap-2">
                {FORMATION_PRESETS_7V7.map((preset, idx) => {
                  const isActive = activePresetIndex === idx;
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => onSelectFormation(idx)}
                      disabled={!isEditable}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                        isActive
                          ? 'bg-emerald-500/15 border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
                          : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 hover:border-slate-600'
                      } ${!isEditable ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black font-space text-white">
                          {preset.name}
                        </span>
                        {isActive && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 uppercase">
                            Đang dùng
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono leading-tight">
                        {preset.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tactical Style Notes */}
            <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 flex flex-col gap-2">
              <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">tips_and_updates</span>
                Gợi ý chiến thuật sân 7
              </span>
              <ul className="text-[11px] text-slate-300 space-y-1.5 list-disc list-inside">
                <li>
                  <strong>2-3-1</strong>: Dành cho đội thích kiểm soát bóng, tiền vệ biên hỗ trợ cả công lẫn thủ.
                </li>
                <li>
                  <strong>3-2-1</strong>: Phòng thủ phản công khi gặp đối thủ mạnh, hạn chế khoảng trống 2 nách.
                </li>
                <li>
                  <strong>1-4-1</strong>: Phù hợp khi cần lội ngược dòng, dâng cao vây bắt pressing toàn sân.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: VISUALS (TÙY CHỌN HIỂN THỊ SA BÀN) */}
        {/* ========================================================= */}
        {activeTab === 'visuals' && (
          <div className="flex flex-col gap-4">
            {/* Pitch Theme Selector */}
            <div>
              <div className="text-xs font-black uppercase text-slate-300 mb-2">
                Mặt sân thi đấu
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onChangePitchTheme('emerald')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    pitchTheme === 'emerald'
                      ? 'bg-emerald-600/20 border-emerald-500 ring-2 ring-emerald-500/30 text-emerald-500 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-600 border border-emerald-400 shadow-xs" />
                  <span className="text-[11px] font-bold">Sân cỏ xanh</span>
                </button>

                <button
                  type="button"
                  onClick={() => onChangePitchTheme('daylight')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    pitchTheme === 'daylight'
                      ? 'bg-green-500/20 border-green-500 ring-2 ring-green-500/30 text-green-600 dark:text-green-300 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-green-400 to-emerald-500 border border-green-300 shadow-xs" />
                  <span className="text-[11px] font-bold">Sân ban ngày</span>
                </button>

                <button
                  type="button"
                  onClick={() => onChangePitchTheme('midnight')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    pitchTheme === 'midnight'
                      ? 'bg-cyan-500/20 border-cyan-400 ring-2 ring-cyan-400/30 text-cyan-500 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-slate-950 border border-cyan-400 shadow-xs" />
                  <span className="text-[11px] font-bold">Đêm Neon</span>
                </button>

                <button
                  type="button"
                  onClick={() => onChangePitchTheme('charcoal')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    pitchTheme === 'charcoal'
                      ? 'bg-slate-700/30 border-slate-400 ring-2 ring-slate-400/30 text-slate-800 dark:text-white font-bold'
                      : 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-500 shadow-xs" />
                  <span className="text-[11px] font-bold">Bảng đen</span>
                </button>
              </div>
            </div>

            {/* Toggle Elements */}
            <div>
              <div className="text-xs font-black uppercase text-slate-300 mb-2">
                Chi tiết hiển thị trên sân
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-750 cursor-pointer">
                  <span className="text-xs text-slate-200 font-bold">Tên cầu thủ</span>
                  <input
                    type="checkbox"
                    checked={showNames}
                    onChange={onToggleNames}
                    className="w-4 h-4 rounded text-emerald-500 accent-emerald-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-750 cursor-pointer">
                  <span className="text-xs text-slate-200 font-bold">Số áo thi đấu</span>
                  <input
                    type="checkbox"
                    checked={showNumbers}
                    onChange={onToggleNumbers}
                    className="w-4 h-4 rounded text-emerald-500 accent-emerald-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-750 cursor-pointer">
                  <span className="text-xs text-slate-200 font-bold">Vị trí thi đấu (GK, CB, ST...)</span>
                  <input
                    type="checkbox"
                    checked={showPositions}
                    onChange={onTogglePositions}
                    className="w-4 h-4 rounded text-emerald-500 accent-emerald-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-750 cursor-pointer">
                  <span className="text-xs text-slate-200 font-bold">Lưới phân khu chiến thuật</span>
                  <input
                    type="checkbox"
                    checked={showZones}
                    onChange={onToggleZones}
                    className="w-4 h-4 rounded text-emerald-500 accent-emerald-500 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: EXPORT (XUẤT ẢNH PNG) */}
        {/* ========================================================= */}
        {activeTab === 'export' && (
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <span className="material-symbols-outlined text-2xl">photo_camera</span>
              </div>
              <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                Xuất Ảnh Sơ Đồ PNG
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Tải ảnh sa bàn độ phân giải cao 2K sắc nét bao gồm tên đội, danh sách 7 người đá chính và hàng ghế dự bị để chia sẻ.
              </p>
            </div>

            <div className="flex flex-col gap-2 text-xs font-mono text-slate-400 bg-slate-800/50 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between">
                <span>Định dạng:</span>
                <span className="text-white font-bold">PNG Lossless</span>
              </div>
              <div className="flex justify-between">
                <span>Tỉ lệ render:</span>
                <span className="text-white font-bold">2.0x Ultra HD</span>
              </div>
              <div className="flex justify-between">
                <span>Khung hình:</span>
                <span className="text-white font-bold">Kèm Banner & Hàng dự bị</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              leftIcon="download"
              isLoading={isExportingPng}
              onClick={onExportPng}
              className="w-full font-space font-bold shadow-lg shadow-emerald-500/20"
            >
              Tải Ảnh Sơ Đồ Ngay
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
};
