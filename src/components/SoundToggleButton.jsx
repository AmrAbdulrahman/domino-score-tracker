export default function SoundToggleButton({ muted, onToggle }) {
  return (
    <button
      type="button"
      className="sound-fab"
      onClick={onToggle}
      aria-pressed={muted}
      aria-label={muted ? 'Unmute score sound' : 'Mute score sound'}
      title={muted ? 'Unmute score sound' : 'Mute score sound'}
    >
      <span aria-hidden="true">{muted ? '🔇' : '🔊'}</span>
    </button>
  )
}
