import { useState, useCallback } from 'react'
import { BOARD_SIZE, getNearestIntersection } from '../gameLogic'
import styles from './GomokuBoard.module.css'

const CELL_SIZE = 30
const PADDING = 25
const BOARD_PX = PADDING * 2 + (BOARD_SIZE - 1) * CELL_SIZE

// Standard star points for 19x19
const STAR_POINTS = [
  [3, 3], [3, 9], [3, 15],
  [9, 3], [9, 9], [9, 15],
  [15, 3], [15, 9], [15, 15],
]

export default function GomokuBoard({ board, currentColor, winStones, isGameOver, lastMove, onPlace }) {
  const [hover, setHover] = useState(null)

  const winSet = winStones
    ? new Set(winStones.map(([r, c]) => `${r},${c}`))
    : null

  const handleClick = useCallback((e) => {
    if (isGameOver) return
    const svg = e.currentTarget
    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const svgPt = pt.matrixTransform(svg.getScreenCTM().inverse())
    const hit = getNearestIntersection(svgPt.x, svgPt.y, CELL_SIZE, PADDING)
    if (hit && !board[hit.row * BOARD_SIZE + hit.col]) {
      onPlace(hit.row, hit.col)
    }
  }, [board, isGameOver, onPlace])

  const handleMouseMove = useCallback((e) => {
    if (isGameOver) { setHover(null); return }
    const svg = e.currentTarget
    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const svgPt = pt.matrixTransform(svg.getScreenCTM().inverse())
    const hit = getNearestIntersection(svgPt.x, svgPt.y, CELL_SIZE, PADDING)
    if (hit && !board[hit.row * BOARD_SIZE + hit.col]) {
      setHover(hit)
    } else {
      setHover(null)
    }
  }, [board, isGameOver])

  const handleMouseLeave = useCallback(() => setHover(null), [])

  // Grid lines
  const lines = []
  for (let i = 0; i < BOARD_SIZE; i++) {
    const pos = PADDING + i * CELL_SIZE
    // Horizontal
    lines.push(
      <line key={`h${i}`} x1={PADDING} y1={pos} x2={PADDING + (BOARD_SIZE - 1) * CELL_SIZE} y2={pos} stroke="#8a7a5a" strokeWidth="1" />
    )
    // Vertical
    lines.push(
      <line key={`v${i}`} x1={pos} y1={PADDING} x2={pos} y2={PADDING + (BOARD_SIZE - 1) * CELL_SIZE} stroke="#8a7a5a" strokeWidth="1" />
    )
  }

  // Star points
  const stars = STAR_POINTS.map(([r, c]) => (
    <circle key={`s${r},${c}`} cx={PADDING + c * CELL_SIZE} cy={PADDING + r * CELL_SIZE} r={3} fill="#8a7a5a" />
  ))

  // Stones
  const stones = []
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) continue
    const r = Math.floor(i / BOARD_SIZE)
    const c = i % BOARD_SIZE
    const cx = PADDING + c * CELL_SIZE
    const cy = PADDING + r * CELL_SIZE
    const isBlack = board[i] === 'B'
    const isWinning = winSet && winSet.has(`${r},${c}`)
    const isDimmed = isGameOver && winSet && !isWinning
    const isLast = lastMove && lastMove[0] === r && lastMove[1] === c

    stones.push(
      <g key={`st${i}`} className={isDimmed ? styles.dimmed : ''}>
        <circle
          cx={cx} cy={cy} r={CELL_SIZE * 0.43}
          fill={isBlack ? 'var(--color-black-stone)' : 'var(--color-white-stone)'}
          stroke={isBlack ? '#555' : '#aaa'}
          strokeWidth="1"
          className={isWinning ? styles.winning : ''}
        />
        {isLast && !isGameOver && (
          <circle cx={cx} cy={cy} r={3} fill={isBlack ? '#aaa' : '#555'} />
        )}
      </g>
    )
  }

  // Hover preview
  let preview = null
  if (hover) {
    const cx = PADDING + hover.col * CELL_SIZE
    const cy = PADDING + hover.row * CELL_SIZE
    preview = (
      <circle
        cx={cx} cy={cy} r={CELL_SIZE * 0.43}
        fill={currentColor === 'B' ? 'var(--color-black-stone)' : 'var(--color-white-stone)'}
        opacity="0.35"
        pointerEvents="none"
      />
    )
  }

  return (
    <div className={styles.wrapper}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${BOARD_PX} ${BOARD_PX}`}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Board background */}
        <rect x="0" y="0" width={BOARD_PX} height={BOARD_PX} fill="#c8a85c" rx="4" />
        {lines}
        {stars}
        {stones}
        {preview}
      </svg>
    </div>
  )
}
