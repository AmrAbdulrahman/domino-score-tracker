import { useCallback, useEffect, useState } from 'react'
import SetupScreen from './components/SetupScreen'
import GameScreen from './components/GameScreen'
import GameHistoryScreen from './components/GameHistoryScreen'
import InstallAppButton from './components/InstallAppButton'
import SoundToggleButton from './components/SoundToggleButton'
import UpdateAvailableBanner from './components/UpdateAvailableBanner'
import { useLocalStorageState } from './hooks/useLocalStorageState'
import { adjustScore, createHistoryEntry, createInitialState, startGame } from './lib/gameLogic'
import { playScoreBeep } from './lib/beep'
import { SHARE_PARAM, tryDecodeGameState } from './lib/shareGame'

const GAME_STORAGE_KEY = 'domino-score-tracker/game'
const HISTORY_STORAGE_KEY = 'domino-score-tracker/history'
const SOUND_MUTED_KEY = 'domino-score-tracker/sound-muted'

export default function App() {
  const [state, setState] = useLocalStorageState(GAME_STORAGE_KEY, createInitialState)
  const [gameHistory, setGameHistory] = useLocalStorageState(HISTORY_STORAGE_KEY, () => [])
  const [muted, setMuted] = useLocalStorageState(SOUND_MUTED_KEY, () => false)
  const [showHistory, setShowHistory] = useState(false)

  const handleStart = useCallback(
    (names, goal) => setState(startGame(names, goal)),
    [setState],
  )

  const handleAdjustScore = useCallback(
    (playerId, delta) => {
      setState((prev) => adjustScore(prev, playerId, delta))
      if (!muted && delta > 0) playScoreBeep()
    },
    [setState, muted],
  )

  const handleNewGame = useCallback(() => {
    if (!window.confirm('Start a new game? This will clear the current scores.')) return

    if (state.players.length > 0) {
      setGameHistory((log) => [createHistoryEntry(state), ...log])
    }
    setState(createInitialState())
  }, [state, setState, setGameHistory])

  useEffect(() => {
    const encoded = new URLSearchParams(window.location.search).get(SHARE_PARAM)
    if (!encoded) return

    const cleanUrl = () => window.history.replaceState({}, '', window.location.pathname)
    const shared = tryDecodeGameState(encoded)

    if (!shared) {
      window.alert("That share link looks invalid or corrupted — couldn't load the game.")
      cleanUrl()
      return
    }

    if (state.status !== 'setup') {
      const proceed = window.confirm('Load the shared game? This will replace your current game.')
      if (!proceed) {
        cleanUrl()
        return
      }
      if (state.players.length > 0) {
        setGameHistory((log) => [createHistoryEntry(state), ...log])
      }
    }

    setState(shared)
    cleanUrl()
    // Only ever run once, against whatever game was loaded from localStorage at mount.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      <UpdateAvailableBanner />
      {screen}
      <SoundToggleButton muted={muted} onToggle={() => setMuted((m) => !m)} />
      <InstallAppButton />
    </>
  )
}
