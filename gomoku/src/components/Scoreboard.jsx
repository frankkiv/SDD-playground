import styles from './Scoreboard.module.css'

export default function Scoreboard({ players, scores }) {
  const p1 = players[0]
  const p2 = players[1]
  const leading = scores[p1.color] > scores[p2.color] ? p1.color
    : scores[p2.color] > scores[p1.color] ? p2.color : null

  return (
    <div className={styles.scoreboard}>
      <div className={`${styles.player} ${leading === p1.color ? styles.leading : ''}`}>
        <span className={styles.name}>{p1.name}</span>
        <div className={styles.scoreRow}>
          <span className={styles.stone} data-color="B" />
          <span className={styles.score}>{scores[p1.color]}</span>
        </div>
      </div>
      <div className={styles.draws}>
        <span className={styles.drawLabel}>平局</span>
        <span className={styles.drawCount}>{scores.draws}</span>
      </div>
      <div className={`${styles.player} ${leading === p2.color ? styles.leading : ''}`}>
        <span className={styles.name}>{p2.name}</span>
        <div className={styles.scoreRow}>
          <span className={styles.stone} data-color="W" />
          <span className={styles.score}>{scores[p2.color]}</span>
        </div>
      </div>
    </div>
  )
}
