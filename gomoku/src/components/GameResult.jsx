import styles from './GameResult.module.css'

export default function GameResult({ players, winner, isDraw, roundNumber, onPlayAgain, onRestart }) {
  const nextFirstColor = (roundNumber + 1) % 2 === 0 ? 'B' : 'W'
  const nextFirst = players.find(p => p.color === nextFirstColor)

  let message
  if (winner) {
    const winnerPlayer = players.find(p => p.color === winner)
    message = (
      <>
        <span className={styles.stone} data-color={winner} />
        {' '}{winnerPlayer.name} 獲勝！
      </>
    )
  } else {
    message = '平局！'
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.message}>{message}</div>
        <div className={styles.nextInfo}>
          下一局由 <strong>{nextFirst.name}</strong> 先手
        </div>
        <div className={styles.actions}>
          <button className={styles.playAgain} onClick={onPlayAgain}>再來一局</button>
          <button className={styles.restart} onClick={onRestart}>重新開始</button>
        </div>
      </div>
    </div>
  )
}
