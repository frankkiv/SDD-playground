## Context

Brand new client-side React application with no existing codebase. No backend, no persistence beyond component state within a session. Two players share one device and take turns interacting with the same browser tab.

## Goals / Non-Goals

**Goals:**
- Single-page React app playable entirely in the browser
- Clean component architecture that maps to the four capabilities: game-board, game-session, scoreboard, win-animation
- Playful UI with smooth CSS animations and vibrant styling
- Zero external state management libraries — React useState/useReducer is sufficient

**Non-Goals:**
- Online multiplayer (no WebSocket, no backend)
- AI opponent
- Persistent storage across page refreshes (localStorage, etc.)
- Mobile-native app

## Decisions

### React + Vite (no framework like Next.js)
Pure client-side app with no routing or SSR needs. Vite gives fast HMR and a minimal setup.
Alternatives considered: Create React App (slower, deprecated), Next.js (overkill for a static client game).

### CSS Modules for styling
Scoped styles per component prevent class name collisions. Supports the playful style (custom keyframe animations per component).
Alternatives considered: Tailwind (verbose for animation-heavy UI), styled-components (runtime overhead, unnecessary here).

### useState + prop drilling — no context or Redux
The component tree is shallow: App → GameScreen → Board + Scoreboard. State lifting is simple and readable without a global store.
Alternatives considered: useContext (not needed at this scale), Zustand/Redux (overkill).

### Win detection via lookup table
Pre-define the 8 winning lines as a constant array. After each move, check all 8 lines against the board state.
```
const WIN_LINES = [
  [0,1,2], [3,4,5], [6,7,8],  // rows
  [0,3,6], [1,4,7], [2,5,8],  // cols
  [0,4,8], [2,4,6]            // diagonals
];
```

### Winning line animation via SVG overlay
Render an SVG absolutely positioned over the board. On win, draw a line from the center of the first winning cell to the center of the last, animated with a CSS stroke-dashoffset transition.
Alternatives considered: CSS border on winning cells (cannot do diagonal), canvas (more complex, less accessible).

### Alternating first-turn via round counter
Track roundNumber in state. Even rounds: player 1 goes first. Odd rounds: player 2 goes first. No need to store who went first last round explicitly.

## Risks / Trade-offs

- **SVG line coordinates depend on rendered cell positions** → Use fixed cell size (CSS constant) so coordinates are calculated from known values, not live DOM measurement.
- **CSS Modules keyframe names** → Define keyframes inside the module file; Vite/CSS Modules handles scoping correctly.

## Open Questions

- None — scope is well-defined and self-contained.
