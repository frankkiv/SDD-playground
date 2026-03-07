import styles from './Cell.module.css'

export default function Cell({ value, index, isWinning, isGameOver, onClick }) {
  const className = [
    styles.cell,
    value ? styles.filled : '',
    isWinning ? styles.winning : '',
    isGameOver && !isWinning ? styles.dimmed : '',
    value === 'X' ? styles.x : '',
    value === 'O' ? styles.o : '',
  ].filter(Boolean).join(' ')

  return (
    <button className={className} onClick={() => onClick(index)} disabled={!!value || isGameOver}>
      {value && <span className={styles.mark}>{value}</span>}
    </button>
  )
}
