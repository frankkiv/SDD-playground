import { useState, useCallback, useEffect, useRef } from 'react'
import SetupScreen from './components/SetupScreen'
import WhiteboardCanvas from './components/WhiteboardCanvas'
import Toolbar from './components/Toolbar'
import LayerPanel from './components/LayerPanel'
import SharePanel from './components/SharePanel'
import { createInitialState, createLayer, genId, serializeState, deserializeState } from './whiteboardState'
import { renderAll } from './renderer'
import { createPeerConnection } from './peerConnection'
import styles from './App.module.css'

export default function App() {
  const [screen, setScreen] = useState('setup') // setup | whiteboard
  const [isOnline, setIsOnline] = useState(false)
  const peerRef = useRef(null)
  const [peerDisconnected, setPeerDisconnected] = useState(false)
  const [showSharePanel, setShowSharePanel] = useState(false)
  const [roomCode, setRoomCode] = useState('')
  const [shareStatus, setShareStatus] = useState('idle') // idle | waiting | connected

  // Whiteboard state
  const [wbState, setWbState] = useState(createInitialState)
  const wbStateRef = useRef(wbState)
  wbStateRef.current = wbState
  const [tool, setTool] = useState('pen')
  const [color, setColor] = useState('#ffffff')
  const [lineWidth, setLineWidth] = useState(4)
  const [fontSize, setFontSize] = useState(24)
  const [viewport, setViewport] = useState(() => ({
    x: -1500, y: -1500, scale: 1
  }))
  const [showLayerPanel, setShowLayerPanel] = useState(false)

  // Undo/Redo stacks
  const undoStackRef = useRef([])
  const redoStackRef = useRef([])
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  // Text editing state
  const [isTextEditing, setIsTextEditing] = useState(false)
  const [textPos, setTextPos] = useState({ x: 0, y: 0 })
  const [textValue, setTextValue] = useState('')
  const textConfirmedRef = useRef(false)

  // Author ID for online undo scoping
  const authorRef = useRef('local')

  function updateUndoRedoState() {
    setCanUndo(undoStackRef.current.length > 0)
    setCanRedo(redoStackRef.current.length > 0)
  }

  // Sync helper
  const sendToPeer = useCallback((data) => {
    peerRef.current?.sendData(data)
  }, [])

  // Handle peer data
  const handlePeerData = useCallback((data) => {
    if (data.type === 'add-object') {
      setWbState(prev => ({ ...prev, objects: [...prev.objects, data.obj] }))
    } else if (data.type === 'remove-objects') {
      const ids = new Set(data.ids)
      setWbState(prev => ({ ...prev, objects: prev.objects.filter(o => !ids.has(o.id)) }))
    } else if (data.type === 'clear') {
      setWbState(prev => ({ ...prev, objects: [] }))
    } else if (data.type === 'snapshot') {
      const newState = deserializeState(data.state)
      setWbState(newState)
    } else if (data.type === 'layer-add') {
      setWbState(prev => {
        const newLayers = [...prev.layers]
        newLayers.splice(data.afterIdx + 1, 0, data.layer)
        return { ...prev, layers: newLayers }
      })
    } else if (data.type === 'layer-remove') {
      setWbState(prev => ({
        ...prev,
        layers: prev.layers.filter(l => l.id !== data.layerId),
        objects: prev.objects.filter(o => o.layerId !== data.layerId),
      }))
    } else if (data.type === 'layer-toggle') {
      setWbState(prev => ({
        ...prev,
        layers: prev.layers.map(l => l.id === data.layerId ? { ...l, visible: !l.visible } : l)
      }))
    } else if (data.type === 'layer-reorder') {
      setWbState(prev => {
        const map = new Map(prev.layers.map(l => [l.id, l]))
        return { ...prev, layers: data.order.map(id => map.get(id)).filter(Boolean) }
      })
    }
  }, [])

  // Setup peer connection (shared between host and guest)
  function setupPeer(pc, role) {
    peerRef.current = pc
    setIsOnline(true)
    authorRef.current = role
    setPeerDisconnected(false)

    pc.on('onData', handlePeerData)
    pc.on('onDisconnect', () => setPeerDisconnected(true))
  }

  // Share: create room from within the whiteboard
  const handleShare = useCallback(async () => {
    if (peerRef.current) return // already connected
    setShareStatus('waiting')
    setShowSharePanel(true)

    const pc = createPeerConnection()
    peerRef.current = pc
    authorRef.current = 'host'

    pc.on('onData', handlePeerData)
    pc.on('onDisconnect', () => {
      setPeerDisconnected(true)
      setShareStatus('idle')
    })

    pc.on('onConnect', () => {
      setIsOnline(true)
      setShareStatus('connected')
      setPeerDisconnected(false)
      // Send snapshot to guest
      pc.sendData({ type: 'snapshot', state: serializeState(wbStateRef.current) })
    })

    try {
      const code = await pc.createRoom()
      setRoomCode(code)
    } catch {
      setShareStatus('idle')
      peerRef.current = null
      pc.destroy()
    }
  }, [handlePeerData])

  // Cancel sharing
  const handleCancelShare = useCallback(() => {
    if (shareStatus === 'waiting') {
      peerRef.current?.destroy()
      peerRef.current = null
      setShareStatus('idle')
      setRoomCode('')
      setIsOnline(false)
    }
    setShowSharePanel(false)
  }, [shareStatus])

  // Join from setup screen
  const handleJoin = useCallback(async (code) => {
    const pc = createPeerConnection()

    pc.on('onData', handlePeerData)
    pc.on('onDisconnect', () => setPeerDisconnected(true))

    await pc.joinRoom(code)
    peerRef.current = pc
    setIsOnline(true)
    authorRef.current = 'guest'
    setPeerDisconnected(false)
    setShareStatus('connected')
    setScreen('whiteboard')
  }, [handlePeerData])

  // Add object with undo support
  const addObject = useCallback((obj) => {
    const tagged = { ...obj, author: authorRef.current }
    setWbState(prev => ({ ...prev, objects: [...prev.objects, tagged] }))
    undoStackRef.current.push({ type: 'add', obj: tagged })
    redoStackRef.current = []
    updateUndoRedoState()
    sendToPeer({ type: 'add-object', obj: tagged })
  }, [sendToPeer])

  // Remove objects with undo support
  const removeObjects = useCallback((ids) => {
    const idSet = new Set(ids)
    setWbState(prev => {
      const removed = prev.objects.filter(o => idSet.has(o.id))
      if (removed.length > 0) {
        undoStackRef.current.push({ type: 'remove', objects: removed })
        redoStackRef.current = []
        updateUndoRedoState()
      }
      return { ...prev, objects: prev.objects.filter(o => !idSet.has(o.id)) }
    })
    sendToPeer({ type: 'remove-objects', ids })
  }, [sendToPeer])

  // Undo
  const handleUndo = useCallback(() => {
    const cmd = undoStackRef.current.pop()
    if (!cmd) return
    if (cmd.type === 'add') {
      setWbState(prev => ({ ...prev, objects: prev.objects.filter(o => o.id !== cmd.obj.id) }))
      redoStackRef.current.push(cmd)
    } else if (cmd.type === 'remove') {
      setWbState(prev => ({ ...prev, objects: [...prev.objects, ...cmd.objects] }))
      redoStackRef.current.push(cmd)
    } else if (cmd.type === 'clear') {
      setWbState(prev => ({ ...prev, objects: cmd.objects }))
      redoStackRef.current.push(cmd)
    }
    updateUndoRedoState()
    sendToPeer({ type: 'undo' })
  }, [sendToPeer])

  // Redo
  const handleRedo = useCallback(() => {
    const cmd = redoStackRef.current.pop()
    if (!cmd) return
    if (cmd.type === 'add') {
      setWbState(prev => ({ ...prev, objects: [...prev.objects, cmd.obj] }))
      undoStackRef.current.push(cmd)
    } else if (cmd.type === 'remove') {
      const ids = new Set(cmd.objects.map(o => o.id))
      setWbState(prev => ({ ...prev, objects: prev.objects.filter(o => !ids.has(o.id)) }))
      undoStackRef.current.push(cmd)
    } else if (cmd.type === 'clear') {
      setWbState(prev => {
        undoStackRef.current.push({ type: 'clear', objects: prev.objects })
        return { ...prev, objects: [] }
      })
    }
    updateUndoRedoState()
    sendToPeer({ type: 'redo' })
  }, [sendToPeer])

  // Clear all
  const handleClear = useCallback(() => {
    setWbState(prev => {
      undoStackRef.current.push({ type: 'clear', objects: prev.objects })
      redoStackRef.current = []
      updateUndoRedoState()
      return { ...prev, objects: [] }
    })
    sendToPeer({ type: 'clear' })
  }, [sendToPeer])

  // Export PNG
  const handleExport = useCallback(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 4000
    canvas.height = 4000
    const ctx = canvas.getContext('2d')
    renderAll(ctx, wbState.objects, wbState.layers, 4000, 4000)
    const link = document.createElement('a')
    link.download = 'whiteboard.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }, [wbState])

  // Save JSON
  const handleSave = useCallback(() => {
    const data = serializeState(wbState)
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const link = document.createElement('a')
    link.download = 'whiteboard.json'
    link.href = URL.createObjectURL(blob)
    link.click()
    URL.revokeObjectURL(link.href)
  }, [wbState])

  // Load JSON
  const handleLoad = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result)
          if (!data.layers || !data.objects) throw new Error('Invalid format')
          const newState = deserializeState(data)
          setWbState(newState)
          undoStackRef.current = []
          redoStackRef.current = []
          updateUndoRedoState()
        } catch {
          alert('檔案格式不正確')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }, [])

  // Layer operations
  const handleAddLayer = useCallback(() => {
    setWbState(prev => {
      const idx = prev.layers.findIndex(l => l.id === prev.activeLayerId)
      const newLayer = createLayer(`圖層 ${prev.layers.length + 1}`)
      const newLayers = [...prev.layers]
      newLayers.splice(idx + 1, 0, newLayer)
      sendToPeer({ type: 'layer-add', layer: newLayer, afterIdx: idx })
      return { ...prev, layers: newLayers, activeLayerId: newLayer.id }
    })
  }, [sendToPeer])

  const handleRemoveLayer = useCallback((layerId) => {
    setWbState(prev => {
      if (prev.layers.length <= 1) return prev
      const newLayers = prev.layers.filter(l => l.id !== layerId)
      const newObjects = prev.objects.filter(o => o.layerId !== layerId)
      const newActiveId = prev.activeLayerId === layerId ? newLayers[0].id : prev.activeLayerId
      sendToPeer({ type: 'layer-remove', layerId })
      return { ...prev, layers: newLayers, objects: newObjects, activeLayerId: newActiveId }
    })
  }, [sendToPeer])

  const handleToggleLayerVisible = useCallback((layerId) => {
    setWbState(prev => ({
      ...prev,
      layers: prev.layers.map(l => l.id === layerId ? { ...l, visible: !l.visible } : l)
    }))
    sendToPeer({ type: 'layer-toggle', layerId })
  }, [sendToPeer])

  const handleReorderLayers = useCallback((order) => {
    setWbState(prev => {
      const map = new Map(prev.layers.map(l => [l.id, l]))
      return { ...prev, layers: order.map(id => map.get(id)).filter(Boolean) }
    })
    sendToPeer({ type: 'layer-reorder', order })
  }, [sendToPeer])

  const handleSetActiveLayer = useCallback((layerId) => {
    setWbState(prev => ({ ...prev, activeLayerId: layerId }))
  }, [])

  // Text tool
  const handleTextStart = useCallback((x, y) => {
    setTextPos({ x, y })
    setTextValue('')
    setIsTextEditing(true)
    textConfirmedRef.current = false
  }, [])

  const handleTextConfirm = useCallback(() => {
    if (textConfirmedRef.current) return
    textConfirmedRef.current = true
    if (textValue.trim()) {
      addObject({
        id: genId(),
        type: 'text',
        layerId: wbState.activeLayerId,
        x: textPos.x,
        y: textPos.y,
        content: textValue.trim(),
        fontSize,
        color,
      })
    }
    setIsTextEditing(false)
    setTextValue('')
  }, [textValue, textPos, fontSize, color, wbState.activeLayerId, addObject])

  // Keyboard shortcuts
  useEffect(() => {
    function onKeyDown(e) {
      if (isTextEditing) return
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        handleUndo()
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault()
        handleRedo()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleUndo, handleRedo, isTextEditing])

  function handleBackToSetup() {
    peerRef.current?.destroy()
    peerRef.current = null
    setIsOnline(false)
    setPeerDisconnected(false)
    setShareStatus('idle')
    setRoomCode('')
    setShowSharePanel(false)
    setWbState(createInitialState())
    undoStackRef.current = []
    redoStackRef.current = []
    updateUndoRedoState()
    setViewport({ x: -1500, y: -1500, scale: 1 })
    setScreen('setup')
  }

  const handleResetZoom = useCallback(() => {
    setViewport({ x: -1500, y: -1500, scale: 1 })
  }, [])

  if (screen === 'setup') {
    return (
      <SetupScreen
        onStart={() => setScreen('whiteboard')}
        onJoin={handleJoin}
      />
    )
  }

  // Whiteboard screen
  return (
    <div className={styles.whiteboardScreen}>
      <button className={styles.backBtn} onClick={handleBackToSetup}>
        ← 返回
      </button>

      {peerDisconnected && (
        <div className={styles.disconnectBanner}>
          對方已離線
        </div>
      )}

      {isOnline && !peerDisconnected && shareStatus === 'connected' && (
        <div className={styles.connectedBadge}>
          已連線
        </div>
      )}

      <WhiteboardCanvas
        objects={wbState.objects}
        layers={wbState.layers}
        activeLayerId={wbState.activeLayerId}
        tool={tool}
        color={color}
        lineWidth={lineWidth}
        fontSize={fontSize}
        viewport={viewport}
        onViewportChange={setViewport}
        onAddObject={addObject}
        onRemoveObjects={removeObjects}
        isTextEditing={isTextEditing}
        textPos={textPos}
        textValue={textValue}
        onTextChange={setTextValue}
        onTextConfirm={handleTextConfirm}
        onTextStart={handleTextStart}
      />

      <Toolbar
        tool={tool}
        color={color}
        lineWidth={lineWidth}
        fontSize={fontSize}
        onToolChange={setTool}
        onColorChange={setColor}
        onLineWidthChange={setLineWidth}
        onFontSizeChange={setFontSize}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
        onExport={handleExport}
        onSave={handleSave}
        onLoad={handleLoad}
        onToggleLayers={() => setShowLayerPanel(p => !p)}
        showLayerPanel={showLayerPanel}
        onToggleShare={() => {
          if (!peerRef.current) handleShare()
          else setShowSharePanel(p => !p)
        }}
        isOnline={isOnline}
        shareStatus={shareStatus}
        canUndo={canUndo}
        canRedo={canRedo}
        zoom={viewport.scale}
        onResetZoom={handleResetZoom}
      />

      {showLayerPanel && (
        <LayerPanel
          layers={wbState.layers}
          activeLayerId={wbState.activeLayerId}
          onSetActive={handleSetActiveLayer}
          onAdd={handleAddLayer}
          onRemove={handleRemoveLayer}
          onToggleVisible={handleToggleLayerVisible}
          onReorder={handleReorderLayers}
        />
      )}

      {showSharePanel && (
        <SharePanel
          roomCode={roomCode}
          status={shareStatus}
          onClose={handleCancelShare}
        />
      )}
    </div>
  )
}
