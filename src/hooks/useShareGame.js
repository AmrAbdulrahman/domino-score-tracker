import { useState } from 'react'
import { buildShareUrl } from '../lib/shareGame'

export function useShareGame(state) {
  const [shareUrl, setShareUrl] = useState('')
  const [copied, setCopied] = useState(false)

  async function share() {
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

  return { shareUrl, copied, share, close: () => setShareUrl('') }
}
