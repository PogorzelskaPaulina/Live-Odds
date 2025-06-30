import { useRef, useState } from "react";
import type { StartMatchFn } from "../types";
import { LETTERS_AND_SPACES_REGEX } from "../constants/regex";

export const AddNewMatch = ({
  onMatchStart,
}: {
  onMatchStart: StartMatchFn;
}) => {
  const [error, setError] = useState<string | undefined>(undefined);

  const homeTeamRef = useRef<HTMLInputElement>(null);
  const awayTeamRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const homeTeam = homeTeamRef.current?.value || "";
      const awayTeam = awayTeamRef.current?.value || "";

      onMatchStart({ homeTeam, awayTeam });

      if (homeTeamRef.current) homeTeamRef.current.value = "";
      if (awayTeamRef.current) awayTeamRef.current.value = "";
      setError(undefined);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to start match"
      );
    }
  };

  return (
    <section className="start-match-section">
      <h2>Start New Match</h2>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              className="team-input"
              ref={homeTeamRef}
              placeholder="Home team name"
              required
              type="text"
              onChange={(e) => {
                const value = e.target.value;

                const cleanValue = value.replace(LETTERS_AND_SPACES_REGEX, "");
                e.target.value = cleanValue;
              }}
            />
            <span className="vs">vs</span>
            <input
              className="team-input"
              ref={awayTeamRef}
              placeholder="Away team name"
              required
              type="text"
              onChange={(e) => {
                const value = e.target.value;

                const cleanValue = value.replace(LETTERS_AND_SPACES_REGEX, "");
                e.target.value = cleanValue;
              }}
            />
            <button className="btn btn-primary" type="submit">
              Start Match
            </button>
          </div>

          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </section>
  );
};
