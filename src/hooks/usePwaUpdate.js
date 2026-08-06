import { useCallback, useRef } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

const UPDATE_CHECK_INTERVAL_MS = 60 * 60 * 1000

export function usePwaUpdate() {
  const registrationRef = useRef(null)

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      registrationRef.current = registration ?? null
      if (!registration) return
      setInterval(() => registration.update(), UPDATE_CHECK_INTERVAL_MS)
    },
  })

  const checkForUpdate = useCallback(async () => {
    if (!registrationRef.current) return
    await registrationRef.current.update()
  }, [])

  const reloadForUpdate = useCallback(() => {
    updateServiceWorker(true)
  }, [updateServiceWorker])

  return { needRefresh, checkForUpdate, reloadForUpdate }
}
