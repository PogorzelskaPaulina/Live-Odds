export type {
  Match,
  CreateMatchRequest,
  UpdateScoreRequest,
  FinishMatchRequest,
  StartMatchFn,
  UpdateScoreFn,
  FinishMatchFn,
  Scoreboard,
  ValidationResult,
} from "./types";

export { useScoreboard } from "./hooks/useScoreboard";

export { Scoreboard as ScoreboardComponent } from "./components/Scoreboard";
export { ScoreboardList } from "./components/ScoreboardList";
export { AddNewMatch } from "./components/AddNewMatch";
export { UpdateScoreModal } from "./components/UpdateScoreModal";
