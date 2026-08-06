import { useState } from 'react'
import { PIP_VALUES } from '../lib/gameLogic'
import ScoreHistoryTable from './ScoreHistoryTable'

export default function PlayerCard({ player, goal, isWinner, isLeader, disabled, onAdjust }) {
  const [showHistory, setShowHistory] = useState(false)
  const [picker, setPicker] = useState(null) // null | 'add' | 'subtract'
  const progress = Math.min(100, Math.round((player.total / goal) * 100))

  function togglePicker(mode) {
    setPicker((current) => (current === mode ? null : mode))
  }

  function choosePipValue(value) {
    onAdjust(picker === 'subtract' ? -value : value)
    setPicker(null)
  }

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

      <div className="score-controls">
        <button
          type="button"
          className="btn-adjust btn-minus"
          aria-label={`Subtract points from ${player.name}`}
          aria-pressed={picker === 'subtract'}
          onClick={() => togglePicker('subtract')}
          disabled={disabled}
        >
          −
        </button>
        <button
          type="button"
          className="btn-adjust btn-plus"
          aria-label={`Add points to ${player.name}`}
          aria-pressed={picker === 'add'}
          onClick={() => togglePicker('add')}
          disabled={disabled}
        >
          +
        </button>
      </div>

      {picker && (
        <div className={`picker picker-${picker}`}>
          {PIP_VALUES.map((value) => (
            <button
              key={value}
              type="button"
              className="picker-option"
              onClick={() => choosePipValue(value)}
            >
              {value}
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        className="btn-link history-toggle"
        onClick={() => setShowHistory((v) => !v)}
        disabled={player.history.length === 0}
      >
        {showHistory ? 'Hide history' : 'Show history'}
        {player.history.length > 0 ? ` (${player.history.length})` : ''}
      </button>

      {showHistory && <ScoreHistoryTable history={player.history} />}
    </div>
  )
}
