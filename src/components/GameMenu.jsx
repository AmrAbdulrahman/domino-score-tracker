import { useEffect, useRef, useState } from 'react'

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
        className="btn-secondary"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span aria-hidden="true">☰</span> Menu
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
        </div>
      )}
    </div>
  )
}
