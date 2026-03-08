import { useState } from 'react'
import styles from './SetupScreen.module.css'

const DIFFICULTIES = [
  { key: 'normal', label: '普通', desc: '會犯錯' },
  { key: 'hard', label: '困難', desc: '偶爾犯錯' },
  { key: 'impossible', label: '不可能', desc: '完美 AI' },
]

export default function SetupScreen({ onStart, onOnline }) {
  const [mode, setMode] = useState('pvp')
  const [name1, setName1] = useState('')
  const [name2, setName2] = useState('')
  const [difficulty, setDifficulty] = useState('normal')

  function handleSubmit(e) {
    e.preventDefault()
    if (mode === 'online') {
      onOnline()
      return
    }
    onStart(name1.trim(), name2.trim(), mode, difficulty)
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>九宮格大戰</h1>
      <div className={styles.modeTabs}>
        <button
          className={`${styles.modeTab} ${mode === 'pvp' ? styles.active : ''}`}
          onClick={() => setMode('pvp')}
          type="button"
        >
          雙人對戰
        </button>
        <button
          className={`${styles.modeTab} ${mode === 'pve' ? styles.active : ''}`}
          onClick={() => setMode('pve')}
          type="button"
        >
          單人挑戰
        </button>
        <button
          className={`${styles.modeTab} ${mode === 'online' ? styles.active : ''}`}
          onClick={() => setMode('online')}
          type="button"
        >
          線上對戰
        </button>
      </div>
      <form className={styles.card} onSubmit={handleSubmit}>
        {mode !== 'online' && (
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
        )}
        {mode === 'pvp' && (
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
        )}
        {mode === 'pve' && (
          <div className={styles.field}>
            <label className={styles.label}>難度</label>
            <div className={styles.difficultyGroup}>
              {DIFFICULTIES.map(d => (
                <button
                  key={d.key}
                  type="button"
                  className={`${styles.diffBtn} ${difficulty === d.key ? styles.diffActive : ''}`}
                  onClick={() => setDifficulty(d.key)}
                >
                  <span className={styles.diffLabel}>{d.label}</span>
                  <span className={styles.diffDesc}>{d.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {mode === 'online' && (
          <div className={styles.onlineInfo}>
            與朋友連線對戰，一人建立房間、一人加入
          </div>
        )}
        <button className={styles.startBtn} type="submit">
          {mode === 'online' ? '進入大廳' : '開始遊戲'}
        </button>
      </form>
    </div>
  )
}
