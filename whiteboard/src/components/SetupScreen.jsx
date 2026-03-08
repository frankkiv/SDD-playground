import { useState } from 'react'
import styles from './SetupScreen.module.css'

export default function SetupScreen({ onStart, onJoin }) {
  const [joinCode, setJoinCode] = useState('')
  const [error, setError] = useState('')
  const [joining, setJoining] = useState(false)

  function handleJoin(e) {
    e.preventDefault()
    const code = joinCode.trim().toLowerCase()
    if (code.length !== 6) {
      setError('請輸入 6 位房間代碼')
      return
    }
    setError('')
    setJoining(true)
    onJoin(code).catch(() => {
      setError('無法連線，請確認房間代碼')
      setJoining(false)
    })
  }

  return (
    <div className={styles.container}>
      <a className={styles.homeLink} href="/SDD-playground/">← 返回首頁</a>
      <h1 className={styles.title}>電子白板</h1>
      <div className={styles.card}>
        <p className={styles.desc}>自由繪圖、標示重點、多圖層管理</p>
        <button className={styles.primaryBtn} onClick={onStart}>
          啟動白板
        </button>
        <div className={styles.divider}>或加入別人的白板</div>
        <form onSubmit={handleJoin} className={styles.joinForm}>
          <input
            className={styles.input}
            value={joinCode}
            onChange={e => setJoinCode(e.target.value)}
            placeholder="輸入房間代碼"
            maxLength={6}
            disabled={joining}
          />
          <button className={styles.joinBtn} type="submit" disabled={joining}>
            {joining ? '連線中...' : '加入'}
          </button>
        </form>
        {error && <div className={styles.error}>{error}</div>}
      </div>
    </div>
  )
}
