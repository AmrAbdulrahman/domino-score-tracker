import PlayerCard from './PlayerCard'
import RoundForm from './RoundForm'

export default function GameScreen({ state, onSubmitRound, onNewGame }) {
  const { players, goal, round, status, winnerId } = state
  const winner = players.find((p) => p.id === winnerId)
  const leaderTotal = Math.max(...players.map((p) => p.total))

  return (
    <div className="screen game-screen">
      <header className="game-header">
        <div>
          <h1>Domino Score Tracker</h1>
          <p className="subtitle">Goal: {goal} points</p>
        </div>
        <button type="button" className="btn-secondary" onClick={onNewGame}>
          New Game
        </button>
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
          />
        ))}
      </div>

      {status === 'playing' && (
        <RoundForm players={players} round={round} onSubmit={onSubmitRound} />
      )}
    </div>
  )
}
