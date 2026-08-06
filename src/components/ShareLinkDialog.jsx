export default function ShareLinkDialog({ shareUrl, copied, onClose }) {
  if (!shareUrl) return null

  return (
    <div className="install-tip-overlay" onClick={onClose}>
      <div className="install-tip" onClick={(e) => e.stopPropagation()}>
        <p>{copied ? 'Link copied to clipboard!' : 'Copy this link to share the game:'}</p>
        <input
          className="share-link-input"
          type="text"
          readOnly
          value={shareUrl}
          onFocus={(e) => e.target.select()}
        />
        <button type="button" className="btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}
