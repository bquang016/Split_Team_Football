import { MatchStatus, Position } from '../types';

export const APP_NAME = 'ChimMocCanh FootballSquad';

export const TEAM_A_NAME = 'Tây Ban Nha';
export const TEAM_A_COLOR = '#DC2626';

export const TEAM_B_NAME = 'Pháp';
export const TEAM_B_COLOR = '#2563EB';

export const GK_COLOR = '#F59E0B';

export const MATCH_STATUS_MAP: Record<MatchStatus, { label: string; color: string; bg: string; border: string }> = {
  PENDING: {
    label: 'Chờ điểm danh',
    color: '#475569',
    bg: '#F1F5F9',
    border: '#CBD5E1',
  },
  JERSEY_SELECTION: {
    label: 'Chọn áo đấu',
    color: '#0284C7',
    bg: '#F0F9FF',
    border: '#BAE6FD',
  },
  PLAYER_PICKING: {
    label: 'Đang chia đội',
    color: '#D97706',
    bg: '#FFFBEB',
    border: '#FDE68A',
  },
  TRADE_WINDOW: {
    label: 'Chuyển nhượng',
    color: '#8B5CF6',
    bg: '#F5F3FF',
    border: '#DDD6FE',
  },
  IN_PROGRESS: {
    label: 'Trận đang đá',
    color: '#DC2626',
    bg: '#FEF2F2',
    border: '#FECACA',
  },
  COMPLETED: {
    label: 'Đã kết thúc',
    color: '#16A34A',
    bg: '#F0FDF4',
    border: '#BBF7D0',
  },
  CANCELLED: {
    label: 'Đã hủy',
    color: '#DC2626',
    bg: '#FEF2F2',
    border: '#FECACA',
  },
};

export const FORMATION_PRESETS_7V7 = [
  {
    name: '2-3-1 (Cân bằng)',
    desc: '2 Hậu vệ · 3 Tiền vệ · 1 Tiền đạo cắm',
    positions: [
      { position: 'GK', x: 50, y: 88 },
      { position: 'CB', x: 30, y: 70 },
      { position: 'CB', x: 70, y: 70 },
      { position: 'LM', x: 18, y: 46 },
      { position: 'CM', x: 50, y: 46 },
      { position: 'RM', x: 82, y: 46 },
      { position: 'ST', x: 50, y: 20 },
    ],
  },
  {
    name: '3-2-1 (Phòng ngự chặt)',
    desc: '3 Hậu vệ · 2 Tiền vệ trung tâm · 1 Tiền đạo',
    positions: [
      { position: 'GK', x: 50, y: 88 },
      { position: 'LB', x: 20, y: 72 },
      { position: 'CB', x: 50, y: 72 },
      { position: 'RB', x: 80, y: 72 },
      { position: 'CM', x: 35, y: 46 },
      { position: 'CM', x: 65, y: 46 },
      { position: 'ST', x: 50, y: 20 },
    ],
  },
  {
    name: '2-1-2-1 (Kiểm soát bóng)',
    desc: '2 Hậu vệ · 1 Mỏ neo CDM · 2 Hộ công · 1 Tiền đạo',
    positions: [
      { position: 'GK', x: 50, y: 88 },
      { position: 'CB', x: 32, y: 72 },
      { position: 'CB', x: 68, y: 72 },
      { position: 'CDM', x: 50, y: 56 },
      { position: 'CAM', x: 32, y: 36 },
      { position: 'CAM', x: 68, y: 36 },
      { position: 'ST', x: 50, y: 18 },
    ],
  },
  {
    name: '1-4-1 (Tấn công áp đảo)',
    desc: '1 Trung vệ dập · 4 Tiền vệ giăng ngang · 1 Tiền đạo',
    positions: [
      { position: 'GK', x: 50, y: 88 },
      { position: 'CB', x: 50, y: 70 },
      { position: 'LM', x: 18, y: 46 },
      { position: 'CM', x: 38, y: 46 },
      { position: 'CM', x: 62, y: 46 },
      { position: 'RM', x: 82, y: 46 },
      { position: 'ST', x: 50, y: 20 },
    ],
  },
  {
    name: '3-1-2 (2 Tiền đạo săn bàn)',
    desc: '3 Hậu vệ · 1 Tiền vệ trụ · 2 Tiền đạo song sát',
    positions: [
      { position: 'GK', x: 50, y: 88 },
      { position: 'LB', x: 22, y: 72 },
      { position: 'CB', x: 50, y: 72 },
      { position: 'RB', x: 78, y: 72 },
      { position: 'CM', x: 50, y: 48 },
      { position: 'ST', x: 35, y: 22 },
      { position: 'ST', x: 65, y: 22 },
    ],
  },
  {
    name: '2-2-2 (Cơ động công thủ)',
    desc: '2 Hậu vệ · 2 Tiền vệ con thoi · 2 Tiền đạo cánh',
    positions: [
      { position: 'GK', x: 50, y: 88 },
      { position: 'CB', x: 32, y: 72 },
      { position: 'CB', x: 68, y: 72 },
      { position: 'LM', x: 28, y: 48 },
      { position: 'RM', x: 72, y: 48 },
      { position: 'LW', x: 32, y: 22 },
      { position: 'RW', x: 68, y: 22 },
    ],
  },
];

/**
 * Automatically determine position role (GK, CB, LB, RB, CDM, CM, CAM, LM, RM, ST, LW, RW)
 * based on x (0-100) and y (0-100) pitch coordinates.
 * y goes from 0 (attacking goal) to 100 (defending goal / GK).
 */
export function detectPositionFromCoordinates(x: number, y: number): Position {
  if (y >= 80) return 'GK';
  if (y >= 60) {
    if (x < 35) return 'LB';
    if (x > 65) return 'RB';
    return 'CB';
  }
  if (y >= 35) {
    if (y >= 50 && x >= 36 && x <= 64) return 'CDM';
    if (x < 32) return 'LM';
    if (x > 68) return 'RM';
    if (y < 46) return 'CAM';
    return 'CM';
  }
  if (x < 32) return 'LW';
  if (x > 68) return 'RW';
  return 'ST';
}
