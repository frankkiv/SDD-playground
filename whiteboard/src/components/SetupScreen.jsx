import styles from './SetupScreen.module.css'

export default function SetupScreen({ onLocal, onOnline }) {
  return (
    <div className={styles.container}>
      <a className={styles.homeLink} href="/SDD-playground/">← 返回首頁</a>
      <h1 className={styles.title}>電子白板</h1>
      <div className={styles.card}>
        <p className={styles.desc}>自由繪圖、標示重點、多圖層管理</p>
        <button className={styles.primaryBtn} onClick={onLocal}>
          開始繪圖
        </button>
        <div className={styles.divider}>或</div>
        <button className={styles.secondaryBtn} onClick={onOnline}>
          線上協作
        </button>
        <p className={styles.hint}>與朋友連線，即時同步繪圖</p>
      </div>
    </div>
  )
}
