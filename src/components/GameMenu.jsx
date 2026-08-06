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
  else if (status === 'up-to-date') label = "You're on the latest version"
  else if (status === 'error') label = "Couldn't check — try again"

  return (
    <button
      type="button"
      role="menuitem"
      onClick={handleClick}
      disabled={status === 'checking'}
      className={needRefresh ? 'game-menu-item-highlight' : undefined}
    >
      {label}
    </button>
  )
}

export default function GameMenu({
  historyCount,
  onShowHistory,
  onEndGame,
  canEndGame,
  onNewGame,
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
        className="btn-secondary game-menu-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span aria-hidden="true">☰</span> Menu
        {needRefresh && <span className="game-menu-badge" aria-hidden="true" />}
      </button>

      {open && (
        <div className="game-menu-dropdown" role="menu">
          <button type="button" role="menuitem" onClick={() => choose(onShowHistory)}>
            Games{historyCount > 0 ? ` (${historyCount})` : ''}
          </button>
          <UpdateMenuItem needRefresh={needRefresh} onCheck={onCheckUpdate} onReload={onReloadUpdate} />
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
