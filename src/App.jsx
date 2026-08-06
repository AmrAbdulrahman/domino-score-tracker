import { useCallback } from 'react'
import SetupScreen from './components/SetupScreen'
import GameScreen from './components/GameScreen'
import { useLocalStorageState } from './hooks/useLocalStorageState'
import { adjustScore, createInitialState, startGame } from './lib/gameLogic'

const STORAGE_KEY = 'domino-score-tracker/game'

export default function App() {
  const [state, setState] = useLocalStorageState(STORAGE_KEY, createInitialState)

  const handleStart = useCallback(
    (names, goal) => setState(startGame(names, goal)),
    [setState],
  )

  const handleAdjustScore = useCallback(
    (playerId, delta) => setState((prev) => adjustScore(prev, playerId, delta)),
    [setState],
  )

  const handleNewGame = useCallback(() => {
    if (window.confirm('Start a new game? This will clear the current scores.')) {
      setState(createInitialState())
    }
  }, [setState])

  if (state.status === 'setup') {
    return <SetupScreen onStart={handleStart} />
  }

  return (
    <GameScreen state={state} onAdjustScore={handleAdjustScore} onNewGame={handleNewGame} />
  )
}
