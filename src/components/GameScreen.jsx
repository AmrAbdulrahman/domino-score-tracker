import PlayerCard from './PlayerCard'

export default function GameScreen({ state, onAdjustScore, onNewGame, onShowHistory, historyCount }) {
  const { players, goal, status, winnerId } = state
  const winner = players.find((p) => p.id === winnerId)
  const leaderTotal = Math.max(...players.map((p) => p.total))

  return (
    <div className="screen game-screen">
      <header className="game-header">
        <div>
          <h1>Domino Score Tracker</h1>
          <p className="subtitle">Goal: {goal} points</p>
        </div>
        <div className="game-header-actions">
          {historyCount > 0 && (
            <button type="button" className="btn-secondary" onClick={onShowHistory}>
              Game History ({historyCount})
            </button>
          )}
          <button type="button" className="btn-secondary" onClick={onNewGame}>
            New Game
          </button>
        </div>
      </header>

      {status === 'finished' && winner && (
        <div className="winner-banner">
          🏆 {winner.name} wins with {winner.total} points!
        </div>
      )}

      <div className="player-grid">
        {players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            goal={goal}
            isWinner={player.id === winnerId}
            isLeader={player.total === leaderTotal && leaderTotal > 0}
            disabled={status === 'finished'}
            onAdjust={(delta) => onAdjustScore(player.id, delta)}
          />
        ))}
      </div>
    </div>
  )
}
