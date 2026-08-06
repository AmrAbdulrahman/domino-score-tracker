import { useCallback, useState } from 'react'
import SetupScreen from './components/SetupScreen'
import GameScreen from './components/GameScreen'
import GameHistoryScreen from './components/GameHistoryScreen'
import InstallAppButton from './components/InstallAppButton'
import { useLocalStorageState } from './hooks/useLocalStorageState'
import { adjustScore, createHistoryEntry, createInitialState, startGame } from './lib/gameLogic'

const GAME_STORAGE_KEY = 'domino-score-tracker/game'
const HISTORY_STORAGE_KEY = 'domino-score-tracker/history'

export default function App() {
  const [state, setState] = useLocalStorageState(GAME_STORAGE_KEY, createInitialState)
  const [gameHistory, setGameHistory] = useLocalStorageState(HISTORY_STORAGE_KEY, () => [])
  const [showHistory, setShowHistory] = useState(false)

  const handleStart = useCallback(
    (names, goal) => setState(startGame(names, goal)),
    [setState],
  )

  const handleAdjustScore = useCallback(
    (playerId, delta) => setState((prev) => adjustScore(prev, playerId, delta)),
    [setState],
  )

  const handleNewGame = useCallback(() => {
    if (!window.confirm('Start a new game? This will clear the current scores.')) return

    if (state.players.length > 0) {
      setGameHistory((log) => [createHistoryEntry(state), ...log])
    }
    setState(createInitialState())
  }, [state, setState, setGameHistory])

  let screen
  if (showHistory) {
    screen = <GameHistoryScreen games={gameHistory} onBack={() => setShowHistory(false)} />
  } else if (state.status === 'setup') {
    screen = (
      <SetupScreen
        onStart={handleStart}
        onShowHistory={() => setShowHistory(true)}
        historyCount={gameHistory.length}
      />
    )
  } else {
    screen = (
      <GameScreen
        state={state}
        onAdjustScore={handleAdjustScore}
        onNewGame={handleNewGame}
        onShowHistory={() => setShowHistory(true)}
        historyCount={gameHistory.length}
      />
    )
  }

  return (
    <>
      {screen}
      <InstallAppButton />
    </>
  )
}
