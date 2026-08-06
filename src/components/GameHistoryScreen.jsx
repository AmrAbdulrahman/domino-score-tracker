import { useState } from 'react'
import ScoreHistoryTable from './ScoreHistoryTable'

function GameLogEntry({ game }) {
  const [expandedPlayer, setExpandedPlayer] = useState(null)
  const sortedPlayers = [...game.players].sort((a, b) => b.total - a.total)

  return (
    <div className="card game-log-entry">
      <div className="game-log-date">
        {new Date(game.endedAt).toLocaleString()}
      </div>
      <div className="game-log-meta">
        Goal {game.goal} points ·{' '}
        {game.status === 'finished' ? (
          <span>
            Winner: <strong>{game.winnerName}</strong>
          </span>
        ) : (
          'Ended without a winner'
        )}
      </div>

      <ul className="game-log-players">
        {sortedPlayers.map((player) => (
          <li key={player.name}>
            <button
              type="button"
              className="btn-link"
              onClick={() =>
                setExpandedPlayer((current) => (current === player.name ? null : player.name))
              }
              disabled={player.history.length === 0}
            >
              {player.name === game.winnerName ? '🏆 ' : ''}
              {player.name} — {player.total} pts
            </button>
            {expandedPlayer === player.name && <ScoreHistoryTable history={player.history} />}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function GameHistoryScreen({ games, onBack }) {
  return (
    <div className="screen">
      <header className="game-header">
        <h1>Games</h1>
        <button type="button" className="btn-secondary" onClick={onBack}>
          Back
        </button>
      </header>

      {games.length === 0 ? (
        <p className="subtitle">No games played yet.</p>
      ) : (
        <div className="game-log-list">
          {games.map((game) => (
            <GameLogEntry key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  )
}
