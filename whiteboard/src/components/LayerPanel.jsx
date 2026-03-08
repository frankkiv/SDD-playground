import { useRef } from 'react'
import styles from './LayerPanel.module.css'

export default function LayerPanel({
  layers, activeLayerId,
  onSetActive, onAdd, onRemove, onToggleVisible, onReorder,
}) {
  const dragRef = useRef(null)
  const dragOverRef = useRef(null)

  function handleDragStart(idx) {
    dragRef.current = idx
  }

  function handleDragOver(e, idx) {
    e.preventDefault()
    dragOverRef.current = idx
  }

  function handleDrop() {
    if (dragRef.current !== null && dragOverRef.current !== null && dragRef.current !== dragOverRef.current) {
      const newOrder = [...layers]
      const [moved] = newOrder.splice(dragRef.current, 1)
      newOrder.splice(dragOverRef.current, 0, moved)
      onReorder(newOrder.map(l => l.id))
    }
    dragRef.current = null
    dragOverRef.current = null
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span>圖層</span>
        <button className={styles.addBtn} onClick={onAdd} title="新增圖層">+</button>
      </div>
      <div className={styles.list}>
        {[...layers].reverse().map((layer, visualIdx) => {
          const realIdx = layers.length - 1 - visualIdx
          return (
            <div
              key={layer.id}
              className={`${styles.item} ${layer.id === activeLayerId ? styles.active : ''}`}
              draggable
              onDragStart={() => handleDragStart(realIdx)}
              onDragOver={e => handleDragOver(e, realIdx)}
              onDrop={handleDrop}
              onClick={() => onSetActive(layer.id)}
            >
              <button
                className={styles.visBtn}
                onClick={e => { e.stopPropagation(); onToggleVisible(layer.id) }}
                title={layer.visible ? '隱藏' : '顯示'}
              >
                {layer.visible ? '👁' : '—'}
              </button>
              <span className={styles.name}>{layer.name}</span>
              <button
                className={styles.removeBtn}
                onClick={e => { e.stopPropagation(); onRemove(layer.id) }}
                disabled={layers.length <= 1}
                title="刪除圖層"
              >
                ×
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
