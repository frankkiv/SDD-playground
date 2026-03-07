export const BOARD_SIZE = 19
export const WIN_COUNT = 5
export const TOTAL_CELLS = BOARD_SIZE * BOARD_SIZE

// Direction vectors: [dRow, dCol]
const DIRECTIONS = [
  [0, 1],   // horizontal
  [1, 0],   // vertical
  [1, 1],   // diagonal ↘
  [1, -1],  // diagonal ↙
]

function inBounds(r, c) {
  return r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE
}

// Check winner from last move position
// Returns { color, stones: [[r,c], ...] } or null
export function checkWinner(board, lastRow, lastCol) {
  const color = board[lastRow * BOARD_SIZE + lastCol]
  if (!color) return null

  for (const [dr, dc] of DIRECTIONS) {
    const stones = [[lastRow, lastCol]]

    // Scan in positive direction
    for (let i = 1; i < BOARD_SIZE; i++) {
      const r = lastRow + dr * i
      const c = lastCol + dc * i
      if (!inBounds(r, c) || board[r * BOARD_SIZE + c] !== color) break
      stones.push([r, c])
    }

    // Scan in negative direction
    for (let i = 1; i < BOARD_SIZE; i++) {
      const r = lastRow - dr * i
      const c = lastCol - dc * i
      if (!inBounds(r, c) || board[r * BOARD_SIZE + c] !== color) break
      stones.push([r, c])
    }

    if (stones.length >= WIN_COUNT) {
      return { color, stones }
    }
  }

  return null
}

// Returns true when all cells are filled
export function checkDraw(board) {
  return board.every(cell => cell !== null)
}

// Even rounds: black first, odd rounds: white first
export function getFirstColor(roundNumber) {
  return roundNumber % 2 === 0 ? 'B' : 'W'
}

// --- AI Heuristic Scoring ---

const SCORES = {
  FIVE: 100000,
  OPEN_FOUR: 10000,
  CLOSED_FOUR: 5000,
  OPEN_THREE: 1000,
  CLOSED_THREE: 100,
  OPEN_TWO: 100,
  CLOSED_TWO: 10,
}

// Scan one direction from (row, col) and return { count, openEnds }
// count = consecutive same-color stones (including the position itself)
// openEnds = how many ends are open (0, 1, or 2)
function scanLine(board, row, col, dr, dc, color) {
  let count = 1

  // Helper: scan in one direction, return open (true if the end is open)
  function scanDir(signDr, signDc) {
    for (let i = 1; i < BOARD_SIZE; i++) {
      const r = row + signDr * i
      const c = col + signDc * i
      if (!inBounds(r, c)) return false // hit wall → closed
      const cell = board[r * BOARD_SIZE + c]
      if (cell === color) {
        count++
      } else {
        return cell === null // empty → open, opponent → closed
      }
    }
    return false // reached board edge → closed
  }

  const openPos = scanDir(dr, dc)
  const openNeg = scanDir(-dr, -dc)
  const openEnds = (openPos ? 1 : 0) + (openNeg ? 1 : 0)
  return { count, openEnds }
}

function patternScore(count, openEnds) {
  if (count >= 5) return SCORES.FIVE
  if (count === 4) {
    if (openEnds === 2) return SCORES.OPEN_FOUR
    if (openEnds === 1) return SCORES.CLOSED_FOUR
    return 0
  }
  if (count === 3) {
    if (openEnds === 2) return SCORES.OPEN_THREE
    if (openEnds === 1) return SCORES.CLOSED_THREE
    return 0
  }
  if (count === 2) {
    if (openEnds === 2) return SCORES.OPEN_TWO
    if (openEnds === 1) return SCORES.CLOSED_TWO
    return 0
  }
  return 0
}

// Evaluate a single position for one color
function evaluatePositionForColor(board, row, col, color) {
  let score = 0
  for (const [dr, dc] of DIRECTIONS) {
    const { count, openEnds } = scanLine(board, row, col, dr, dc, color)
    score += patternScore(count, openEnds)
  }
  return score
}

// Get the AI's move
export function getAIMove(board, aiColor, difficulty) {
  // Empty board → play center
  if (board.every(c => c === null)) {
    const center = Math.floor(BOARD_SIZE / 2)
    return { row: center, col: center }
  }

  const opponent = aiColor === 'B' ? 'W' : 'B'
  const noiseRange = difficulty === 'normal' ? 5000 : difficulty === 'hard' ? 500 : 0

  let bestScore = -Infinity
  let bestMove = null

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r * BOARD_SIZE + c] !== null) continue

      // Temporarily place the stone for evaluation
      board[r * BOARD_SIZE + c] = aiColor
      const attackScore = evaluatePositionForColor(board, r, c, aiColor)
      board[r * BOARD_SIZE + c] = opponent
      const defendScore = evaluatePositionForColor(board, r, c, opponent)
      board[r * BOARD_SIZE + c] = null

      let score = Math.max(attackScore, defendScore)
      if (noiseRange > 0) {
        score += (Math.random() * 2 - 1) * noiseRange
      }

      if (score > bestScore) {
        bestScore = score
        bestMove = { row: r, col: c }
      }
    }
  }

  return bestMove
}

// Calculate nearest intersection from SVG coordinates
export function getNearestIntersection(x, y, cellSize, padding) {
  const col = Math.round((x - padding) / cellSize)
  const row = Math.round((y - padding) / cellSize)
  if (!inBounds(row, col)) return null

  const cx = padding + col * cellSize
  const cy = padding + row * cellSize
  const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
  if (dist > cellSize * 0.45) return null

  return { row, col }
}
