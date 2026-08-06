import { describeResult, formatRank, rankPlayers } from '../lib/ranking'
import GameMenu from './GameMenu'

function GameLogEntry({ game, onView, onDelete }) {
  const ranked = rankPlayers(game.players)
  const hasScored = game.players.some((p) => p.total > 0)

  function handleDelete(e) {
    e.stopPropagation()
    if (window.confirm('Delete this game? This cannot be undone.')) {
      onDelete(game.id)
    }
  }

  function handleKeyDown(e) {
    if (e.target !== e.currentTarget) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onView(game.id)
    }
  }

  return (
    <div
      className="card game-log-entry"
      role="button"
      tabIndex={0}
      onClick={() => onView(game.id)}
      onKeyDown={handleKeyDown}
    >
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
    </div>
  )
}

export default function GameHistoryScreen({
  games,
  onBack,
  onViewGame,
  onDeleteGame,
  needRefresh,
  onCheckUpdate,
  onReloadUpdate,
}) {
  return (
    <div className="screen">
      <header className="game-header">
        <h1>Games</h1>
        <div className="game-header-actions">
          <button type="button" className="icon-btn" onClick={onBack} aria-label="Back" title="Back">
            <span aria-hidden="true">←</span>
          </button>
          <GameMenu
            needRefresh={needRefresh}
            onCheckUpdate={onCheckUpdate}
            onReloadUpdate={onReloadUpdate}
          />
        </div>
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
