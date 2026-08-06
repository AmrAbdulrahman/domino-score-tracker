export const SHARE_PARAM = 'game'

export function encodeGameState(state) {
  const json = JSON.stringify(state)
  const bytes = new TextEncoder().encode(json)
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function isValidGameState(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof value.goal === 'number' &&
    Array.isArray(value.players) &&
    value.players.every(
      (p) =>
        p &&
        typeof p.name === 'string' &&
        typeof p.total === 'number' &&
        Array.isArray(p.history),
    )
  )
}

export function decodeGameState(encoded) {
  const padded = encoded.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(padded)
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  const json = new TextDecoder().decode(bytes)
  const parsed = JSON.parse(json)

  if (!isValidGameState(parsed)) {
    throw new Error('Invalid shared game state')
  }

  return parsed
}

export function tryDecodeGameState(encoded) {
  try {
    return decodeGameState(encoded)
  } catch {
    return null
  }
}

export function buildShareUrl(state) {
  const url = new URL(window.location.href)
  url.search = ''
  url.hash = ''
  url.searchParams.set(SHARE_PARAM, encodeGameState(state))
  return url.toString()
}
