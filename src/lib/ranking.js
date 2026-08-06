export function rankPlayers(players) {
  const sorted = [...players].sort((a, b) => b.total - a.total)

  let rank = 0
  let prevTotal = null
  const ranked = sorted.map((player, index) => {
    if (player.total !== prevTotal) {
      rank = index + 1
      prevTotal = player.total
    }
    return { ...player, rank }
  })

  return ranked.map((player) => ({
    ...player,
    isTied: ranked.filter((p) => p.total === player.total).length > 1,
  }))
}

const RANK_LABELS = { 1: '1st', 2: '2nd', 3: '3rd', 4: '4th' }

export function formatRank(rank) {
  return RANK_LABELS[rank] ?? `${rank}th`
}

export function describeResult(rankedPlayers) {
  const winners = rankedPlayers.filter((p) => p.rank === 1)
  if (winners.length === 0) return ''

  if (winners.length === 1) {
    return `🏆 ${winners[0].name} wins with ${winners[0].total} points!`
  }

  const names = winners.map((w) => w.name)
  const namesText =
    names.length === 2
      ? `${names[0]} and ${names[1]}`
      : `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`

  return `🤝 It's a tie between ${namesText} at ${winners[0].total} points!`
}
