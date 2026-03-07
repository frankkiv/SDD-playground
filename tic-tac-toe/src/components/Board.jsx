import Cell from './Cell'
import WinAnimation from './WinAnimation'
import styles from './Board.module.css'

export default function Board({ board, winLine, isGameOver, onCellClick }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {board.map((value, i) => (
          <Cell
            key={i}
            index={i}
            value={value}
            isWinning={winLine ? winLine.includes(i) : false}
            isGameOver={isGameOver}
            onClick={onCellClick}
          />
        ))}
      </div>
      {winLine && <WinAnimation winLine={winLine} />}
    </div>
  )
}
