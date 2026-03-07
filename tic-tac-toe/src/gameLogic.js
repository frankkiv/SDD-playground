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

// Minimax: returns score for the current board state
// +10 if AI wins, -10 if human wins, 0 for draw
function minimax(board, isMaximizing, aiMark) {
  const humanMark = aiMark === 'X' ? 'O' : 'X'
  const winner = checkWinner(board)
  if (winner) return winner.mark === aiMark ? 10 : -10
  if (checkDraw(board)) return 0

  const mark = isMaximizing ? aiMark : humanMark
  let best = isMaximizing ? -Infinity : Infinity
  for (let i = 0; i < 9; i++) {
    if (board[i]) continue
    board[i] = mark
    const score = minimax(board, !isMaximizing, aiMark)
    best = isMaximizing ? Math.max(best, score) : Math.min(best, score)
    board[i] = null
  }
  return best
}

// Returns the index of the best move for AI using Minimax
export function getBestMove(board, aiMark) {
  let bestScore = -Infinity
  let bestIndex = -1
  for (let i = 0; i < 9; i++) {
    if (board[i]) continue
    board[i] = aiMark
    const score = minimax(board, false, aiMark)
    board[i] = null
    if (score > bestScore) {
      bestScore = score
      bestIndex = i
    }
  }
  return bestIndex
}

// Returns AI move index based on difficulty
// normal: 30% optimal, hard: 80% optimal, impossible: 100% optimal
export function getAIMove(board, aiMark, difficulty) {
  const rates = { normal: 0.3, hard: 0.8, impossible: 1.0 }
  const rate = rates[difficulty] ?? 1.0
  if (Math.random() < rate) {
    return getBestMove(board, aiMark)
  }
  const empty = board.map((v, i) => v === null ? i : -1).filter(i => i >= 0)
  return empty[Math.floor(Math.random() * empty.length)]
}
