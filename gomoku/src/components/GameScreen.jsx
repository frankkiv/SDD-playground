import Scoreboard from './Scoreboard'
import TurnIndicator from './TurnIndicator'
import GomokuBoard from './GomokuBoard'
import GameResult from './GameResult'
import styles from './GameScreen.module.css'

export default function GameScreen({ players, scores, game, roundNumber, isAIThinking, onPlace, onPlayAgain, onRestart, peerDisconnected, waitingRestart, gameMode }) {
  const isGameOver = !!(game.winner || game.isDraw)

  return (
    <div className={styles.container}>
      <Scoreboard players={players} scores={scores} />
      <TurnIndicator
        players={players}
        currentColor={game.currentColor}
        winner={game.winner}
        isDraw={game.isDraw}
        isAIThinking={isAIThinking}
      />
      <GomokuBoard
        board={game.board}
        currentColor={game.currentColor}
        winStones={game.winStones}
        isGameOver={isGameOver}
        lastMove={game.lastMove}
        onPlace={onPlace}
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
