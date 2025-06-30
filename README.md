# Live Football World Cup Scoreboard

A React-based live scoreboard application for managing football matches in real-time. Built with TypeScript, Vite, and modern React patterns.

## Quick Start

### Prerequisites

- Node.js (v24.3.0)
- npm

### Installation & Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

### Given requirements:

1. Start a new match, assuming initial score 0 – 0 and adding it the scoreboard.
   This should capture following parameters:
   a. Home team
   b. Away team
2. Update score. This should receive a pair of absolute scores: home team score and away
   team score.
3. Finish match currently in progress. This removes a match from the scoreboard.
4. Get a summary of matches in progress ordered by their total score. The matches with the
   same total score will be returned ordered by the most recently started match in the
   scoreboard.

### Assumptions and Implicit Requirements

- Scores cannot be of negative value
- There is no limit to how high score can get (but possibly we would wanna extend app in the future by some limit)
- We assume that the same characters in the provided team names, regardless of whether they are uppercase or lowercase letters, represent the same team — that is, team names are matched case-insensitively
- We don't implement a mechanism for removing matches from the scoreboard when it's finished automatically after time passed taking into account "We don't expect the solution to be a REST API, command line application, a Web Service, or Microservice

### Using the Hook for Custom UI

```tsx
import { useScoreboard } from "live-scoreboard";

function CustomScoreboard() {
  const { matches, startMatch, updateScore, finishMatch } = useScoreboard();

  return (
    <div>
      <h2>Live Matches</h2>
      {matches.map((match) => (
        <div key={match.id}>
          {match.homeTeam} {match.homeScore} - {match.awayScore}{" "}
          {match.awayTeam}
          <button
            onClick={() =>
              updateScore({
                matchId: match.id,
                homeScore: match.homeScore + 1,
                awayScore: match.awayScore,
              })
            }
          >
            Home Goal
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Using Components

```tsx
import {
  ScoreboardComponent,
  AddNewMatch,
  ScoreboardList,
} from "live-scoreboard";

// Complete scoreboard with all UI
function App() {
  return <ScoreboardComponent />;
}

// Or use individual components
function CustomApp() {
  const { matches, startMatch, updateScore, finishMatch } = useScoreboard();

  return (
    <div>
      <AddNewMatch onMatchStart={startMatch} />
      <ScoreboardList
        matches={matches}
        onUpdateScore={updateScore}
        onFinishMatch={finishMatch}
      />
    </div>
  );
}
```

## Features

- ✅ **TypeScript Support**: Full type safety
- ✅ **Flexible API**: Use the hook, components, or both
- ✅ **Automatic Sorting**: Matches sorted by score and time
- ✅ **Validation**: Built-in input validation
- ✅ **React 18+ Compatible**: Uses modern React features
- ✅ **Zero Dependencies**: Only React and React-DOM required
