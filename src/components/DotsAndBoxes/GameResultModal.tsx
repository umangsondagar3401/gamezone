import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import ConfettiCannon from "../Common/ConfettiCannon";
import { startGame, startNewGame } from "../../store/dotsAndBoxesSlice";

const GameResultModal = () => {
  const dispatch = useDispatch();
  const { winner, gameOver, gameMode, scores } = useSelector(
    (state: RootState) => state.dotsAndBoxes
  );

  const getWinner = () => {
    if (!gameOver) return null;

    if (winner === 1) {
      return "Player 1";
    } else if (winner === 2) {
      if (gameMode === "computer") {
        return "Computer";
      }
      return "Player 2";
    }
    return null; // It's a tie
  };

  const winnerPlayer = getWinner();
  const shouldShowConfetti =
    winnerPlayer !== null && winnerPlayer !== "Computer" && gameOver;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <ConfettiCannon trigger={shouldShowConfetti} />
      <motion.div
        className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <h2 className="text-2xl font-bold text-center mb-4">
          {winnerPlayer ? `${winnerPlayer} Wins!` : "It's a Tie!"}
        </h2>

        <div className="space-y-2 mb-6">
          {[
            { id: 1, name: "Player 1", score: scores.player1 },
            {
              id: 2,
              name: gameMode === "computer" ? "Computer" : "Player 2",
              score: scores.player2,
            },
          ].map((player) => (
            <div
              key={player.id}
              className="flex justify-between items-center p-2 rounded-lg bg-gray-50"
            >
              <span className="font-medium">{player.name}</span>
              <span className="font-bold text-indigo-600">
                {player.score} boxes
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col space-y-3">
          <button
            onClick={() => dispatch(startGame())}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Play Again
          </button>
          <button
            onClick={() => dispatch(startNewGame())}
            className="w-full bg-white text-gray-700 py-2 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            New Game
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default GameResultModal;
