import styles from './TurnIndicator.module.css'

export default function TurnIndicator({ players, currentMark, winner, isDraw, isAIThinking }) {
  if (winner) {
    const winnerPlayer = players.find(p => p.mark === winner)
    return (
      <div className={styles.indicator}>
        <span className={styles.result}>
          <span className={`${styles.mark} ${winner === 'X' ? styles.x : styles.o}`}>{winner}</span>
          {' '}{winnerPlayer.name} 獲勝！
        </span>
      </div>
    )
  }

  if (isDraw) {
    return (
      <div className={styles.indicator}>
        <span className={styles.result}>平局！</span>
      </div>
    )
  }

  if (isAIThinking) {
    return (
      <div className={styles.indicator}>
        <span className={styles.thinking}>電腦思考中...</span>
      </div>
    )
  }

  const current = players.find(p => p.mark === currentMark)
  return (
    <div className={styles.indicator}>
      <span className={`${styles.mark} ${currentMark === 'X' ? styles.x : styles.o}`}>
        {currentMark}
      </span>
      <span className={styles.playerName}>{current.name} 的回合</span>
    </div>
  )
}
