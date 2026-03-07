import styles from './TurnIndicator.module.css'

export default function TurnIndicator({ players, currentColor, winner, isDraw, isAIThinking }) {
  if (winner) {
    const winnerPlayer = players.find(p => p.color === winner)
    return (
      <div className={styles.indicator}>
        <span className={styles.result}>
          <span className={styles.stone} data-color={winner} />
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
        <span className={styles.stone} data-color={currentColor} />
        <span className={styles.playerName}>電腦思考中...</span>
      </div>
    )
  }

  const current = players.find(p => p.color === currentColor)
  return (
    <div className={styles.indicator}>
      <span className={styles.stone} data-color={currentColor} />
      <span className={styles.playerName}>{current.name} 的回合</span>
    </div>
  )
}
