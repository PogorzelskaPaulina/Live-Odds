import { useState } from "react";
import type {
  FinishMatchFn,
  Match,
  UpdateScoreFn,
  UpdateScoreRequest,
} from "../types";
import { UpdateScoreModal } from "./UpdateScoreModal";

export const ScoreboardList = ({
  matches,
  onUpdateScore,
  onFinishMatch,
}: {
  matches: Match[];
  onUpdateScore: UpdateScoreFn;
  onFinishMatch: FinishMatchFn;
}) => {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpdateScoreClick = (match: Match) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMatch(null);
  };

  const handleUpdateScore = ({
    matchId,
    homeScore,
    awayScore,
  }: UpdateScoreRequest) => {
    onUpdateScore({ matchId, homeScore, awayScore });
  };

  return (
    <>
      <section className="summary-section">
        <h2>Active Matches ({matches.length})</h2>
        {matches.length === 0 ? (
          <p className="no-matches">No active matches</p>
        ) : (
          <div>
            {matches.map((match) => (
              <div key={match.id} className="match-card">
                <div className="match-teams">
                  <span className="team home-team">{match.homeTeam}</span>
                  <span className="score">
                    {match.homeScore} - {match.awayScore}
                  </span>
                  <span className="team away-team">{match.awayTeam}</span>
                </div>
                <div className="match-actions">
                  <button
                    onClick={() => handleUpdateScoreClick(match)}
                    className="btn btn-secondary"
                  >
                    Update Score
                  </button>
                  <button
                    onClick={() => {
                      onFinishMatch({ matchId: match.id });
                    }}
                    className="btn btn-danger"
                  >
                    Finish Match
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {selectedMatch && (
        <UpdateScoreModal
          match={selectedMatch}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onUpdateScore={handleUpdateScore}
        />
      )}
    </>
  );
};
