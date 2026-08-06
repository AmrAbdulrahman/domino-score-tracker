import { useState } from 'react'
import { describeResult, formatRank, rankPlayers } from '../lib/ranking'
import ScoreHistoryTable from './ScoreHistoryTable'
import GameMenu from './GameMenu'

export default function GameDetailScreen({ game, onBack, onDelete }) {
  const [expandedPlayer, setExpandedPlayer] = useState(null)
  const ranked = rankPlayers(game.players)
  const hasScored = game.players.some((p) => p.total > 0)

  function handleDelete() {
    if (window.confirm('Delete this game? This cannot be undone.')) {
      onDelete(game.id)
    }
  }

  return (
    <div className="screen">
      <header className="game-header">
        <div className="game-header-title-row">
          <button type="button" className="icon-btn" onClick={onBack} aria-label="Back" title="Back">
            <span aria-hidden="true">←</span>
          </button>
          <div>
            <h1>Game Details</h1>
            <p className="subtitle">
              {new Date(game.endedAt).toLocaleString()} · Goal {game.goal} points
            </p>
          </div>
        </div>
        <div className="game-header-actions">
          <GameMenu onDeleteGame={handleDelete} />
        </div>
      </header>

      <div className="winner-banner">
        {game.status === 'finished' ? describeResult(ranked) : 'Ended without a winner'}
      </div>

      <div className="player-grid">
        {ranked.map((player) => (
          <div key={player.name} className={`card player-card ${player.rank === 1 && !player.isTied ? 'is-winner' : ''}`}>
            <div className="player-card-header">
              <div className="player-name">
                {hasScored && <span className="badge badge-rank">{formatRank(player.rank)}</span>}
                {player.name}
                {hasScored && player.rank === 1 && !player.isTied && (
                  <span className="badge badge-winner">Winner</span>
                )}
                {hasScored && player.isTied && <span className="badge badge-tie">Tie</span>}
              </div>
              <div className="player-total">{player.total}</div>
            </div>

            <button
              type="button"
              className="btn-link history-toggle"
              onClick={() =>
                setExpandedPlayer((current) => (current === player.name ? null : player.name))
              }
              disabled={player.history.length === 0}
            >
              {expandedPlayer === player.name ? 'Hide history' : 'Show history'}
              {player.history.length > 0 ? ` (${player.history.length})` : ''}
            </button>

            {expandedPlayer === player.name && <ScoreHistoryTable history={player.history} />}
          </div>
        ))}
      </div>
    </div>
  )
}
