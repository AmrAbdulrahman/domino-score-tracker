import { useCallback, useEffect, useRef, useState } from 'react'
import SetupScreen from './components/SetupScreen'
import GameScreen from './components/GameScreen'
import GameHistoryScreen from './components/GameHistoryScreen'
import GameDetailScreen from './components/GameDetailScreen'
import InstallAppButton from './components/InstallAppButton'
import SoundToggleButton from './components/SoundToggleButton'
import UpdateAvailableBanner from './components/UpdateAvailableBanner'
import { useLocalStorageState } from './hooks/useLocalStorageState'
import { usePwaUpdate } from './hooks/usePwaUpdate'
import {
  adjustScore,
  createHistoryEntry,
  createInitialState,
  endGame,
  startGame,
} from './lib/gameLogic'
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
  const [viewingGameId, setViewingGameId] = useState(null)
  const { needRefresh, checkForUpdate, reloadForUpdate } = usePwaUpdate()

  const handleDeleteGame = useCallback(
    (id) => {
      setGameHistory((log) => log.filter((g) => g.id !== id))
      setViewingGameId((current) => (current === id ? null : current))
    },
    [setGameHistory],
  )

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

  const handleEndGame = useCallback(() => {
    if (state.status !== 'playing') return

    const leader = [...state.players].sort((a, b) => b.total - a.total)[0]
    const confirmed = window.confirm(
      `End the game now? ${leader.name} has the highest score (${leader.total}) and will be declared the winner.`,
    )
    if (!confirmed) return

    setState((prev) => endGame(prev))
  }, [state, setState])

  const handleNewGame = useCallback(() => {
    if (!window.confirm('Start a new game? This will clear the current scores.')) return

    if (state.players.length > 0 && !state.archived) {
      setGameHistory((log) => [createHistoryEntry(state), ...log])
    }
    setState(createInitialState())
  }, [state, setState, setGameHistory])

  const hasArchivedFinishedGameRef = useRef(false)

  useEffect(() => {
    if (state.status !== 'finished') {
      hasArchivedFinishedGameRef.current = false
      return
    }
    if (state.archived || hasArchivedFinishedGameRef.current) return

    hasArchivedFinishedGameRef.current = true
    setGameHistory((log) => [createHistoryEntry(state), ...log])
    setState((prev) => (prev.status === 'finished' ? { ...prev, archived: true } : prev))
  }, [state, setGameHistory, setState])

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
      if (state.players.length > 0 && !state.archived) {
        setGameHistory((log) => [createHistoryEntry(state), ...log])
      }
    }

    setState(shared)
    cleanUrl()
    // Only ever run once, against whatever game was loaded from localStorage at mount.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const viewingGame = viewingGameId ? gameHistory.find((g) => g.id === viewingGameId) : null

  let screen
  if (showHistory && viewingGame) {
    screen = (
      <GameDetailScreen game={viewingGame} onBack={() => setViewingGameId(null)} onDelete={handleDeleteGame} />
    )
  } else if (showHistory) {
    screen = (
      <GameHistoryScreen
        games={gameHistory}
        onBack={() => {
          setShowHistory(false)
          setViewingGameId(null)
        }}
        onViewGame={setViewingGameId}
        onDeleteGame={handleDeleteGame}
      />
    )
  } else if (state.status === 'setup') {
    screen = (
      <SetupScreen
        onStart={handleStart}
        onShowHistory={() => setShowHistory(true)}
        historyCount={gameHistory.length}
        needRefresh={needRefresh}
        onCheckUpdate={checkForUpdate}
        onReloadUpdate={reloadForUpdate}
      />
    )
  } else {
    screen = (
      <GameScreen
        state={state}
        onAdjustScore={handleAdjustScore}
        onNewGame={handleNewGame}
        onEndGame={handleEndGame}
        onShowHistory={() => setShowHistory(true)}
        historyCount={gameHistory.length}
        needRefresh={needRefresh}
        onCheckUpdate={checkForUpdate}
        onReloadUpdate={reloadForUpdate}
      />
    )
  }

  return (
    <>
      <UpdateAvailableBanner needRefresh={needRefresh} onReload={reloadForUpdate} />
      {screen}
      <SoundToggleButton muted={muted} onToggle={() => setMuted((m) => !m)} />
      <InstallAppButton />
    </>
  )
}
