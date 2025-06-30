import { useState, useCallback } from "react";
import type {
  Scoreboard,
  Match,
  UpdateScoreFn,
  FinishMatchFn,
  StartMatchFn,
} from "../types";
import { validateStartMatch } from "../utils/validateStartMatch";
import { validateUpdateScore } from "../utils/validateUpdateScore";
import { validateFinishMatch } from "../utils/validateFinishMatch";

export const useScoreboard = (): Scoreboard => {
  const [matches, setMatches] = useState<Match[]>([]);

  const startMatch: StartMatchFn = useCallback(
    ({ homeTeam, awayTeam }) => {
      const activeMatches = matches
        .filter((match) => !match.isFinished)
        .map((match) => ({
          homeTeam: match.homeTeam,
          awayTeam: match.awayTeam,
        }));

      const homeTeamName = homeTeam.trim().toLowerCase();
      const awayTeamName = awayTeam.trim().toLowerCase();

      const validation = validateStartMatch({
        homeTeamName,
        awayTeamName,
        activeMatches,
      });

      if (!validation.isValid) {
        throw new Error(validation.errors.join(", "));
      }
      const newMatch: Match = {
        id: crypto.randomUUID(),
        homeTeam: homeTeamName,
        awayTeam: awayTeamName,
        homeScore: 0,
        awayScore: 0,
        startTime: new Date(),
        isFinished: false,
      };

      setMatches((prev) => [...prev, newMatch]);
      return newMatch.id;
    },
    [matches]
  );

  const updateScore: UpdateScoreFn = useCallback(
    ({ matchId, homeScore, awayScore }) => {
      const validation = validateUpdateScore({
        matchId,
        homeScore,
        awayScore,
        matches,
      });
      if (!validation.isValid) {
        throw new Error(validation.errors.join(", "));
      }

      setMatches((prev) =>
        prev.map((match) =>
          match.id === matchId ? { ...match, homeScore, awayScore } : match
        )
      );
    },
    [matches]
  );

  const finishMatch: FinishMatchFn = useCallback(
    ({ matchId }) => {
      const validation = validateFinishMatch({ matchId, matches });
      if (!validation.isValid) {
        throw new Error(validation.errors.join(", "));
      }
      setMatches((prev) =>
        prev.map((match) =>
          match.id === matchId ? { ...match, isFinished: true } : match
        )
      );
    },
    [matches]
  );

  const summary = matches
    .filter((match) => !match.isFinished)
    .sort((a, b) => {
      const totalScoreA = a.homeScore + a.awayScore;
      const totalScoreB = b.homeScore + b.awayScore;

      if (totalScoreA !== totalScoreB) {
        return totalScoreB - totalScoreA;
      }

      return b.startTime.getTime() - a.startTime.getTime();
    });

  return {
    matches: summary,
    startMatch,
    updateScore,
    finishMatch,
  };
};
