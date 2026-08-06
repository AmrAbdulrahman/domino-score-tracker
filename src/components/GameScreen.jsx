import PlayerCard from './PlayerCard'
import ShareGameButton from './ShareGameButton'
import GameMenu from './GameMenu'
import { describeResult, rankPlayers } from '../lib/ranking'

export default function GameScreen({
  state,
  onAdjustScore,
  onNewGame,
  onEndGame,
  onShowHistory,
  historyCount,
}) {
  const { players, goal, status } = state
  const hasScored = players.some((p) => p.total > 0)
  const ranked = rankPlayers(players)
  const rankById = new Map(ranked.map((p) => [p.id, p]))

  return (
    <div className="screen game-screen">
      <header className="game-header">
        <div>
          <h1>Domino Score Tracker</h1>
          <p className="subtitle">Goal: {goal} points</p>
        </div>
        <div className="game-header-actions">
          <ShareGameButton state={state} />
          <GameMenu
            historyCount={historyCount}
            onShowHistory={onShowHistory}
            onEndGame={onEndGame}
            canEndGame={status === 'playing'}
            onNewGame={onNewGame}
          />
        </div>
      </header>

      {status === 'finished' && <div className="winner-banner">{describeResult(ranked)}</div>}

      <div className="player-grid">
        {players.map((player) => {
          const { rank, isTied } = rankById.get(player.id)
          return (
            <PlayerCard
              key={player.id}
              player={player}
              goal={goal}
              rank={hasScored ? rank : null}
              isTied={hasScored && isTied}
              isWinner={status === 'finished' && rank === 1 && !isTied}
              disabled={status === 'finished'}
              onAdjust={(delta) => onAdjustScore(player.id, delta)}
            />
          )
        })}
      </div>
    </div>
  )
}
