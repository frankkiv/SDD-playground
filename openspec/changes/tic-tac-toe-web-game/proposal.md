## Why

This project introduces a browser-based Tic-Tac-Toe game as a greenfield web application. The goal is to provide a fun, polished two-player experience that runs entirely in the browser with no backend required.

## What Changes

- New React web application bootstrapped from scratch
- Local two-player mode: two players share the same device and take turns clicking on the board
- Customizable player names entered before the game starts
- Multi-round scoring that persists across rounds within a session
- Alternating first-turn: the player who went second in the previous round goes first in the next
- Animated winning line drawn across the three winning cells upon victory
- Playful visual style: rounded corners, smooth animations, vibrant colors

## Capabilities

### New Capabilities

- `game-board`: The 3x3 interactive grid — cell rendering, click handling, X/O placement, and win/draw detection logic
- `game-session`: Overall game lifecycle — setup screen (player name input), turn management, round result handling, and "play again" vs "restart" flows
- `scoreboard`: Multi-round score tracking displayed per player plus draw count, persisted in component state for the session
- `win-animation`: Animated line drawn through the winning cells upon victory, with cell highlight effect

### Modified Capabilities

## Impact

- New project: no existing code affected
- Dependencies: React, a build tool (Vite), and CSS (plain or CSS Modules)
- No backend, no database, no authentication — purely client-side
