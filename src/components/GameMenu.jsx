import { useEffect, useRef, useState } from 'react'

export default function GameMenu({ historyCount, onShowHistory, onEndGame, canEndGame, onNewGame }) {
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
          <button type="button" role="menuitem" onClick={() => choose(onShowHistory)}>
            Games{historyCount > 0 ? ` (${historyCount})` : ''}
          </button>
          {canEndGame && (
            <button
              type="button"
              role="menuitem"
              className="game-menu-item-danger"
              onClick={() => choose(onEndGame)}
            >
              End Game
            </button>
          )}
          <button type="button" role="menuitem" onClick={() => choose(onNewGame)}>
            New Game
          </button>
        </div>
      )}
    </div>
  )
}
