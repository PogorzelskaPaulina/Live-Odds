import { useScoreboard } from "../hooks/useScoreboard";
import { ScoreboardList } from "./ScoreboardList";
import { AddNewMatch } from "./AddNewMatch";

export const Scoreboard = () => {
  const { matches, startMatch, updateScore, finishMatch } = useScoreboard();

  return (
    <div className="scoreboard-container">
      <header className="scoreboard-header">
        <h1>Live Football World Cup Scoreboard</h1>
      </header>

      <AddNewMatch onMatchStart={startMatch} />
      <ScoreboardList
        matches={matches}
        onUpdateScore={updateScore}
        onFinishMatch={finishMatch}
      />
    </div>
  );
};
