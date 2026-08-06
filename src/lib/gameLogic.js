export const MIN_PLAYERS = 2
export const MAX_PLAYERS = 4

export function createInitialState() {
  return {
    status: 'setup',
    goal: null,
    round: 1,
    winnerId: null,
    players: [],
  }
}

export function startGame(names, goal) {
  return {
    status: 'playing',
    goal,
    round: 1,
    winnerId: null,
    players: names.map((name, index) => ({
      id: `p${index}-${Date.now()}`,
      name,
      total: 0,
      history: [],
    })),
  }
}

export function submitRound(state, entries) {
  const players = state.players.map((player) => {
    const entry = entries[player.id] || {}
    const points = Number(entry.points) || 0
    const discount = Number(entry.discount) || 0
    const net = points - discount
    const total = player.total + net

    return {
      ...player,
      total,
      history: [
        ...player.history,
        { round: state.round, points, discount, net, total },
      ],
    }
  })

  const winner = players
    .filter((p) => p.total >= state.goal)
    .sort((a, b) => b.total - a.total)[0]

  return {
    ...state,
    players,
    round: state.round + 1,
    status: winner ? 'finished' : 'playing',
    winnerId: winner ? winner.id : null,
  }
}
