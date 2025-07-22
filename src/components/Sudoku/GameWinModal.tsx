import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { resetGame, startNewGame } from "../../store/sudokuSlice";
import ConfettiCannon from "../Common/ConfettiCannon";
import { fadeInDown, fadeInUp } from "../../animation/CommonVariants";

const GameWinModal = ({
  formatTime,
}: {
  formatTime: (time: number) => string;
}) => {
  const dispatch = useDispatch();
  const { difficulty, timer, mistakes, isGameWon } = useSelector(
    (state: RootState) => state.sudoku
  );

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <ConfettiCannon trigger={isGameWon} />

      <motion.div
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.h1
          className="text-2xl sm:text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          variants={fadeInDown}
          initial="hidden"
          animate="show"
          custom={0.1}
        >
          Congratulations!
        </motion.h1>
        <p className="text-lg mb-2">
          You completed the puzzle in {formatTime(timer)}
        </p>
        <p className="text-gray-600 mb-8">Mistakes: {mistakes}</p>

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
            className="w-full bg-white text-gray-700 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            New Game
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default GameWinModal;
