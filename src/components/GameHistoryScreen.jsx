import { describeResult, formatRank, rankPlayers } from '../lib/ranking'

function GameLogEntry({ game, onView, onDelete }) {
  const ranked = rankPlayers(game.players)
  const hasScored = game.players.some((p) => p.total > 0)

  function handleDelete(e) {
    e.stopPropagation()
    if (window.confirm('Delete this game? This cannot be undone.')) {
      onDelete(game.id)
    }
  }

  return (
    <div className="card game-log-entry">
      <div className="game-log-entry-top">
        <div>
          <div className="game-log-date">{new Date(game.endedAt).toLocaleString()}</div>
          <div className="game-log-meta">
            Goal {game.goal} points ·{' '}
            {game.status === 'finished' ? describeResult(ranked) : 'Ended without a winner'}
          </div>
        </div>
        <button
          type="button"
          className="icon-btn icon-btn-sm icon-btn-danger"
          onClick={handleDelete}
          aria-label="Delete game"
          title="Delete game"
        >
          <span aria-hidden="true">🗑</span>
        </button>
      </div>

      <ul className="game-log-players">
        {ranked.map((player) => (
          <li key={player.name}>
            {hasScored && <span className="badge badge-rank">{formatRank(player.rank)}</span>}
            {player.name} — {player.total} pts
            {hasScored && player.isTied && <span className="badge badge-tie">Tie</span>}
          </li>
        ))}
      </ul>

      <button type="button" className="btn-link" onClick={() => onView(game.id)}>
        View game →
      </button>
    </div>
  )
}

export default function GameHistoryScreen({ games, onBack, onViewGame, onDeleteGame }) {
  return (
    <div className="screen">
      <header className="game-header">
        <h1>Games</h1>
        <button type="button" className="icon-btn" onClick={onBack} aria-label="Back" title="Back">
          <span aria-hidden="true">←</span>
        </button>
      </header>

      {games.length === 0 ? (
        <p className="subtitle">No games played yet.</p>
      ) : (
        <div className="game-log-list">
          {games.map((game) => (
            <GameLogEntry key={game.id} game={game} onView={onViewGame} onDelete={onDeleteGame} />
          ))}
        </div>
      )}
    </div>
  )
}
