import type {
  ValidationRule,
  ValidationResult,
  UpdateScoreRequest,
  Match,
} from "../types";
import { validate, combineResults } from "./validationUtils";
import { validateMatchId } from "./validateMatchId";

const SCORE_RULES: ValidationRule<number>[] = [
  {
    test: (value: number) => value >= 0,
    message: "Scores cannot be negative",
  },
  {
    test: (value: number) => Number.isInteger(value),
    message: "Score must be a whole number",
  },
];

export const validateScore = (score: number): ValidationResult => {
  return validate(score, SCORE_RULES);
};

export const validateUpdateScore = ({
  matchId,
  homeScore,
  awayScore,
  matches,
}: UpdateScoreRequest & { matches: Match[] }): ValidationResult => {
  return combineResults(
    validateMatchId(matchId, matches),
    validate(homeScore, SCORE_RULES),
    validate(awayScore, SCORE_RULES)
  );
};
