import { useState } from 'react'

export default function PlayerCard({ player, goal, isWinner, isLeader }) {
  const [showHistory, setShowHistory] = useState(false)
  const progress = Math.min(100, Math.round((player.total / goal) * 100))

  return (
    <div className={`player-card ${isWinner ? 'is-winner' : ''}`}>
      <div className="player-card-header">
        <div className="player-name">
          {player.name}
          {isWinner && <span className="badge badge-winner">Winner</span>}
          {!isWinner && isLeader && player.history.length > 0 && (
            <span className="badge badge-leader">Leading</span>
          )}
        </div>
        <div className="player-total">{player.total}</div>
      </div>

      <div className="progress-track" aria-hidden="true">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="progress-label">
        {player.total} / {goal} points
      </div>

      <button
        type="button"
        className="btn-link history-toggle"
        onClick={() => setShowHistory((v) => !v)}
        disabled={player.history.length === 0}
      >
        {showHistory ? 'Hide history' : 'Show history'}
        {player.history.length > 0 ? ` (${player.history.length})` : ''}
      </button>

      {showHistory && (
        <table className="history-table">
          <thead>
            <tr>
              <th>Round</th>
              <th>+Points</th>
              <th>-Discount</th>
              <th>Net</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {player.history.map((entry) => (
              <tr key={entry.round}>
                <td>{entry.round}</td>
                <td>{entry.points}</td>
                <td>{entry.discount}</td>
                <td className={entry.net < 0 ? 'negative' : ''}>
                  {entry.net > 0 ? `+${entry.net}` : entry.net}
                </td>
                <td>{entry.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
