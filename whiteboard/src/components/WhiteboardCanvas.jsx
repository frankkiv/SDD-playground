import { useRef, useEffect, useCallback } from 'react'
import { renderAll, renderObject, hitTest } from '../renderer'
import { genId } from '../whiteboardState'
import styles from './WhiteboardCanvas.module.css'

const CANVAS_W = 4000
const CANVAS_H = 4000

export default function WhiteboardCanvas({
  objects, layers, activeLayerId,
  tool, color, lineWidth, fontSize,
  viewport, onViewportChange,
  onAddObject, onRemoveObjects,
  isTextEditing, textPos, textValue, onTextChange, onTextConfirm, onTextStart,
}) {
  const staticRef = useRef(null)
  const dynamicRef = useRef(null)
  const containerRef = useRef(null)
  const drawingRef = useRef(null) // current stroke/shape being drawn
  const lastPanRef = useRef(null)
  const spaceDownRef = useRef(false)

  // Redraw static layer when objects/layers change
  useEffect(() => {
    const ctx = staticRef.current?.getContext('2d')
    if (ctx) renderAll(ctx, objects, layers, CANVAS_W, CANVAS_H)
  }, [objects, layers])

  const screenToCanvas = useCallback((sx, sy) => {
    const rect = containerRef.current.getBoundingClientRect()
    return {
      x: (sx - rect.left - viewport.x) / viewport.scale,
      y: (sy - rect.top - viewport.y) / viewport.scale,
    }
  }, [viewport])

  const handlePointerDown = useCallback((e) => {
    if (e.button !== 0) return
    const canvas = dynamicRef.current
    canvas.setPointerCapture(e.pointerId)
    const pt = screenToCanvas(e.clientX, e.clientY)

    const activeTool = spaceDownRef.current ? 'pan' : tool

    if (activeTool === 'pan') {
      lastPanRef.current = { x: e.clientX, y: e.clientY }
      drawingRef.current = { tool: 'pan' }
      return
    }

    if (activeTool === 'text') {
      onTextStart(pt.x, pt.y)
      return
    }

    if (activeTool === 'eraser') {
      // Erase on down
      const radius = lineWidth * 2
      const toRemove = objects.filter(o =>
        o.layerId === activeLayerId && hitTest(o, pt.x, pt.y, radius)
      )
      if (toRemove.length > 0) {
        onRemoveObjects(toRemove.map(o => o.id))
      }
      drawingRef.current = { tool: 'eraser' }
      return
    }

    if (activeTool === 'pen' || activeTool === 'highlighter') {
      drawingRef.current = {
        tool: activeTool,
        type: activeTool === 'pen' ? 'stroke' : 'highlighter',
        id: genId(),
        layerId: activeLayerId,
        color,
        width: activeTool === 'highlighter' ? lineWidth * 3 : lineWidth,
        points: [pt],
      }
      return
    }

    if (activeTool === 'rect' || activeTool === 'ellipse' || activeTool === 'arrow') {
      drawingRef.current = {
        tool: activeTool,
        startX: pt.x,
        startY: pt.y,
        currentX: pt.x,
        currentY: pt.y,
      }
      return
    }
  }, [tool, color, lineWidth, activeLayerId, objects, onRemoveObjects, onTextStart, screenToCanvas])

  const handlePointerMove = useCallback((e) => {
    const d = drawingRef.current
    if (!d && !lastPanRef.current) return

    if (d?.tool === 'pan' || (spaceDownRef.current && lastPanRef.current)) {
      const ref = lastPanRef.current
      if (!ref) return
      const dx = e.clientX - ref.x
      const dy = e.clientY - ref.y
      lastPanRef.current = { x: e.clientX, y: e.clientY }
      onViewportChange(v => ({ ...v, x: v.x + dx, y: v.y + dy }))
      return
    }

    const pt = screenToCanvas(e.clientX, e.clientY)

    if (d.tool === 'eraser') {
      const radius = lineWidth * 2
      const toRemove = objects.filter(o =>
        o.layerId === activeLayerId && hitTest(o, pt.x, pt.y, radius)
      )
      if (toRemove.length > 0) {
        onRemoveObjects(toRemove.map(o => o.id))
      }
      return
    }

    if (d.tool === 'pen' || d.tool === 'highlighter') {
      d.points.push(pt)
      // Draw on dynamic canvas
      const ctx = dynamicRef.current.getContext('2d')
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)
      renderObject(ctx, { ...d, type: d.type })
      return
    }

    if (d.tool === 'rect' || d.tool === 'ellipse' || d.tool === 'arrow') {
      d.currentX = pt.x
      d.currentY = pt.y
      const ctx = dynamicRef.current.getContext('2d')
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)

      let preview
      if (d.tool === 'rect') {
        preview = {
          type: 'rect', color, width: lineWidth,
          x: Math.min(d.startX, d.currentX), y: Math.min(d.startY, d.currentY),
          w: Math.abs(d.currentX - d.startX), h: Math.abs(d.currentY - d.startY),
        }
      } else if (d.tool === 'ellipse') {
        preview = {
          type: 'ellipse', color, width: lineWidth,
          cx: (d.startX + d.currentX) / 2, cy: (d.startY + d.currentY) / 2,
          rx: Math.abs(d.currentX - d.startX) / 2, ry: Math.abs(d.currentY - d.startY) / 2,
        }
      } else {
        preview = {
          type: 'arrow', color, width: lineWidth,
          x1: d.startX, y1: d.startY, x2: d.currentX, y2: d.currentY,
        }
      }
      renderObject(ctx, preview)
      return
    }
  }, [tool, color, lineWidth, activeLayerId, objects, onRemoveObjects, onViewportChange, screenToCanvas])

  const handlePointerUp = useCallback((e) => {
    const d = drawingRef.current
    if (!d) {
      lastPanRef.current = null
      return
    }

    if (d.tool === 'pan') {
      lastPanRef.current = null
      drawingRef.current = null
      return
    }

    if (d.tool === 'eraser') {
      drawingRef.current = null
      return
    }

    const ctx = dynamicRef.current.getContext('2d')
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)

    if (d.tool === 'pen' || d.tool === 'highlighter') {
      if (d.points.length >= 2) {
        const obj = {
          id: d.id, type: d.type, layerId: d.layerId,
          color: d.color, width: d.width, points: d.points,
        }
        onAddObject(obj)
      }
    }

    if (d.tool === 'rect' || d.tool === 'ellipse' || d.tool === 'arrow') {
      const id = genId()
      let obj
      if (d.tool === 'rect') {
        const w = Math.abs(d.currentX - d.startX)
        const h = Math.abs(d.currentY - d.startY)
        if (w > 2 || h > 2) {
          obj = {
            id, type: 'rect', layerId: activeLayerId, color, width: lineWidth,
            x: Math.min(d.startX, d.currentX), y: Math.min(d.startY, d.currentY),
            w, h,
          }
        }
      } else if (d.tool === 'ellipse') {
        const rx = Math.abs(d.currentX - d.startX) / 2
        const ry = Math.abs(d.currentY - d.startY) / 2
        if (rx > 2 || ry > 2) {
          obj = {
            id, type: 'ellipse', layerId: activeLayerId, color, width: lineWidth,
            cx: (d.startX + d.currentX) / 2, cy: (d.startY + d.currentY) / 2,
            rx, ry,
          }
        }
      } else {
        const dist = Math.hypot(d.currentX - d.startX, d.currentY - d.startY)
        if (dist > 2) {
          obj = {
            id, type: 'arrow', layerId: activeLayerId, color, width: lineWidth,
            x1: d.startX, y1: d.startY, x2: d.currentX, y2: d.currentY,
          }
        }
      }
      if (obj) onAddObject(obj)
    }

    drawingRef.current = null
  }, [color, lineWidth, activeLayerId, onAddObject])

  const handleWheel = useCallback((e) => {
    e.preventDefault()
    const rect = containerRef.current.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top

    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9
    onViewportChange(v => {
      const newScale = Math.min(5, Math.max(0.1, v.scale * zoomFactor))
      const ratio = newScale / v.scale
      return {
        scale: newScale,
        x: mx - (mx - v.x) * ratio,
        y: my - (my - v.y) * ratio,
      }
    })
  }, [onViewportChange])

  // Space key for pan
  useEffect(() => {
    function onKeyDown(e) {
      if (e.code === 'Space' && !e.repeat && !isTextEditing) {
        e.preventDefault()
        spaceDownRef.current = true
      }
    }
    function onKeyUp(e) {
      if (e.code === 'Space') {
        spaceDownRef.current = false
        lastPanRef.current = null
      }
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [isTextEditing])

  // Prevent default wheel on container
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  const cursorStyle = (() => {
    if (spaceDownRef.current) return 'grab'
    switch (tool) {
      case 'pan': return 'grab'
      case 'eraser': return 'cell'
      case 'text': return 'text'
      default: return 'crosshair'
    }
  })()

  return (
    <div ref={containerRef} className={styles.container} style={{ cursor: cursorStyle }}>
      <div
        className={styles.canvasWrapper}
        style={{
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
          transformOrigin: '0 0',
        }}
      >
        <canvas ref={staticRef} width={CANVAS_W} height={CANVAS_H} className={styles.canvas} />
        <canvas
          ref={dynamicRef}
          width={CANVAS_W} height={CANVAS_H}
          className={styles.canvas}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        />
        {isTextEditing && (
          <input
            className={styles.textInput}
            style={{
              left: textPos.x,
              top: textPos.y,
              fontSize: fontSize,
              color,
            }}
            value={textValue}
            onChange={e => onTextChange(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') onTextConfirm() }}
            onBlur={onTextConfirm}
            autoFocus
          />
        )}
      </div>
    </div>
  )
}
