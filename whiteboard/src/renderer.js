// Canvas rendering functions for all object types

export function renderObject(ctx, obj) {
  switch (obj.type) {
    case 'stroke': renderStroke(ctx, obj); break
    case 'highlighter': renderHighlighter(ctx, obj); break
    case 'rect': renderRect(ctx, obj); break
    case 'ellipse': renderEllipse(ctx, obj); break
    case 'arrow': renderArrow(ctx, obj); break
    case 'text': renderText(ctx, obj); break
  }
}

function renderStroke(ctx, obj) {
  if (obj.points.length < 2) return
  ctx.save()
  ctx.strokeStyle = obj.color
  ctx.lineWidth = obj.width
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.globalAlpha = 1
  ctx.beginPath()
  ctx.moveTo(obj.points[0].x, obj.points[0].y)
  for (let i = 1; i < obj.points.length; i++) {
    ctx.lineTo(obj.points[i].x, obj.points[i].y)
  }
  ctx.stroke()
  ctx.restore()
}

function renderHighlighter(ctx, obj) {
  if (obj.points.length < 2) return
  ctx.save()
  ctx.strokeStyle = obj.color
  ctx.lineWidth = obj.width
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.globalAlpha = 0.3
  ctx.beginPath()
  ctx.moveTo(obj.points[0].x, obj.points[0].y)
  for (let i = 1; i < obj.points.length; i++) {
    ctx.lineTo(obj.points[i].x, obj.points[i].y)
  }
  ctx.stroke()
  ctx.restore()
}

function renderRect(ctx, obj) {
  ctx.save()
  ctx.strokeStyle = obj.color
  ctx.lineWidth = obj.width
  ctx.lineJoin = 'round'
  ctx.strokeRect(obj.x, obj.y, obj.w, obj.h)
  ctx.restore()
}

function renderEllipse(ctx, obj) {
  ctx.save()
  ctx.strokeStyle = obj.color
  ctx.lineWidth = obj.width
  ctx.beginPath()
  ctx.ellipse(
    obj.cx, obj.cy,
    Math.abs(obj.rx), Math.abs(obj.ry),
    0, 0, Math.PI * 2
  )
  ctx.stroke()
  ctx.restore()
}

function renderArrow(ctx, obj) {
  ctx.save()
  ctx.strokeStyle = obj.color
  ctx.fillStyle = obj.color
  ctx.lineWidth = obj.width
  ctx.lineCap = 'round'

  // Line
  ctx.beginPath()
  ctx.moveTo(obj.x1, obj.y1)
  ctx.lineTo(obj.x2, obj.y2)
  ctx.stroke()

  // Arrowhead
  const angle = Math.atan2(obj.y2 - obj.y1, obj.x2 - obj.x1)
  const headLen = Math.max(obj.width * 4, 12)
  ctx.beginPath()
  ctx.moveTo(obj.x2, obj.y2)
  ctx.lineTo(
    obj.x2 - headLen * Math.cos(angle - Math.PI / 6),
    obj.y2 - headLen * Math.sin(angle - Math.PI / 6)
  )
  ctx.lineTo(
    obj.x2 - headLen * Math.cos(angle + Math.PI / 6),
    obj.y2 - headLen * Math.sin(angle + Math.PI / 6)
  )
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function renderText(ctx, obj) {
  ctx.save()
  ctx.fillStyle = obj.color
  ctx.font = `${obj.fontSize}px 'Segoe UI', system-ui, sans-serif`
  ctx.textBaseline = 'top'
  ctx.fillText(obj.content, obj.x, obj.y)
  ctx.restore()
}

// Render all objects on a canvas, respecting layer order and visibility
export function renderAll(ctx, objects, layers, width, height) {
  ctx.clearRect(0, 0, width, height)

  const visibleLayerIds = new Set(
    layers.filter(l => l.visible).map(l => l.id)
  )
  const layerOrder = layers.map(l => l.id)

  // Sort objects by layer order
  const sorted = [...objects].sort((a, b) => {
    return layerOrder.indexOf(a.layerId) - layerOrder.indexOf(b.layerId)
  })

  for (const obj of sorted) {
    if (visibleLayerIds.has(obj.layerId)) {
      renderObject(ctx, obj)
    }
  }
}

// Check if a point (eraser) hits an object
export function hitTest(obj, px, py, radius) {
  switch (obj.type) {
    case 'stroke':
    case 'highlighter':
      return hitTestStroke(obj, px, py, radius)
    case 'rect':
      return hitTestRect(obj, px, py, radius)
    case 'ellipse':
      return hitTestEllipse(obj, px, py, radius)
    case 'arrow':
      return hitTestLine(obj, px, py, radius)
    case 'text':
      return hitTestText(obj, px, py, radius)
    default:
      return false
  }
}

function hitTestStroke(obj, px, py, radius) {
  const threshold = (obj.width / 2) + radius
  for (let i = 0; i < obj.points.length - 1; i++) {
    const dist = pointToSegmentDist(
      px, py,
      obj.points[i].x, obj.points[i].y,
      obj.points[i + 1].x, obj.points[i + 1].y
    )
    if (dist < threshold) return true
  }
  return false
}

function hitTestRect(obj, px, py, radius) {
  const threshold = (obj.width / 2) + radius
  const x2 = obj.x + obj.w
  const y2 = obj.y + obj.h
  // Check all 4 edges
  return (
    pointToSegmentDist(px, py, obj.x, obj.y, x2, obj.y) < threshold ||
    pointToSegmentDist(px, py, x2, obj.y, x2, y2) < threshold ||
    pointToSegmentDist(px, py, x2, y2, obj.x, y2) < threshold ||
    pointToSegmentDist(px, py, obj.x, y2, obj.x, obj.y) < threshold
  )
}

function hitTestEllipse(obj, px, py, radius) {
  // Approximate: check if point is near the ellipse boundary
  if (obj.rx === 0 || obj.ry === 0) return false
  const dx = (px - obj.cx) / obj.rx
  const dy = (py - obj.cy) / obj.ry
  const d = Math.sqrt(dx * dx + dy * dy)
  const threshold = (obj.width / 2 + radius) / Math.min(Math.abs(obj.rx), Math.abs(obj.ry))
  return Math.abs(d - 1) < threshold
}

function hitTestLine(obj, px, py, radius) {
  const threshold = (obj.width / 2) + radius
  return pointToSegmentDist(px, py, obj.x1, obj.y1, obj.x2, obj.y2) < threshold
}

function hitTestText(obj, px, py, radius) {
  // Approximate text bounding box
  const w = obj.content.length * obj.fontSize * 0.6
  const h = obj.fontSize * 1.2
  return (
    px + radius > obj.x && px - radius < obj.x + w &&
    py + radius > obj.y && py - radius < obj.y + h
  )
}

function pointToSegmentDist(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1
  const dy = y2 - y1
  const lenSq = dx * dx + dy * dy
  if (lenSq === 0) return Math.hypot(px - x1, py - y1)
  let t = ((px - x1) * dx + (py - y1) * dy) / lenSq
  t = Math.max(0, Math.min(1, t))
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy))
}
