import styles from './WinAnimation.module.css'

// Cell size + gap must match CSS variables: --cell-size: 110px, gap: 10px
const CELL = 110
const GAP = 10
const PADDING = 10

function cellCenter(index) {
  const col = index % 3
  const row = Math.floor(index / 3)
  const x = PADDING + col * (CELL + GAP) + CELL / 2
  const y = PADDING + row * (CELL + GAP) + CELL / 2
  return { x, y }
}

export default function WinAnimation({ winLine }) {
  const total = 3 * CELL + 2 * GAP + 2 * PADDING
  const start = cellCenter(winLine[0])
  const end = cellCenter(winLine[2])

  const dx = end.x - start.x
  const dy = end.y - start.y
  const length = Math.sqrt(dx * dx + dy * dy)

  return (
    <svg
      className={styles.svg}
      width={total}
      height={total}
      style={{ '--line-length': `${length}px` }}
    >
      <line
        className={styles.line}
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  )
}
