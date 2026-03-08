import { useState, useEffect, useRef } from 'react'
import { createPeerConnection } from '../peerConnection'
import styles from './OnlineLobby.module.css'

export default function OnlineLobby({ onConnected, onBack }) {
  const [view, setView] = useState('menu') // menu | hosting | joining
  const [roomCode, setRoomCode] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const peerRef = useRef(null)

  useEffect(() => {
    return () => {
      peerRef.current?.destroy()
    }
  }, [])

  async function handleCreate() {
    setError('')
    setView('hosting')
    const pc = createPeerConnection()
    peerRef.current = pc

    pc.on('onConnect', () => {
      peerRef.current = null // prevent cleanup from destroying active connection
      onConnected(pc, 'host')
    })

    try {
      const code = await pc.createRoom()
      setRoomCode(code)
    } catch {
      setError('建立房間失敗，請重試')
      setView('menu')
    }
  }

  async function handleJoin(e) {
    e.preventDefault()
    const code = joinCode.trim().toLowerCase()
    if (code.length !== 6) {
      setError('請輸入 6 位房間代碼')
      return
    }

    setError('')
    setView('joining')
    const pc = createPeerConnection()
    peerRef.current = pc

    try {
      await pc.joinRoom(code)
      peerRef.current = null // prevent cleanup from destroying active connection
      onConnected(pc, 'guest')
    } catch {
      setError('無法連線，請確認房間代碼')
      setView('menu')
      pc.destroy()
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(roomCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (view === 'hosting') {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>線上對戰</h1>
        <div className={styles.card}>
          <div className={styles.status}>等待對手加入...</div>
          <div className={styles.codeDisplay}>
            <span className={styles.codeLabel}>房間代碼</span>
            <span className={styles.code}>{roomCode || '...'}</span>
            {roomCode && (
              <button className={styles.copyBtn} onClick={handleCopy}>
                {copied ? '已複製' : '複製'}
              </button>
            )}
          </div>
          <button className={styles.backBtn} onClick={() => { peerRef.current?.destroy(); onBack() }}>
            取消
          </button>
        </div>
      </div>
    )
  }

  if (view === 'joining') {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>線上對戰</h1>
        <div className={styles.card}>
          <div className={styles.status}>連線中...</div>
        </div>
      </div>
    )
  }

  // menu view
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>線上對戰</h1>
      <div className={styles.card}>
        <button className={styles.primaryBtn} onClick={handleCreate}>
          建立房間
        </button>
        <div className={styles.divider}>或</div>
        <form onSubmit={handleJoin} className={styles.joinForm}>
          <input
            className={styles.input}
            value={joinCode}
            onChange={e => setJoinCode(e.target.value)}
            placeholder="輸入房間代碼"
            maxLength={6}
          />
          <button className={styles.joinBtn} type="submit">加入</button>
        </form>
        {error && <div className={styles.error}>{error}</div>}
        <button className={styles.backBtn} onClick={onBack}>返回</button>
      </div>
    </div>
  )
}
