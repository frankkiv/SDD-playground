import styles from './Toolbar.module.css'

const TOOLS = [
  { key: 'pen', icon: '✏️', label: '畫筆' },
  { key: 'highlighter', icon: '🖍️', label: '螢光筆' },
  { key: 'eraser', icon: '🧹', label: '橡皮擦' },
  { key: 'rect', icon: '▭', label: '矩形' },
  { key: 'ellipse', icon: '○', label: '圓形' },
  { key: 'arrow', icon: '➤', label: '箭頭' },
  { key: 'text', icon: 'T', label: '文字' },
  { key: 'pan', icon: '✋', label: '平移' },
]

const COLORS = [
  '#ffffff', '#e94560', '#ff6b6b', '#ffa502',
  '#2ed573', '#4ecdc4', '#3b82f6', '#a855f7',
]

const WIDTHS = [2, 4, 6, 10]

export default function Toolbar({
  tool, color, lineWidth, fontSize,
  onToolChange, onColorChange, onLineWidthChange, onFontSizeChange,
  onUndo, onRedo, onClear, onExport, onSave, onLoad,
  onToggleLayers, showLayerPanel,
  onToggleShare, isOnline, shareStatus,
  canUndo, canRedo,
  zoom, onResetZoom,
}) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.section}>
        {TOOLS.map(t => (
          <button
            key={t.key}
            className={`${styles.toolBtn} ${tool === t.key ? styles.active : ''}`}
            onClick={() => onToolChange(t.key)}
            title={t.label}
          >
            {t.icon}
          </button>
        ))}
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        {COLORS.map(c => (
          <button
            key={c}
            className={`${styles.colorBtn} ${color === c ? styles.colorActive : ''}`}
            style={{ background: c }}
            onClick={() => onColorChange(c)}
          />
        ))}
        <input
          type="color"
          className={styles.colorPicker}
          value={color}
          onChange={e => onColorChange(e.target.value)}
          title="自訂顏色"
        />
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        {WIDTHS.map(w => (
          <button
            key={w}
            className={`${styles.widthBtn} ${lineWidth === w ? styles.widthActive : ''}`}
            onClick={() => onLineWidthChange(w)}
            title={`${w}px`}
          >
            <span className={styles.widthDot} style={{ width: w + 4, height: w + 4 }} />
          </button>
        ))}
      </div>

      {tool === 'text' && (
        <>
          <div className={styles.divider} />
          <div className={styles.section}>
            <select
              className={styles.fontSelect}
              value={fontSize}
              onChange={e => onFontSizeChange(Number(e.target.value))}
            >
              <option value={16}>16px</option>
              <option value={24}>24px</option>
              <option value={32}>32px</option>
              <option value={48}>48px</option>
              <option value={64}>64px</option>
            </select>
          </div>
        </>
      )}

      <div className={styles.divider} />

      <div className={styles.section}>
        <button className={styles.actionBtn} onClick={onUndo} disabled={!canUndo} title="復原 (Ctrl+Z)">↩</button>
        <button className={styles.actionBtn} onClick={onRedo} disabled={!canRedo} title="重做 (Ctrl+Y)">↪</button>
        <button className={styles.actionBtn} onClick={onClear} title="清空">🗑</button>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <button className={styles.actionBtn} onClick={onExport} title="匯出 PNG">📷</button>
        <button className={styles.actionBtn} onClick={onSave} title="存檔 JSON">💾</button>
        <button className={styles.actionBtn} onClick={onLoad} title="載入 JSON">📂</button>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <button
          className={`${styles.actionBtn} ${showLayerPanel ? styles.active : ''}`}
          onClick={onToggleLayers}
          title="圖層"
        >
          ☰
        </button>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <button
          className={`${styles.actionBtn} ${isOnline ? styles.online : ''}`}
          onClick={onToggleShare}
          title={isOnline ? '連線中' : '分享白板'}
        >
          {shareStatus === 'waiting' ? '⏳' : isOnline ? '🔗' : '📡'}
        </button>
      </div>

      <div className={styles.spacer} />

      <button className={styles.zoomBtn} onClick={onResetZoom} title="重置縮放">
        {Math.round(zoom * 100)}%
      </button>
    </div>
  )
}
