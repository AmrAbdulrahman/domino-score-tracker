import { useEffect, useRef, useState } from 'react'

function UpdateMenuItem({ needRefresh, onCheck, onReload }) {
  const [status, setStatus] = useState('idle') // idle | checking | up-to-date | error

  useEffect(() => {
    if (needRefresh) setStatus('idle')
  }, [needRefresh])

  async function handleClick() {
    if (needRefresh) {
      onReload()
      return
    }

    setStatus('checking')
    try {
      await onCheck()
      // give the service worker's "waiting" event a moment to fire after update() resolves
      setTimeout(() => {
        setStatus((current) => (current === 'checking' ? 'up-to-date' : current))
      }, 1200)
    } catch {
      setStatus('error')
    }
  }

  let label = 'Check for Updates'
  if (needRefresh) label = 'Reload to update'
  else if (status === 'checking') label = 'Checking…'
  else if (status === 'up-to-date') label = "You're up to date"
  else if (status === 'error') label = "Couldn't check — try again"

  return (
    <button
      type="button"
      role="menuitem"
      onClick={handleClick}
      disabled={status === 'checking'}
      className={needRefresh ? 'game-menu-item-highlight' : undefined}
    >
      <span aria-hidden="true">🔄</span> {label}
    </button>
  )
}

export default function GameMenu({
  historyCount,
  onShowHistory,
  onShare,
  muted,
  onToggleSound,
  onEndGame,
  canEndGame,
  onNewGame,
  onDeleteGame,
  needRefresh,
  onCheckUpdate,
  onReloadUpdate,
}) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!open) return

    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  function choose(action) {
    setOpen(false)
    action()
  }

  return (
    <div className="game-menu" ref={menuRef}>
      <button
        type="button"
        className="icon-btn"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Menu"
        title="Menu"
      >
        <span aria-hidden="true">☰</span>
      </button>

      {open && (
        <div className="game-menu-dropdown" role="menu">
          {onShowHistory && (
            <button type="button" role="menuitem" onClick={() => choose(onShowHistory)}>
              <span aria-hidden="true">🎲</span> Games{historyCount > 0 ? ` (${historyCount})` : ''}
            </button>
          )}
          {onShare && (
            <button type="button" role="menuitem" onClick={() => choose(onShare)}>
              <span aria-hidden="true">📤</span> Share Game
            </button>
          )}
          {onToggleSound && (
            <button type="button" role="menuitem" onClick={() => choose(onToggleSound)}>
              <span aria-hidden="true">{muted ? '🔇' : '🔊'}</span>{' '}
              {muted ? 'Unmute Sound' : 'Mute Sound'}
            </button>
          )}
          {canEndGame && (
            <button
              type="button"
              role="menuitem"
              className="game-menu-item-danger"
              onClick={() => choose(onEndGame)}
            >
              <span aria-hidden="true">🏁</span> End Game
            </button>
          )}
          {onNewGame && (
            <button type="button" role="menuitem" onClick={() => choose(onNewGame)}>
              <span aria-hidden="true">➕</span> New Game
            </button>
          )}
          {onDeleteGame && (
            <button
              type="button"
              role="menuitem"
              className="game-menu-item-danger"
              onClick={() => choose(onDeleteGame)}
            >
              <span aria-hidden="true">🗑</span> Delete Game
            </button>
          )}
          {onCheckUpdate && (
            <UpdateMenuItem needRefresh={needRefresh} onCheck={onCheckUpdate} onReload={onReloadUpdate} />
          )}
        </div>
      )}
    </div>
  )
}
