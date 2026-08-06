import { useState } from 'react'

function emptyEntries(players) {
  return Object.fromEntries(players.map((p) => [p.id, { points: '', discount: '' }]))
}

export default function RoundForm({ players, round, onSubmit }) {
  const [entries, setEntries] = useState(() => emptyEntries(players))

  function handleChange(playerId, field, value) {
    setEntries((prev) => ({
      ...prev,
      [playerId]: { ...prev[playerId], [field]: value },
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(entries)
    setEntries(emptyEntries(players))
  }

  return (
    <form className="card round-form" onSubmit={handleSubmit}>
      <h2>Round {round}</h2>
      <div className="round-form-rows">
        {players.map((player) => (
          <div className="round-form-row" key={player.id}>
            <span className="round-form-name">{player.name}</span>
            <label className="round-form-field">
              <span>Points</span>
              <input
                type="number"
                inputMode="numeric"
                placeholder="0"
                value={entries[player.id]?.points ?? ''}
                onChange={(e) => handleChange(player.id, 'points', e.target.value)}
              />
            </label>
            <label className="round-form-field">
              <span>Discount</span>
              <input
                type="number"
                inputMode="numeric"
                placeholder="0"
                min="0"
                value={entries[player.id]?.discount ?? ''}
                onChange={(e) => handleChange(player.id, 'discount', e.target.value)}
              />
            </label>
          </div>
        ))}
      </div>
      <button type="submit" className="btn-primary btn-block">
        Submit Round
      </button>
    </form>
  )
}
