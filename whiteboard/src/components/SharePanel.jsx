import { useState } from 'react'
import styles from './SharePanel.module.css'

export default function SharePanel({ roomCode, status, onClose }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(roomCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span>分享白板</span>
        <button className={styles.closeBtn} onClick={onClose}>×</button>
      </div>

      {status === 'waiting' && (
        <div className={styles.body}>
          <p className={styles.hint}>將代碼分享給對方，即可即時協作</p>
          <div className={styles.codeDisplay}>
            <span className={styles.codeLabel}>房間代碼</span>
            <span className={styles.code}>{roomCode || '...'}</span>
          </div>
          {roomCode && (
            <button className={styles.copyBtn} onClick={handleCopy}>
              {copied ? '已複製！' : '複製代碼'}
            </button>
          )}
          <p className={styles.waiting}>等待對方加入...</p>
        </div>
      )}

      {status === 'connected' && (
        <div className={styles.body}>
          <div className={styles.connectedInfo}>
            <span className={styles.dot} />
            已連線，正在即時同步
          </div>
          {roomCode && (
            <>
              <div className={styles.codeDisplay}>
                <span className={styles.codeLabel}>房間代碼</span>
                <span className={styles.codeSmall}>{roomCode}</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
