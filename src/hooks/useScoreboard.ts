import { useState, useCallback } from "react";
import type {
  Scoreboard,
  Match,
  UpdateScoreFn,
  FinishMatchFn,
  StartMatchFn,
} from "../types";

export const useScoreboard = (): Scoreboard => {
  const [matches, setMatches] = useState<Match[]>([]);

  const startMatch: StartMatchFn = useCallback(({ homeTeam, awayTeam }) => {
    const newMatch: Match = {
      id: crypto.randomUUID(),
      homeTeam: homeTeam.trim().toLowerCase(),
      awayTeam: awayTeam.trim().toLowerCase(),
      homeScore: 0,
      awayScore: 0,
      startTime: new Date(),
      isFinished: false,
    };

    setMatches((prev) => [...prev, newMatch]);
    return newMatch.id;
  }, []);

  const updateScore: UpdateScoreFn = useCallback(
    ({ matchId, homeScore, awayScore }) => {
      setMatches((prev) =>
        prev.map((match) =>
          match.id === matchId ? { ...match, homeScore, awayScore } : match
        )
      );
    },
    []
  );

  const finishMatch: FinishMatchFn = useCallback(({ matchId }) => {
    setMatches((prev) =>
      prev.map((match) =>
        match.id === matchId ? { ...match, isFinished: true } : match
      )
    );
  }, []);

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
