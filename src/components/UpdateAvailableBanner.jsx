export default function UpdateAvailableBanner({ needRefresh, onReload }) {
  if (!needRefresh) return null

  return (
    <div className="update-banner">
      <span>A new version of Domino Score Tracker is available.</span>
      <button type="button" className="update-banner-button" onClick={onReload}>
        Reload to update
      </button>
    </div>
  )
}
