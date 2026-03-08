import { useState, useEffect, useRef, useCallback } from 'react'
import { checkWinner, checkDraw, getFirstMark, getAIMove } from './gameLogic'
import SetupScreen from './components/SetupScreen'
import GameScreen from './components/GameScreen'
import OnlineLobby from './components/OnlineLobby'

const INITIAL_SCORES = { X: 0, O: 0, draws: 0 }
const AI_MARK = 'X'

function makeInitialGame(firstMark) {
  return {
    board: Array(9).fill(null),
    currentMark: firstMark,
    winner: null,
    winLine: null,
    isDraw: false,
  }
}

export default function App() {
  const [screen, setScreen] = useState('setup')
  const [players, setPlayers] = useState([
    { name: 'Player 1', mark: 'X' },
    { name: 'Player 2', mark: 'O' },
  ])
  const [scores, setScores] = useState(INITIAL_SCORES)
  const [roundNumber, setRoundNumber] = useState(0)
  const [game, setGame] = useState(null)
  const [gameMode, setGameMode] = useState('pvp')
  const [difficulty, setDifficulty] = useState('normal')
  const [isAIThinking, setIsAIThinking] = useState(false)
  const aiTimeoutRef = useRef(null)

  // Online state
  const peerRef = useRef(null)
  const [myMark, setMyMark] = useState(null)
  const [peerDisconnected, setPeerDisconnected] = useState(false)
  const [waitingRestart, setWaitingRestart] = useState(false)

  function handleStart(name1, name2, mode, diff) {
    const p = mode === 'pve'
      ? [{ name: name1 || 'Player 1', mark: 'O' }, { name: '電腦', mark: 'X' }]
      : [{ name: name1 || 'Player 1', mark: 'X' }, { name: name2 || 'Player 2', mark: 'O' }]
    setPlayers(p)
    setGameMode(mode)
    setDifficulty(diff || 'normal')
    setScores(INITIAL_SCORES)
    setRoundNumber(0)
    setIsAIThinking(false)
    setGame(makeInitialGame(getFirstMark(0, p)))
    setScreen('game')
  }

  // -- Online handlers --

  function handleOnline() {
    setScreen('lobby')
  }

  const handlePeerData = useCallback((data) => {
    if (data.type === 'move') {
      // Opponent's move — apply it
      setGame(prev => {
        if (!prev || prev.board[data.index] || prev.winner || prev.isDraw) return prev
        const newBoard = [...prev.board]
        newBoard[data.index] = prev.currentMark
        const result = checkWinner(newBoard)
        const draw = !result && checkDraw(newBoard)
        if (result) {
          setScores(s => ({ ...s, [result.mark]: s[result.mark] + 1 }))
        } else if (draw) {
          setScores(s => ({ ...s, draws: s.draws + 1 }))
        }
        return {
          board: newBoard,
          currentMark: prev.currentMark === 'X' ? 'O' : 'X',
          winner: result ? result.mark : null,
          winLine: result ? result.line : null,
          isDraw: draw,
        }
      })
    } else if (data.type === 'restart') {
      // Opponent wants to play again — auto-accept
      peerRef.current?.sendData({ type: 'restart_ack' })
      setWaitingRestart(false)
      setRoundNumber(n => n + 1)
      setGame(makeInitialGame('O'))
    } else if (data.type === 'restart_ack') {
      setWaitingRestart(false)
      setRoundNumber(n => n + 1)
      setGame(makeInitialGame('O'))
    }
  }, [])

  function handleConnected(pc, role) {
    peerRef.current = pc
    const mark = role === 'host' ? 'O' : 'X'
    setMyMark(mark)
    setGameMode('online')
    setPeerDisconnected(false)
    setWaitingRestart(false)
    setPlayers([
      { name: role === 'host' ? '對手' : '你', mark: 'X' },
      { name: role === 'host' ? '你' : '對手', mark: 'O' },
    ])
    setScores(INITIAL_SCORES)
    setRoundNumber(0)
    setGame(makeInitialGame('O'))
    setScreen('game')

    pc.on('onData', handlePeerData)
    pc.on('onDisconnect', () => setPeerDisconnected(true))
  }

  function handleCellClick(index) {
    if (!game || game.board[index] || game.winner || game.isDraw) return

    if (gameMode === 'online') {
      if (game.currentMark !== myMark) return
      // Place locally and send to peer
      placeMove(index)
      peerRef.current?.sendData({ type: 'move', index })
      return
    }

    if (gameMode === 'pve' && game.currentMark === AI_MARK) return
    placeMove(index)
  }

  function placeMove(index) {
    if (!game || game.board[index] || game.winner || game.isDraw) return
    const newBoard = [...game.board]
    newBoard[index] = game.currentMark
    const result = checkWinner(newBoard)
    const draw = !result && checkDraw(newBoard)
    if (result) {
      setScores(s => ({ ...s, [result.mark]: s[result.mark] + 1 }))
    } else if (draw) {
      setScores(s => ({ ...s, draws: s.draws + 1 }))
    }
    setIsAIThinking(false)
    setGame({
      board: newBoard,
      currentMark: game.currentMark === 'X' ? 'O' : 'X',
      winner: result ? result.mark : null,
      winLine: result ? result.line : null,
      isDraw: draw,
    })
  }

  // AI auto-move effect
  useEffect(() => {
    if (gameMode !== 'pve' || !game) return
    if (game.winner || game.isDraw) return
    if (game.currentMark !== AI_MARK) return

    setIsAIThinking(true)
    aiTimeoutRef.current = setTimeout(() => {
      const move = getAIMove([...game.board], AI_MARK, difficulty)
      if (move >= 0) placeMove(move)
    }, 500)

    return () => {
      clearTimeout(aiTimeoutRef.current)
      aiTimeoutRef.current = null
    }
  }, [game, gameMode])

  function handlePlayAgain() {
    if (gameMode === 'online') {
      peerRef.current?.sendData({ type: 'restart' })
      setWaitingRestart(true)
      return
    }
    const next = roundNumber + 1
    setRoundNumber(next)
    setIsAIThinking(false)
    setGame(makeInitialGame(getFirstMark(next, players)))
  }

  function handleRestart() {
    clearTimeout(aiTimeoutRef.current)
    peerRef.current?.destroy()
    peerRef.current = null
    setMyMark(null)
    setPeerDisconnected(false)
    setWaitingRestart(false)
    setScreen('setup')
    setGame(null)
    setScores(INITIAL_SCORES)
    setRoundNumber(0)
    setIsAIThinking(false)
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
      onCellClick={handleCellClick}
      onPlayAgain={handlePlayAgain}
      onRestart={handleRestart}
      peerDisconnected={peerDisconnected}
      waitingRestart={waitingRestart}
      gameMode={gameMode}
    />
  )
}
