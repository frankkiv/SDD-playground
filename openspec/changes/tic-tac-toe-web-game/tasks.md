## 1. Project Scaffold

- [ ] 1.1 Initialize Vite + React project (`npm create vite@latest tic-tac-toe -- --template react`)
- [ ] 1.2 Remove boilerplate files (App.css content, logo, counter component)
- [ ] 1.3 Verify dev server runs cleanly

## 2. Game Logic

- [ ] 2.1 Define WIN_LINES constant (8 winning combinations as index arrays)
- [ ] 2.2 Implement `checkWinner(board)` function that returns the winning player mark and winning line indices, or null
- [ ] 2.3 Implement `checkDraw(board)` function that returns true when all 9 cells are filled with no winner
- [ ] 2.4 Implement first-turn logic: derive current first player from round number (even → player1, odd → player2)

## 3. App State

- [ ] 3.1 Define top-level state in App: `screen` (setup | game), `players` (name + mark), `scores` (wins per player + draws), `roundNumber`
- [ ] 3.2 Define game state: `board` (9-element array), `currentMark`, `winner`, `winLine`, `isDraw`
- [ ] 3.3 Implement `handleCellClick(index)` — place mark, check win/draw, switch turn
- [ ] 3.4 Implement `handlePlayAgain()` — reset board, increment roundNumber, keep scores
- [ ] 3.5 Implement `handleRestart()` — reset all state, return to setup screen

## 4. SetupScreen Component

- [ ] 4.1 Create `SetupScreen` component with two name input fields and a start button
- [ ] 4.2 Apply default names ("Player 1", "Player 2") when input is empty on submit
- [ ] 4.3 Style with CSS Modules: centered card layout, rounded inputs, vibrant start button

## 5. Board Component

- [ ] 5.1 Create `Board` component that renders a 3x3 grid of `Cell` components
- [ ] 5.2 Pass `board`, `winLine`, and `onCellClick` as props
- [ ] 5.3 Style the grid with CSS Modules: equal-sized cells, border separators, rounded corners

## 6. Cell Component

- [ ] 6.1 Create `Cell` component that displays X, O, or empty
- [ ] 6.2 Apply highlighted style when cell index is in `winLine`
- [ ] 6.3 Apply de-emphasized style to non-winning cells after game ends
- [ ] 6.4 Add pop-in animation (scale keyframe) when a mark is placed

## 7. WinAnimation Component

- [ ] 7.1 Create `WinAnimation` component that renders an SVG overlay absolutely positioned over the board
- [ ] 7.2 Calculate line start and end coordinates from `winLine` indices using fixed cell size constant
- [ ] 7.3 Animate the line using CSS `stroke-dasharray` / `stroke-dashoffset` transition (0.3s ease-out)
- [ ] 7.4 Support all 8 directions (3 horizontal, 3 vertical, 2 diagonal)

## 8. Scoreboard Component

- [ ] 8.1 Create `Scoreboard` component displaying both players' names and win counts side by side
- [ ] 8.2 Display draw count below or between the player scores
- [ ] 8.3 Style with CSS Modules: clear visual separation, highlight the leading player

## 9. TurnIndicator Component

- [ ] 9.1 Create `TurnIndicator` component showing the current player's name and mark
- [ ] 9.2 Hide or replace with result message when game ends (win or draw)

## 10. GameResult Overlay

- [ ] 10.1 Create `GameResult` component shown when game ends with winner name or draw message
- [ ] 10.2 Show next round's first-turn player name
- [ ] 10.3 Render "Play Again" and "Restart" buttons
- [ ] 10.4 Style with CSS Modules: overlay or banner with celebratory feel

## 11. Polish and Integration

- [ ] 11.1 Wire all components together in `App` / `GameScreen`
- [ ] 11.2 Apply global base styles: font, background color, color palette variables
- [ ] 11.3 Verify alternating first-turn works correctly across multiple rounds
- [ ] 11.4 Verify scores accumulate and reset correctly
- [ ] 11.5 Test all 8 win directions and the draw condition manually
- [ ] 11.6 Check layout is usable on common desktop screen sizes
