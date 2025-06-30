import type {
  ValidationRule,
  ValidationRuleWithContext,
  ValidationResult,
} from "../types";
import { LETTERS_AND_SPACES_REGEX } from "../constants/regex";

export const TEAM_NAME_RULES: ValidationRule<string>[] = [
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

export const NO_ACTIVE_MATCHES_RULE: ValidationRuleWithContext<
  string,
  Set<string>
> = {
  test: (teamName: string, activeTeamNames: Set<string>) => {
    return !activeTeamNames.has(teamName);
  },
  message: (teamName: string) =>
    `Cannot start match: ${teamName} already have a match in progress.`,
};

export const DIFFERENT_TEAMS_RULE: ValidationRule<{
  homeTeamName: string;
  awayTeamName: string;
}> = {
  test: ({ homeTeamName, awayTeamName }) => {
    return homeTeamName !== awayTeamName;
  },
  message: "Home and away teams must be different",
};

const validateTeamName = (teamName: string): ValidationResult => {
  const errors = TEAM_NAME_RULES.filter((rule) => !rule.test(teamName)).map(
    (rule) => rule.message
  );

  return {
    isValid: errors.length === 0,
    errors,
  };
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
  const errors: string[] = [];

  const homeTeamValidation = validateTeamName(homeTeamName);
  const awayTeamValidation = validateTeamName(awayTeamName);

  errors.push(...homeTeamValidation.errors, ...awayTeamValidation.errors);

  if (!DIFFERENT_TEAMS_RULE.test({ homeTeamName, awayTeamName })) {
    errors.push(DIFFERENT_TEAMS_RULE.message);
  }

  const activeTeamNames = new Set(
    activeMatches.flatMap((match) => [match.homeTeam, match.awayTeam])
  );

  if (!NO_ACTIVE_MATCHES_RULE.test(homeTeamName, activeTeamNames)) {
    errors.push(NO_ACTIVE_MATCHES_RULE.message(homeTeamName));
  }
  if (!NO_ACTIVE_MATCHES_RULE.test(awayTeamName, activeTeamNames)) {
    errors.push(NO_ACTIVE_MATCHES_RULE.message(awayTeamName));
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
