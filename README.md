# Domino Score Tracker

A small React app for tracking scores in a domino game.

- Set up 2 to 4 players and a goal score
- Each player card has +/- buttons to add or subtract points (1-6) as the game is played
- Every player's card shows a running total and a full score history
- First player to reach the goal score is declared the winner
- Game state is saved to `localStorage`, so a page refresh won't lose progress; starting a new
  game archives the finished one to a persistent game history log
- Installable as a PWA — "Add to Home Screen" on mobile gives it a standalone, app-like icon

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to Vercel

This is a standard Vite + React app and deploys to Vercel with zero configuration
(a `vercel.json` is included that points at `npm run build` and the `dist` output).
Import the repository in Vercel, or run:

```bash
vercel deploy
```
