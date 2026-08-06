import { useState } from 'react'
import { useInstallPrompt } from '../hooks/useInstallPrompt'

export default function InstallAppButton() {
  const { canInstall, isIos, promptInstall } = useInstallPrompt()
  const [showIosTip, setShowIosTip] = useState(false)

  if (!canInstall) return null

  async function handleClick() {
    const { outcome } = await promptInstall()
    if (outcome === 'unavailable' && isIos) setShowIosTip(true)
  }

  return (
    <>
      <button type="button" className="install-fab" onClick={handleClick}>
        <span aria-hidden="true">⬇</span> Install App
      </button>

      {showIosTip && (
        <div className="install-tip-overlay" onClick={() => setShowIosTip(false)}>
          <div className="install-tip" onClick={(e) => e.stopPropagation()}>
            <p>
              To install, tap the <strong>Share</strong> button in Safari's toolbar, then
              choose <strong>Add to Home Screen</strong>.
            </p>
            <button type="button" className="btn-secondary" onClick={() => setShowIosTip(false)}>
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  )
}
