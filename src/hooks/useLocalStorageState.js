import { useEffect, useState } from 'react'

export function useLocalStorageState(key, createInitial) {
  const [state, setState] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored ? JSON.parse(stored) : createInitial()
    } catch {
      return createInitial()
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state))
    } catch {
      // localStorage unavailable (private mode, quota, etc.) — game still works in-memory
    }
  }, [key, state])

  return [state, setState]
}
