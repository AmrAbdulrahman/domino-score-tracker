import { useState } from 'react'
import { GOAL_PRESETS, MAX_PLAYERS, MIN_PLAYERS } from '../lib/gameLogic'
import UpdateCheckButton from './UpdateCheckButton'

export default function SetupScreen({
  onStart,
  onShowHistory,
  historyCount,
  needRefresh,
  onCheckUpdate,
  onReloadUpdate,
}) {
  const [playerCount, setPlayerCount] = useState(2)
  const [names, setNames] = useState(['', ''])
  const [goal, setGoal] = useState('51')
  const [error, setError] = useState('')

  function handlePlayerCountChange(count) {
    setPlayerCount(count)
    setNames((prev) => {
      const next = prev.slice(0, count)
      while (next.length < count) next.push('')
      return next
    })
  }

  function handleNameChange(index, value) {
    setNames((prev) => prev.map((n, i) => (i === index ? value : n)))
  }

  function handleSubmit(e) {
    e.preventDefault()

    const trimmed = names.map((n) => n.trim())
    if (trimmed.some((n) => !n)) {
      setError('Every player needs a name.')
      return
    }

    const lower = trimmed.map((n) => n.toLowerCase())
    if (new Set(lower).size !== lower.length) {
      setError('Player names must be unique.')
      return
    }

    const goalNumber = Number(goal)
    if (!Number.isFinite(goalNumber) || goalNumber <= 0) {
      setError('Goal points must be a positive number.')
      return
    }

    setError('')
    onStart(trimmed, goalNumber)
  }

  return (
    <div className="screen setup-screen">
      <div className="card setup-card">
        <div className="setup-card-header">
          <h1>Domino Score Tracker</h1>
          <div className="setup-card-header-actions">
            <UpdateCheckButton needRefresh={needRefresh} onCheck={onCheckUpdate} onReload={onReloadUpdate} />
            <button type="button" className="btn-link" onClick={onShowHistory}>
              Games{historyCount > 0 ? ` (${historyCount})` : ''}
            </button>
          </div>
        </div>
        <p className="subtitle">Set up your players and the goal score to start a game.</p>

        <form onSubmit={handleSubmit}>
          <fieldset className="field-group">
            <legend>Number of players</legend>
            <div className="segmented">
              {Array.from(
                { length: MAX_PLAYERS - MIN_PLAYERS + 1 },
                (_, i) => MIN_PLAYERS + i,
              ).map((count) => (
                <button
                  key={count}
                  type="button"
                  className={`segmented-option ${count === playerCount ? 'active' : ''}`}
                  onClick={() => handlePlayerCountChange(count)}
                >
                  {count}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="field-group">
            <legend>Player names</legend>
            <div className="name-inputs">
              {names.map((name, index) => (
                <input
                  key={index}
                  type="text"
                  value={name}
                  maxLength={20}
                  placeholder={`Player ${index + 1}`}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="field-group">
            <legend>Goal points</legend>
            <div className="goal-presets">
              {GOAL_PRESETS.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`goal-preset-option ${Number(goal) === value ? 'active' : ''}`}
                  onClick={() => setGoal(String(value))}
                >
                  {value}
                </button>
              ))}
            </div>
            <label className="field-sublabel" htmlFor="goal">
              Or set a custom value
            </label>
            <input
              id="goal"
              aria-label="Custom goal points"
              type="number"
              min="1"
              inputMode="numeric"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </fieldset>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="btn-primary btn-block">
            Start Game
          </button>
        </form>
      </div>
    </div>
  )
}
