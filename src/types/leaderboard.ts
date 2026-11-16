export interface LeaderboardEntry {
  id: string;
  userName: string;
  scorePercentage: number;
  correctCount: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  mode: string;
  topicId: string;
  topicTitle: string;
  createdAt: string;
}

export interface LeaderboardSubmitPayload {
  userName: string;
  scorePercentage: number;
  correctCount: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  mode: string;
  topicId: string;
  topicTitle: string;
}

export interface LeaderboardResponse {
  success: boolean;
  records: LeaderboardEntry[];
  totalCount: number;
  userRank?: number;
  error?: string;
}
