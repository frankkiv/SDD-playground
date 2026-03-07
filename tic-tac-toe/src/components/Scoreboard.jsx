import styles from './Scoreboard.module.css'

export default function Scoreboard({ players, scores }) {
  const p1 = players[0]
  const p2 = players[1]
  const leading = scores[p1.mark] > scores[p2.mark] ? p1.mark
    : scores[p2.mark] > scores[p1.mark] ? p2.mark : null

  return (
    <div className={styles.scoreboard}>
      <div className={`${styles.player} ${leading === p1.mark ? styles.leading : ''}`}>
        <span className={styles.name}>{p1.name}</span>
        <span className={`${styles.score} ${styles.x}`}>{scores[p1.mark]}</span>
      </div>
      <div className={styles.draws}>
        <span className={styles.drawLabel}>平局</span>
        <span className={styles.drawCount}>{scores.draws}</span>
      </div>
      <div className={`${styles.player} ${leading === p2.mark ? styles.leading : ''}`}>
        <span className={styles.name}>{p2.name}</span>
        <span className={`${styles.score} ${styles.o}`}>{scores[p2.mark]}</span>
      </div>
    </div>
  )
}
