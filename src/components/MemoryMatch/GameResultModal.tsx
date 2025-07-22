import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { startGame, resetGame } from "../../store/memorymatchSlice";
import ConfettiCannon from "../Common/ConfettiCannon";

const GameResultModal = () => {
  const dispatch = useDispatch();
  const { players, isGameOver } = useSelector(
    (state: RootState) => state.memoryMatch
  );

  const getWinner = () => {
    if (!isGameOver) return null;

    const maxScore = Math.max(...players.map((player) => player.score));
    const winners = players.filter((player) => player.score === maxScore);

    if (winners.length === 1) {
      return winners[0];
    }
    return null; // It's a tie
  };

  const handlePlayAgain = () => {
    dispatch(startGame());
  };

  const handleNewGame = () => {
    dispatch(resetGame());
  };

  const winner = getWinner();
  const shouldShowConfetti = winner !== null && isGameOver;

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
          {winner ? `${winner.name} Wins!` : "It's a Tie!"}
        </h2>

        <div className="space-y-2 mb-6">
          {players.map((player) => (
            <div
              key={player.id}
              className="flex justify-between items-center p-2 rounded-lg bg-gray-50"
            >
              <span className="font-medium">{player.name}</span>
              <span className="font-bold text-indigo-600">
                {player.score} pairs
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col space-y-3">
          <button
            onClick={handlePlayAgain}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Play Again
          </button>
          <button
            onClick={handleNewGame}
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
