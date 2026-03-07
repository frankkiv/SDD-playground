import Scoreboard from './Scoreboard'
import TurnIndicator from './TurnIndicator'
import Board from './Board'
import GameResult from './GameResult'
import styles from './GameScreen.module.css'

export default function GameScreen({ players, scores, game, roundNumber, isAIThinking, onCellClick, onPlayAgain, onRestart }) {
  const isGameOver = !!(game.winner || game.isDraw)

  return (
    <div className={styles.container}>
      <Scoreboard players={players} scores={scores} />
      <TurnIndicator
        players={players}
        currentMark={game.currentMark}
        winner={game.winner}
        isDraw={game.isDraw}
        isAIThinking={isAIThinking}
      />
      <Board
        board={game.board}
        winLine={game.winLine}
        isGameOver={isGameOver}
        onCellClick={onCellClick}
      />
      {isGameOver && (
        <GameResult
          players={players}
          winner={game.winner}
          isDraw={game.isDraw}
          roundNumber={roundNumber}
          onPlayAgain={onPlayAgain}
          onRestart={onRestart}
        />
      )}
    </div>
  )
}
