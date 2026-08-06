import { useCallback } from 'react'
import SetupScreen from './components/SetupScreen'
import GameScreen from './components/GameScreen'
import { useLocalStorageState } from './hooks/useLocalStorageState'
import { createInitialState, startGame, submitRound } from './lib/gameLogic'

const STORAGE_KEY = 'domino-score-tracker/game'

export default function App() {
  const [state, setState] = useLocalStorageState(STORAGE_KEY, createInitialState)

  const handleStart = useCallback(
    (names, goal) => setState(startGame(names, goal)),
    [setState],
  )

  const handleSubmitRound = useCallback(
    (entries) => setState((prev) => submitRound(prev, entries)),
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
    <GameScreen state={state} onSubmitRound={handleSubmitRound} onNewGame={handleNewGame} />
  )
}
