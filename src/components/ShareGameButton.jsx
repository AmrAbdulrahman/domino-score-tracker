import { useState } from 'react'
import { buildShareUrl } from '../lib/shareGame'

export default function ShareGameButton({ state }) {
  const [shareUrl, setShareUrl] = useState('')
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const url = buildShareUrl(state)

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Domino Score Tracker', url })
        return
      } catch {
        // user cancelled the native share sheet, or it isn't fully supported here;
        // fall back to the copy-link dialog below
      }
    }

    setCopied(false)
    setShareUrl(url)

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url)
        setCopied(true)
      } catch {
        // clipboard write blocked; the dialog still lets the user copy manually
      }
    }
  }

  return (
    <>
      <button type="button" className="btn-secondary" onClick={handleShare}>
        <span aria-hidden="true">📤</span> Share
      </button>

      {shareUrl && (
        <div className="install-tip-overlay" onClick={() => setShareUrl('')}>
          <div className="install-tip" onClick={(e) => e.stopPropagation()}>
            <p>{copied ? 'Link copied to clipboard!' : 'Copy this link to share the game:'}</p>
            <input
              className="share-link-input"
              type="text"
              readOnly
              value={shareUrl}
              onFocus={(e) => e.target.select()}
            />
            <button type="button" className="btn-secondary" onClick={() => setShareUrl('')}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}
