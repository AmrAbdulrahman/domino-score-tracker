export const MIN_PLAYERS = 2
export const MAX_PLAYERS = 4
export const PIP_VALUES = [1, 2, 3, 4, 5, 6]
export const GOAL_PRESETS = [21, 31, 41, 51, 61, 71, 81, 91]

export function createInitialState() {
  return {
    status: 'setup',
    goal: null,
    winnerId: null,
    players: [],
    archived: false,
  }
}

export function startGame(names, goal) {
  return {
    status: 'playing',
    goal,
    winnerId: null,
    archived: false,
    players: names.map((name, index) => ({
      id: `p${index}-${Date.now()}`,
      name,
      total: 0,
      history: [],
    })),
  }
}

export function adjustScore(state, playerId, delta) {
  const players = state.players.map((player) => {
    if (player.id !== playerId) return player

    const total = player.total + delta
    return {
      ...player,
      total,
      history: [...player.history, { delta, total }],
    }
  })

  const winner = players
    .filter((p) => p.total >= state.goal)
    .sort((a, b) => b.total - a.total)[0]

  return {
    ...state,
    players,
    status: winner ? 'finished' : 'playing',
    winnerId: winner ? winner.id : null,
  }
}

export function endGame(state) {
  if (state.players.length === 0) return state

  const winner = [...state.players].sort((a, b) => b.total - a.total)[0]

  return {
    ...state,
    status: 'finished',
    winnerId: winner.id,
  }
}

export function createHistoryEntry(state) {
  const winner = state.players.find((p) => p.id === state.winnerId)

  return {
    id: `g${Date.now()}`,
    endedAt: new Date().toISOString(),
    status: state.status === 'finished' ? 'finished' : 'abandoned',
    goal: state.goal,
    winnerName: winner ? winner.name : null,
    players: state.players.map((p) => ({
      name: p.name,
      total: p.total,
      history: p.history,
    })),
  }
}
