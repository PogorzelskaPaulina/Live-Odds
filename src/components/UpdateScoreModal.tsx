import { useRef, useEffect, useState } from "react";
import type { UpdateScoreFn, Match } from "../types";
import { LEADING_ZEROS_REGEX } from "../constants/regex";

export const UpdateScoreModal = ({
  match,
  isOpen,
  onClose,
  onUpdateScore,
}: {
  match: Match;
  isOpen: boolean;
  onClose: () => void;
  onUpdateScore: UpdateScoreFn;
}) => {
  const [error, setError] = useState<string | undefined>(undefined);

  const homeScoreRef = useRef<HTMLInputElement>(null);
  const awayScoreRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (match && homeScoreRef.current && awayScoreRef.current) {
      homeScoreRef.current.value = match.homeScore.toString();
      awayScoreRef.current.value = match.awayScore.toString();
      setError(undefined);
    }
  }, [match]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!match) return;

    const homeScore = parseInt(homeScoreRef.current?.value || "0");
    const awayScore = parseInt(awayScoreRef.current?.value || "0");

    // Validate scores
    if (homeScore < 0 || awayScore < 0) {
      setError("Scores cannot be negative");
      return;
    }

    if (homeScore > 999 || awayScore > 999) {
      setError("Scores cannot exceed 999");
      return;
    }

    onUpdateScore({ matchId: match.id, homeScore, awayScore });
    onClose();
  };

  const handleClose = () => {
    setError(undefined);
    onClose();
  };

  if (!isOpen || !match) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Update Score</h3>
          <button className="modal-close" onClick={handleClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="match-info"></div>

          <form onSubmit={handleSubmit}>
            <div className="score-inputs">
              <div className="score-input-group">
                <label htmlFor="homeScore">
                  <span className="team home-team">{match.homeTeam}</span>
                </label>
                <input
                  id="homeScore"
                  ref={homeScoreRef}
                  type="number"
                  min="0"
                  className="score-input"
                  required
                  onChange={(e) => {
                    const value = e.target.value;
                    const cleanValue =
                      value.replace(LEADING_ZEROS_REGEX, "") || "0";
                    e.target.value = cleanValue;
                  }}
                />
              </div>

              <span className="vs">-</span>

              <div className="score-input-group">
                <label htmlFor="awayScore">
                  <span className="team away-team">{match.awayTeam}</span>
                </label>
                <input
                  id="awayScore"
                  ref={awayScoreRef}
                  type="number"
                  min="0"
                  className="score-input"
                  required
                  onChange={(e) => {
                    const value = e.target.value;
                    const cleanValue =
                      value.replace(LEADING_ZEROS_REGEX, "") || "0";
                    e.target.value = cleanValue;
                  }}
                />
              </div>
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Update Score
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
