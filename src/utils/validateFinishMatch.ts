import type { ValidationResult, Match } from "../types";
import { combineResults } from "./validationUtils";
import { validateMatchId } from "./validateMatchId";

export const validateFinishMatch = ({
  matchId,
  matches,
}: {
  matchId: string;
  matches: Match[];
}): ValidationResult => {
  return combineResults(validateMatchId(matchId, matches));
};
