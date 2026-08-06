import { useRegisterSW } from 'virtual:pwa-register/react'

const UPDATE_CHECK_INTERVAL_MS = 60 * 60 * 1000

export default function UpdateAvailableBanner() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return
      setInterval(() => registration.update(), UPDATE_CHECK_INTERVAL_MS)
    },
  })

  if (!needRefresh) return null

  return (
    <div className="update-banner">
      <span>A new version of Domino Score Tracker is available.</span>
      <button type="button" className="update-banner-button" onClick={() => updateServiceWorker(true)}>
        Reload to update
      </button>
    </div>
  )
}
