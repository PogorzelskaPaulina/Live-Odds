import type {
  ValidationResult,
  ValidationRule,
  ValidationRuleWithContext,
} from "../types";
import {
  validate,
  validateWithContext,
  combineResults,
} from "./validationUtils";
import { LETTERS_AND_SPACES_REGEX } from "../constants/regex";

const TEAM_NAME_RULES: ValidationRule<string>[] = [
  {
    test: (value: string) => value.length > 0,
    message: "Team name is required",
  },
  {
    test: (value: string) => value.length >= 2,
    message: "Team name must be at least 2 characters long",
  },
  {
    test: (value: string) =>
      value.replace(LETTERS_AND_SPACES_REGEX, "") === value,
    message: "Team name can only contain letters and spaces",
  },
];

const NO_ACTIVE_MATCHES_RULE: ValidationRuleWithContext<string, Set<string>> = {
  test: (teamName: string, activeTeamNames: Set<string>) => {
    return !activeTeamNames.has(teamName);
  },
  message: (teamName: string) =>
    `Cannot start match: ${teamName} already have a match in progress.`,
};

const DIFFERENT_TEAMS_RULE: ValidationRule<{
  homeTeamName: string;
  awayTeamName: string;
}> = {
  test: ({ homeTeamName, awayTeamName }) => {
    return homeTeamName !== awayTeamName;
  },
  message: "Home and away teams must be different",
};

export const validateStartMatch = ({
  homeTeamName,
  awayTeamName,
  activeMatches,
}: {
  homeTeamName: string;
  awayTeamName: string;
  activeMatches: Array<{ homeTeam: string; awayTeam: string }>;
}): ValidationResult => {
  const activeTeamNames = new Set(
    activeMatches.flatMap((match) => [match.homeTeam, match.awayTeam])
  );

  return combineResults(
    validate(homeTeamName, TEAM_NAME_RULES),
    validate(awayTeamName, TEAM_NAME_RULES),
    validate({ homeTeamName, awayTeamName }, [DIFFERENT_TEAMS_RULE]),
    validateWithContext(homeTeamName, activeTeamNames, [
      NO_ACTIVE_MATCHES_RULE,
    ]),
    validateWithContext(awayTeamName, activeTeamNames, [NO_ACTIVE_MATCHES_RULE])
  );
};
