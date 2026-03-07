import { useState } from 'react'
import { checkWinner, checkDraw, getFirstMark } from './gameLogic'
import SetupScreen from './components/SetupScreen'
import GameScreen from './components/GameScreen'

const INITIAL_SCORES = { X: 0, O: 0, draws: 0 }

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

  function handleStart(name1, name2) {
    const p = [
      { name: name1 || 'Player 1', mark: 'X' },
      { name: name2 || 'Player 2', mark: 'O' },
    ]
    setPlayers(p)
    setScores(INITIAL_SCORES)
    setRoundNumber(0)
    setGame(makeInitialGame(getFirstMark(0, p)))
    setScreen('game')
  }

  function handleCellClick(index) {
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
    setGame({
      board: newBoard,
      currentMark: game.currentMark === 'X' ? 'O' : 'X',
      winner: result ? result.mark : null,
      winLine: result ? result.line : null,
      isDraw: draw,
    })
  }

  function handlePlayAgain() {
    const next = roundNumber + 1
    setRoundNumber(next)
    setGame(makeInitialGame(getFirstMark(next, players)))
  }

  function handleRestart() {
    setScreen('setup')
    setGame(null)
    setScores(INITIAL_SCORES)
    setRoundNumber(0)
  }

  if (screen === 'setup') {
    return <SetupScreen onStart={handleStart} />
  }

  return (
    <GameScreen
      players={players}
      scores={scores}
      game={game}
      roundNumber={roundNumber}
      onCellClick={handleCellClick}
      onPlayAgain={handlePlayAgain}
      onRestart={handleRestart}
    />
  )
}
