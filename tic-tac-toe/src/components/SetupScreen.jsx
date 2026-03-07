import { useState } from 'react'
import styles from './SetupScreen.module.css'

export default function SetupScreen({ onStart }) {
  const [name1, setName1] = useState('')
  const [name2, setName2] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onStart(name1.trim(), name2.trim())
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>九宮格大戰</h1>
      <form className={styles.card} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label}>
            <span className={styles.mark} data-mark="X">X</span> 玩家名稱
          </label>
          <input
            className={styles.input}
            value={name1}
            onChange={e => setName1(e.target.value)}
            placeholder="Player 1"
            maxLength={20}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>
            <span className={styles.mark} data-mark="O">O</span> 玩家名稱
          </label>
          <input
            className={styles.input}
            value={name2}
            onChange={e => setName2(e.target.value)}
            placeholder="Player 2"
            maxLength={20}
          />
        </div>
        <button className={styles.startBtn} type="submit">開始遊戲</button>
      </form>
    </div>
  )
}
