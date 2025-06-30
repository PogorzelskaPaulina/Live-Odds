export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  startTime: Date;
  isFinished: boolean;
}

export interface CreateMatchRequest {
  homeTeam: string;
  awayTeam: string;
}

export interface UpdateScoreRequest {
  matchId: string;
  homeScore: number;
  awayScore: number;
}

export interface FinishMatchRequest {
  matchId: string;
}

export interface Scoreboard {
  matches: Match[];
  startMatch: (request: CreateMatchRequest) => string;
  updateScore: (request: UpdateScoreRequest) => void;
  finishMatch: (request: FinishMatchRequest) => void;
}
