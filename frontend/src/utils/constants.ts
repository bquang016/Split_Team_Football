import { MatchStatus } from '../types';

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
];
