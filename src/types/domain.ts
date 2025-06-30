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

export type StartMatchFn = (request: CreateMatchRequest) => string;

export type UpdateScoreFn = (request: UpdateScoreRequest) => void;

export type FinishMatchFn = (request: FinishMatchRequest) => void;

export interface Scoreboard {
  matches: Match[];
  startMatch: StartMatchFn;
  updateScore: UpdateScoreFn;
  finishMatch: FinishMatchFn;
}
