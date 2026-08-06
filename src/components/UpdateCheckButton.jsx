import { useEffect, useState } from 'react'

export default function UpdateCheckButton({ needRefresh, onCheck, onReload }) {
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
      className={needRefresh ? 'btn-primary' : 'btn-secondary'}
      onClick={handleClick}
      disabled={status === 'checking'}
    >
      <span aria-hidden="true">🔄</span> {label}
    </button>
  )
}
