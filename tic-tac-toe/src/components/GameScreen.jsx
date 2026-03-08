import Scoreboard from './Scoreboard'
import TurnIndicator from './TurnIndicator'
import Board from './Board'
import GameResult from './GameResult'
import styles from './GameScreen.module.css'

export default function GameScreen({ players, scores, game, roundNumber, isAIThinking, onCellClick, onPlayAgain, onRestart, peerDisconnected, waitingRestart, gameMode }) {
  const isGameOver = !!(game.winner || game.isDraw)

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={onRestart}>← 返回大廳</button>
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
      {peerDisconnected && (
        <div className={styles.disconnectBanner}>
          對手已離線
          <button className={styles.disconnectBtn} onClick={onRestart}>返回</button>
        </div>
      )}
      {isGameOver && !peerDisconnected && (
        <GameResult
          players={players}
          winner={game.winner}
          isDraw={game.isDraw}
          roundNumber={roundNumber}
          onPlayAgain={onPlayAgain}
          onRestart={onRestart}
          waitingRestart={waitingRestart}
          isOnline={gameMode === 'online'}
        />
      )}
    </div>
  )
}
