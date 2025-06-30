import type {
  ValidationRule,
  ValidationRuleWithContext,
  ValidationResult,
  Match,
} from "../types";
import {
  validate,
  validateWithContext,
  combineResults,
} from "./validationUtils";

const MATCH_ID_RULES: ValidationRule<string>[] = [
  {
    test: (value: string) => value.length > 0,
    message: "Match ID is required",
  },
];

const MATCH_EXISTS_RULE: ValidationRuleWithContext<string, Match[]> = {
  test: (matchId: string, matches: Match[]) => {
    return matches.some((match) => match.id === matchId);
  },
  message: () => "Match not found",
};

const MATCH_NOT_FINISHED_RULE: ValidationRuleWithContext<string, Match[]> = {
  test: (matchId: string, matches: Match[]) => {
    const match = matches.find((match) => match.id === matchId);
    return match ? !match.isFinished : true;
  },
  message: () => "Cannot update finished match",
};

export const validateMatchId = (
  matchId: string,
  matches: Match[]
): ValidationResult => {
  return combineResults(
    validate(matchId, MATCH_ID_RULES),
    validateWithContext(matchId, matches, [
      MATCH_EXISTS_RULE,
      MATCH_NOT_FINISHED_RULE,
    ])
  );
};
