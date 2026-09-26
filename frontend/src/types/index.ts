export type UserRole = 'PLAYER' | 'ADMIN';
export type UserStatus = 'PENDING' | 'ACTIVE' | 'BANNED';
export type MatchStatus = 
  | 'PENDING' 
  | 'CAPTAIN_SPINNING' 
  | 'CAPTAIN_PICKING' 
  | 'LINEUP_SETTING' 
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'CANCELLED';

export type Team = 'A' | 'B' | 'BENCH' | 'NONE';

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
  aiAnalysis?: string;
  aiAnalyzedAt?: string;
  notes?: string;
  createdAt: string;
  participants?: MatchParticipant[];
  lineups?: MatchLineup[];
  spinSession?: SpinSession;
}

export interface PlayerStats {
  id: string;
  matchId: string;
  user: User;
  team: Team;
  goals: number;
  assists: number;
  isWinner: boolean;
  isMvp: boolean;
  enteredBy?: User;
  enteredAt?: string;
}

export interface LeaderboardItem {
  rank: number;
  user: User;
  totalGoals: number;
  totalAssists: number;
  totalWins: number;
  totalMatches: number;
  winRate: number;
  updatedAt: string;
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
