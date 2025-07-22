import { useDispatch } from "react-redux";
import { resetGame, startNewGame } from "../../store/sudokuSlice";
import type { Difficulty } from "../../types/sudoku";
import { motion } from "framer-motion";
import { fadeInDown, fadeInUp } from "../../animation/CommonVariants";

const GameOverModal = ({ difficulty }: { difficulty: Difficulty }) => {
  const dispatch = useDispatch();
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full">
        <motion.h2
          variants={fadeInDown}
          initial="hidden"
          animate="show"
          custom={0.1}
          className="text-2xl font-bold text-red-600 mb-4 text-center"
        >
          Game Over!
        </motion.h2>
        <p className="mb-6 text-center">
          You've reached the maximum number of mistakes
        </p>
        <div className="flex flex-col space-y-3">
          <motion.button
            variants={fadeInUp}
            initial="hidden"
            animate="show"
            onClick={() => dispatch(startNewGame(difficulty))}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Play Again
          </motion.button>
          <motion.button
            variants={fadeInUp}
            initial="hidden"
            animate="show"
            custom={0.3}
            onClick={() => dispatch(resetGame())}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Back to Menu
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;
