/**
 * useScoreboard Design
 *
 * @typedef {Object} Match
 * @property {string} id - Unique identifier for the match
 * @property {string} homeTeam - Name of the home team (normalized to lowercase)
 * @property {string} awayTeam - Name of the away team (normalized to lowercase)
 * @property {number} homeScore - Current score of the home team
 * @property {number} awayScore - Current score of the away team
 * @property {Date} startTime - When the match was started
 * @property {boolean} isFinished - Whether the match has been finished
 *
 * @typedef {Object} StartMatchParams
 * @property {string} homeTeam - Name of the home team
 * @property {string} awayTeam - Name of the away team
 *
 * @typedef {Object} UpdateScoreParams
 * @property {string} matchId - ID of the match to update
 * @property {number} homeScore - New score for the home team
 * @property {number} awayScore - New score for the away team
 *
 * @typedef {Object} FinishMatchParams
 * @property {string} matchId - ID of the match to finish
 *
 * @typedef {Object} UseScoreboardReturn
 * @property {Match[]} matches - Array of active matches, sorted by total score (descending) then by start time (ascending)
 * @property {function} startMatch - Function to start a new match
 * @property {function} updateScore - Function to update match scores
 * @property {function} finishMatch - Function to finish a match
 *
 * @returns {UseScoreboardReturn} Object containing matches array and management functions
 */

import { renderHook, act } from "@testing-library/react";
import { useScoreboard } from "./useScoreboard";

describe("useScoreboard", () => {
  it("should initialize with empty matches array", () => {
    const { result } = renderHook(() => useScoreboard());

    expect(result.current.matches).toEqual([]);
  });

  describe("startMatch", () => {
    it("should start a match", () => {
      const { result } = renderHook(() => useScoreboard());

      act(() => {
        result.current.startMatch({ homeTeam: "Mexico", awayTeam: "Canada" });
      });

      expect(result.current.matches).toHaveLength(1);
      expect(result.current.matches[0]).toMatchObject({
        homeTeam: "mexico",
        awayTeam: "canada",
        homeScore: 0,
        awayScore: 0,
        isFinished: false,
      });
      expect(result.current.matches[0].startTime).toBeInstanceOf(Date);
    });

    it("should normalize team names to lowercase", () => {
      const { result } = renderHook(() => useScoreboard());

      act(() => {
        result.current.startMatch({ homeTeam: "MEXICO", awayTeam: "CAnaDa" });
      });

      expect(result.current.matches[0]).toMatchObject({
        homeTeam: "mexico",
        awayTeam: "canada",
      });
    });

    it("should validate team names when starting match", () => {
      const { result } = renderHook(() => useScoreboard());

      act(() => {
        expect(() =>
          result.current.startMatch({ homeTeam: "", awayTeam: "Canada" })
        ).toThrow();
        expect(() =>
          result.current.startMatch({ homeTeam: "Mexico", awayTeam: "" })
        ).toThrow();
      });
    });

    it("should prevent same team as home and away even with different cases", () => {
      const { result } = renderHook(() => useScoreboard());

      act(() => {
        expect(() =>
          result.current.startMatch({ homeTeam: "MeXiCo", awayTeam: "mexico" })
        ).toThrow();
        expect(() =>
          result.current.startMatch({ homeTeam: "MEXICO", awayTeam: "Mexico" })
        ).toThrow();
      });
    });

    it("should prevent teams from having multiple ongoing matches", () => {
      const { result } = renderHook(() => useScoreboard());

      act(() => {
        result.current.startMatch({ homeTeam: "Mexico", awayTeam: "Canada" });
      });

      act(() => {
        expect(() =>
          result.current.startMatch({ homeTeam: "Mexico", awayTeam: "Brazil" })
        ).toThrow();
        expect(() =>
          result.current.startMatch({ homeTeam: "Brazil", awayTeam: "Canada" })
        ).toThrow();
      });
    });

    it("should generate unique IDs for matches", () => {
      const { result } = renderHook(() => useScoreboard());

      act(() => {
        result.current.startMatch({ homeTeam: "Mexico", awayTeam: "Canada" });
        result.current.startMatch({ homeTeam: "Spain", awayTeam: "Brazil" });
      });

      expect(result.current.matches).toHaveLength(2);
      expect(result.current.matches[0].id).not.toBe(
        result.current.matches[1].id
      );
    });
  });

  describe("updateScore", () => {
    it("should update match score", () => {
      const { result } = renderHook(() => useScoreboard());

      let matchId: string;
      act(() => {
        matchId = result.current.startMatch({
          homeTeam: "Mexico",
          awayTeam: "Canada",
        });
      });

      act(() => {
        result.current.updateScore({
          matchId: matchId,
          homeScore: 2,
          awayScore: 1,
        });
      });

      expect(result.current.matches[0]).toMatchObject({
        homeScore: 2,
        awayScore: 1,
      });
    });

    it("should prevent negative home score", () => {
      const { result } = renderHook(() => useScoreboard());

      let matchId: string;
      act(() => {
        matchId = result.current.startMatch({
          homeTeam: "Mexico",
          awayTeam: "Canada",
        });
      });

      act(() => {
        expect(() =>
          result.current.updateScore({
            matchId: matchId,
            homeScore: -1,
            awayScore: 0,
          })
        ).toThrow();
      });
    });

    it("should prevent negative away score", () => {
      const { result } = renderHook(() => useScoreboard());

      let matchId: string;
      act(() => {
        matchId = result.current.startMatch({
          homeTeam: "Mexico",
          awayTeam: "Canada",
        });
      });

      act(() => {
        expect(() =>
          result.current.updateScore({
            matchId: matchId,
            homeScore: 0,
            awayScore: -2,
          })
        ).toThrow();
      });
    });

    it("should allow zero scores", () => {
      const { result } = renderHook(() => useScoreboard());

      let matchId: string;
      act(() => {
        matchId = result.current.startMatch({
          homeTeam: "Mexico",
          awayTeam: "Canada",
        });
      });

      act(() => {
        result.current.updateScore({
          matchId: matchId,
          homeScore: 0,
          awayScore: 0,
        });
      });

      expect(result.current.matches[0]).toMatchObject({
        homeScore: 0,
        awayScore: 0,
      });
    });

    it("should allow large positive scores", () => {
      const { result } = renderHook(() => useScoreboard());

      let matchId: string;
      act(() => {
        matchId = result.current.startMatch({
          homeTeam: "Mexico",
          awayTeam: "Canada",
        });
      });

      act(() => {
        result.current.updateScore({
          matchId: matchId,
          homeScore: 999,
          awayScore: 1000,
        });
      });

      expect(result.current.matches[0]).toMatchObject({
        homeScore: 999,
        awayScore: 1000,
      });
    });

    it("should throw error for non-existent match", () => {
      const { result } = renderHook(() => useScoreboard());

      act(() => {
        expect(() =>
          result.current.updateScore({
            matchId: "non-existent-id",
            homeScore: 1,
            awayScore: 1,
          })
        ).toThrow();
      });
    });

    it("should throw error when trying to update score for finished match", () => {
      const { result } = renderHook(() => useScoreboard());

      let matchId: string;
      act(() => {
        matchId = result.current.startMatch({
          homeTeam: "Mexico",
          awayTeam: "Canada",
        });
      });

      act(() => {
        result.current.finishMatch({ matchId });
      });

      act(() => {
        expect(() =>
          result.current.updateScore({
            matchId: matchId,
            homeScore: 2,
            awayScore: 1,
          })
        ).toThrow();
      });
    });

    it("should throw error when matchId is missing", () => {
      const { result } = renderHook(() => useScoreboard());

      act(() => {
        expect(() =>
          result.current.updateScore({
            matchId: undefined as unknown as string,
            homeScore: 1,
            awayScore: 1,
          })
        ).toThrow();
      });
    });

    it("should throw error for non-integer home score", () => {
      const { result } = renderHook(() => useScoreboard());

      let matchId: string;
      act(() => {
        matchId = result.current.startMatch({
          homeTeam: "Mexico",
          awayTeam: "Canada",
        });
      });

      act(() => {
        expect(() =>
          result.current.updateScore({
            matchId: matchId,
            homeScore: 1.5,
            awayScore: 1,
          })
        ).toThrow();
      });
    });

    it("should throw error for non-integer away score", () => {
      const { result } = renderHook(() => useScoreboard());

      let matchId: string;
      act(() => {
        matchId = result.current.startMatch({
          homeTeam: "Mexico",
          awayTeam: "Canada",
        });
      });

      act(() => {
        expect(() =>
          result.current.updateScore({
            matchId: matchId,
            homeScore: 1,
            awayScore: 2.7,
          })
        ).toThrow();
      });
    });
  });

  describe("finishMatch", () => {
    it("should finish a match", () => {
      const { result } = renderHook(() => useScoreboard());

      let matchId: string;
      act(() => {
        matchId = result.current.startMatch({
          homeTeam: "Mexico",
          awayTeam: "Canada",
        });
      });

      expect(result.current.matches).toHaveLength(1);

      act(() => {
        result.current.finishMatch({ matchId });
      });

      expect(result.current.matches).toHaveLength(0);
    });

    it("should throw error for non-existent match", () => {
      const { result } = renderHook(() => useScoreboard());

      act(() => {
        expect(() =>
          result.current.updateScore({
            matchId: "non-existent-id",
            homeScore: 1,
            awayScore: 1,
          })
        ).toThrow();
      });
    });

    it("should throw error when trying to finish finished match", () => {
      const { result } = renderHook(() => useScoreboard());

      let matchId: string;
      act(() => {
        matchId = result.current.startMatch({
          homeTeam: "Mexico",
          awayTeam: "Canada",
        });
      });

      act(() => {
        result.current.finishMatch({ matchId });
      });

      act(() => {
        expect(() =>
          result.current.finishMatch({
            matchId: matchId,
          })
        ).toThrow();
      });
    });

    it("should throw error when matchId is missing", () => {
      const { result } = renderHook(() => useScoreboard());

      act(() => {
        expect(() =>
          result.current.finishMatch({
            matchId: undefined as unknown as string,
          })
        ).toThrow();
      });
    });
  });

  describe("summary", () => {
    it("should return only unfinished matches", () => {
      const { result } = renderHook(() => useScoreboard());

      let matchId1: string;
      act(() => {
        matchId1 = result.current.startMatch({
          homeTeam: "Mexico",
          awayTeam: "Canada",
        });
        result.current.startMatch({ homeTeam: "Spain", awayTeam: "Brazil" });
      });

      expect(result.current.matches).toHaveLength(2);

      act(() => {
        result.current.finishMatch({ matchId: matchId1 });
      });

      expect(result.current.matches).toHaveLength(1);
      expect(result.current.matches[0].homeTeam).toBe("spain");
    });

    it("should provide summary ordered by total score then by start time", () => {
      const { result } = renderHook(() => useScoreboard());

      let matchId1: string,
        matchId2: string,
        matchId3: string,
        matchId4: string,
        matchId5: string;

      // Create matches in separate act blocks to ensure different timestamps
      act(() => {
        matchId1 = result.current.startMatch({
          homeTeam: "Mexico",
          awayTeam: "Canada",
        });
      });
      act(() => {
        matchId2 = result.current.startMatch({
          homeTeam: "Spain",
          awayTeam: "Brazil",
        });
      });
      act(() => {
        matchId3 = result.current.startMatch({
          homeTeam: "Germany",
          awayTeam: "France",
        });
      });
      act(() => {
        matchId4 = result.current.startMatch({
          homeTeam: "Uruguay",
          awayTeam: "Italy",
        });
      });
      act(() => {
        matchId5 = result.current.startMatch({
          homeTeam: "Argentina",
          awayTeam: "Australia",
        });
      });

      act(() => {
        result.current.updateScore({
          matchId: matchId1!,
          homeScore: 0,
          awayScore: 5,
        }); // Total: 5
        result.current.updateScore({
          matchId: matchId2!,
          homeScore: 10,
          awayScore: 2,
        }); // Total: 12
        result.current.updateScore({
          matchId: matchId3!,
          homeScore: 2,
          awayScore: 2,
        }); // Total: 4
        result.current.updateScore({
          matchId: matchId4!,
          homeScore: 6,
          awayScore: 6,
        }); // Total: 12
        result.current.updateScore({
          matchId: matchId5!,
          homeScore: 3,
          awayScore: 1,
        }); // Total: 4
      });

      const summary = result.current.matches;

      expect(summary).toHaveLength(5);
      // Spain 10-2 (Total: 12, started earlier than Uruguay)
      expect(summary[0]).toMatchObject({
        homeTeam: "spain",
        awayTeam: "brazil",
        homeScore: 10,
        awayScore: 2,
      });
      // Uruguay 6-6 (Total: 12, started later than Spain)
      expect(summary[1]).toMatchObject({
        homeTeam: "uruguay",
        awayTeam: "italy",
        homeScore: 6,
        awayScore: 6,
      });
      // Mexico 0-5 (Total: 5)
      expect(summary[2]).toMatchObject({
        homeTeam: "mexico",
        awayTeam: "canada",
        homeScore: 0,
        awayScore: 5,
      });
      // Germany 2-2 (Total: 4, started earlier than Argentina)
      expect(summary[3]).toMatchObject({
        homeTeam: "germany",
        awayTeam: "france",
        homeScore: 2,
        awayScore: 2,
      });
      // Argentina 3-1 (Total: 4, started later than Germany)
      expect(summary[4]).toMatchObject({
        homeTeam: "argentina",
        awayTeam: "australia",
        homeScore: 3,
        awayScore: 1,
      });
    });
  });
});
