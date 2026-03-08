import { useState, useEffect, useRef, useCallback } from 'react'
import { BOARD_SIZE, TOTAL_CELLS, checkWinner, checkDraw, getFirstColor, getAIMove } from './gameLogic'
import SetupScreen from './components/SetupScreen'
import GameScreen from './components/GameScreen'
import OnlineLobby from './components/OnlineLobby'

const INITIAL_SCORES = { B: 0, W: 0, draws: 0 }
const AI_COLOR = 'W'

function makeInitialGame(firstColor) {
  return {
    board: Array(TOTAL_CELLS).fill(null),
    currentColor: firstColor,
    winner: null,
    winStones: null,
    isDraw: false,
    lastMove: null,
  }
}

export default function App() {
  const [screen, setScreen] = useState('setup')
  const [players, setPlayers] = useState([
    { name: '黑方', color: 'B' },
    { name: '白方', color: 'W' },
  ])
  const [scores, setScores] = useState(INITIAL_SCORES)
  const [roundNumber, setRoundNumber] = useState(0)
  const [game, setGame] = useState(null)
  const [gameMode, setGameMode] = useState('pvp')
  const [difficulty, setDifficulty] = useState('normal')
  const [isAIThinking, setIsAIThinking] = useState(false)
  const aiTimerRef = useRef(null)

  // Online state
  const peerRef = useRef(null)
  const [myColor, setMyColor] = useState(null)
  const [peerDisconnected, setPeerDisconnected] = useState(false)
  const [waitingRestart, setWaitingRestart] = useState(false)

  function handleStart(name1, name2, mode, diff) {
    const isPvE = mode === 'pve'
    const p = [
      { name: name1 || '黑方', color: 'B' },
      { name: isPvE ? '電腦' : (name2 || '白方'), color: 'W' },
    ]
    setPlayers(p)
    setGameMode(mode)
    setDifficulty(diff)
    setScores(INITIAL_SCORES)
    setRoundNumber(0)
    setGame(makeInitialGame(getFirstColor(0)))
    setScreen('game')
  }

  function handleOnline() {
    setScreen('lobby')
  }

  const handlePeerData = useCallback((data) => {
    if (data.type === 'move') {
      const { row, col } = data
      setGame(prev => {
        if (!prev || prev.winner || prev.isDraw) return prev
        const idx = row * BOARD_SIZE + col
        if (prev.board[idx]) return prev

        const newBoard = [...prev.board]
        newBoard[idx] = prev.currentColor
        const result = checkWinner(newBoard, row, col)
        const draw = !result && checkDraw(newBoard)

        if (result) {
          setScores(s => ({ ...s, [result.color]: s[result.color] + 1 }))
        } else if (draw) {
          setScores(s => ({ ...s, draws: s.draws + 1 }))
        }

        return {
          board: newBoard,
          currentColor: prev.currentColor === 'B' ? 'W' : 'B',
          winner: result ? result.color : null,
          winStones: result ? result.stones : null,
          isDraw: draw,
          lastMove: [row, col],
        }
      })
    } else if (data.type === 'restart') {
      peerRef.current?.sendData({ type: 'restart_ack' })
      setWaitingRestart(false)
      setRoundNumber(n => n + 1)
      setGame(makeInitialGame('B'))
    } else if (data.type === 'restart_ack') {
      setWaitingRestart(false)
      setRoundNumber(n => n + 1)
      setGame(makeInitialGame('B'))
    }
  }, [])

  function handleConnected(pc, role) {
    peerRef.current = pc
    const color = role === 'host' ? 'B' : 'W'
    setMyColor(color)
    setGameMode('online')
    setPeerDisconnected(false)
    setWaitingRestart(false)
    setPlayers([
      { name: role === 'host' ? '你' : '對手', color: 'B' },
      { name: role === 'host' ? '對手' : '你', color: 'W' },
    ])
    setScores(INITIAL_SCORES)
    setRoundNumber(0)
    setGame(makeInitialGame('B'))
    setScreen('game')

    pc.on('onData', handlePeerData)
    pc.on('onDisconnect', () => setPeerDisconnected(true))
  }

  function placeMove(row, col) {
    setGame(prev => {
      if (!prev || prev.winner || prev.isDraw) return prev
      const idx = row * BOARD_SIZE + col
      if (prev.board[idx]) return prev

      const newBoard = [...prev.board]
      newBoard[idx] = prev.currentColor
      const result = checkWinner(newBoard, row, col)
      const draw = !result && checkDraw(newBoard)

      if (result) {
        setScores(s => ({ ...s, [result.color]: s[result.color] + 1 }))
      } else if (draw) {
        setScores(s => ({ ...s, draws: s.draws + 1 }))
      }

      return {
        board: newBoard,
        currentColor: prev.currentColor === 'B' ? 'W' : 'B',
        winner: result ? result.color : null,
        winStones: result ? result.stones : null,
        isDraw: draw,
        lastMove: [row, col],
      }
    })
  }

  function handlePlace(row, col) {
    if (gameMode === 'online') {
      if (!game || game.currentColor !== myColor) return
      placeMove(row, col)
      peerRef.current?.sendData({ type: 'move', row, col })
      return
    }

    if (isAIThinking) return
    if (gameMode === 'pve' && game && game.currentColor === AI_COLOR) return
    placeMove(row, col)
  }

  // AI auto-move
  useEffect(() => {
    if (gameMode !== 'pve' || !game || game.winner || game.isDraw) return
    if (game.currentColor !== AI_COLOR) return

    setIsAIThinking(true)
    const cancelled = { current: false }

    aiTimerRef.current = setTimeout(() => {
      if (cancelled.current) return
      const move = getAIMove([...game.board], AI_COLOR, difficulty)
      if (move) {
        placeMove(move.row, move.col)
      }
      setIsAIThinking(false)
    }, 500)

    return () => {
      cancelled.current = true
      clearTimeout(aiTimerRef.current)
      setIsAIThinking(false)
    }
  }, [game?.currentColor, game?.winner, game?.isDraw, gameMode])

  function handlePlayAgain() {
    if (gameMode === 'online') {
      peerRef.current?.sendData({ type: 'restart' })
      setWaitingRestart(true)
      return
    }
    const next = roundNumber + 1
    setRoundNumber(next)
    setGame(makeInitialGame(getFirstColor(next)))
  }

  function handleRestart() {
    clearTimeout(aiTimerRef.current)
    peerRef.current?.destroy()
    peerRef.current = null
    setMyColor(null)
    setPeerDisconnected(false)
    setWaitingRestart(false)
    setIsAIThinking(false)
    setScreen('setup')
    setGame(null)
    setScores(INITIAL_SCORES)
    setRoundNumber(0)
  }

  if (screen === 'setup') {
    return <SetupScreen onStart={handleStart} onOnline={handleOnline} />
  }

  if (screen === 'lobby') {
    return <OnlineLobby onConnected={handleConnected} onBack={() => setScreen('setup')} />
  }

  return (
    <GameScreen
      players={players}
      scores={scores}
      game={game}
      roundNumber={roundNumber}
      isAIThinking={isAIThinking}
      onPlace={handlePlace}
      onPlayAgain={handlePlayAgain}
      onRestart={handleRestart}
      peerDisconnected={peerDisconnected}
      waitingRestart={waitingRestart}
      gameMode={gameMode}
    />
  )
}
