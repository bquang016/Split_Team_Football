export type UserRole = 'PLAYER' | 'ADMIN';
export type UserStatus = 'PENDING' | 'ACTIVE' | 'BANNED';

// MatchStatus theo luồng 6 bước mới
export type MatchStatus =
  | 'PENDING'           // Bước 1: Điểm danh đang mở
  | 'JERSEY_SELECTION'  // Bước 2: Chọn áo đấu
  | 'PLAYER_PICKING'    // Bước 3: Pick cầu thủ (quay spin trước mỗi lượt)
  | 'TRADE_WINDOW'      // Bước 4: Chỉnh sửa / đổi người
  | 'IN_PROGRESS'       // Đang thi đấu
  | 'COMPLETED'         // Kết thúc — mở nhập thống kê
  | 'CANCELLED';

export type Team = 'A' | 'B' | 'BENCH' | 'NONE';

// Jersey teams — không dùng màu nữa, dùng tên quốc gia
export type JerseyTeam = 'SPAIN' | 'FRANCE';

export type TradeStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED' | 'EXPIRED';

export type Position =
  | 'GK'
  | 'CB'
  | 'LB'
  | 'RB'
  | 'CM'
  | 'LM'
  | 'RM'
  | 'ST'
  | 'LW'
  | 'RW'
  | 'CAM'
  | 'CDM';

export interface User {
  id: string;
  username: string;
  fullName: string;
  jerseyNumber?: number;
  avatarUrl?: string;
  email?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface MatchParticipant {
  id: string;
  matchId: string;
  user: User;
  team: Team;
  isHost: boolean;
  pickOrder?: number;
  jerseyNumber?: number;
  joinedAt: string;
}

export interface MatchLineup {
  id: string;
  matchId: string;
  user: User;
  team: Team;
  positionLabel?: Position;
  xPercent?: number;
  yPercent?: number;
  jerseyNumber?: number;
}

export interface SpinSession {
  id: string;
  matchId: string;
  hostA: User;
  hostB: User;
  winner: User;
  spinSeed: number;
  durationMs: number;
  spunAt: string;
}

export interface Match {
  id: string;
  title: string;
  matchDate: string;
  matchTime?: string;
  location: string;
  status: MatchStatus;
  createdBy?: User;
  scoreTeamA: number;
  scoreTeamB: number;
  // Bước 2: Áo đấu đã chọn
  jerseyWinnerTeam?: JerseyTeam | null; // "SPAIN" hoặc "FRANCE"
  // Bước 3: Đội thắng quay lượt chọn đầu & thời điểm bắt đầu lượt
  firstPickTeam?: 'A' | 'B' | null;
  pickTurnStartedAt?: string | null;
  // Timeline
  startAt?: string;    // Khi IN_PROGRESS bắt đầu
  endAt?: string;      // Khi COMPLETED
  aiAnalysis?: string;
  aiAnalyzedAt?: string;
  notes?: string;
  createdAt: string;
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: User;
  participants?: MatchParticipant[];
  lineups?: MatchLineup[];
  goals?: MatchGoal[];
  spinSession?: SpinSession;
}

export interface MatchGoal {
  id: string;
  matchId: string;
  scorer: User;
  assist?: User;
  team: Team;
  minute: number;
  goalCount: number;
  createdAt: string;
}

export interface PlayerStats {
  id: string;
  matchId: string;
  user: User;
  team: Team;
  goals: number;
  assists: number;
  saves: number;     // Cứu thua (thủ môn / hậu vệ)
  isWinner: boolean;
  isMvp: boolean;
  enteredBy?: User;
  enteredAt?: string;
}

// Bước 4 — Trade Window
export interface TradeRequest {
  id: string;
  matchId: string;
  requestedBy: User;   // Đội trưởng gửi yêu cầu
  playerOffered: User; // Cầu thủ bên mình muốn đổi
  playerWanted: User;  // Cầu thủ bên kia muốn lấy
  status: TradeStatus;
  expiresAt?: string;
  respondedAt?: string;
  createdAt: string;
}

export interface LeaderboardItem {
  rank: number;
  user: User;
  totalGoals: number;
  totalAssists: number;
  totalSaves: number;    // Tổng cứu thua
  totalWins: number;
  totalLosses: number;   // Tổng thua
  totalDraws: number;    // Tổng hòa
  totalMatches: number;
  totalMvp: number;      // Số lần MVP
  winRate: number;
  updatedAt: string;
}

export interface PlayerSummary {
  totalGoals: number;
  totalAssists: number;
  totalSaves: number;
  totalWins: number;
  totalLosses: number;
  totalDraws: number;
  totalMatches: number;
  totalMvp: number;
  winRate: number;
}

export interface AIAnalysis {
  analysis: string;
  winPrediction: string;
  tacticalAdvice: string;
  analyzedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: User;
}

// Helper: nhãn hiển thị cho trạng thái trận
export const MATCH_STATUS_LABEL: Record<MatchStatus, string> = {
  PENDING: 'Điểm danh',
  JERSEY_SELECTION: 'Chọn áo',
  PLAYER_PICKING: 'Pick cầu thủ',
  TRADE_WINDOW: 'Chỉnh sửa đội hình',
  IN_PROGRESS: 'Đang diễn ra',
  COMPLETED: 'Đã kết thúc',
  CANCELLED: 'Đã hủy',
};

// Helper: nhãn hiển thị tên đội áo đấu
export const JERSEY_TEAM_LABEL: Record<JerseyTeam, string> = {
  SPAIN: 'Tây Ban Nha',
  FRANCE: 'Pháp',
};
