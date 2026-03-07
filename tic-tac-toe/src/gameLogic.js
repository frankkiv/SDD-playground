export const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],            // diagonals
]

// Returns { mark, line } for the winner, or null
export function checkWinner(board) {
  for (const line of WIN_LINES) {
    const [a, b, c] = line
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { mark: board[a], line }
    }
  }
  return null
}

// Returns true when board is full and no winner
export function checkDraw(board) {
  return board.every(cell => cell !== null)
}

// roundNumber is 0-based: even → player index 0 goes first, odd → player index 1
export function getFirstMark(roundNumber, players) {
  return roundNumber % 2 === 0 ? players[0].mark : players[1].mark
}
