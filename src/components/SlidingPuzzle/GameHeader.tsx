import { motion } from "framer-motion";
import type { GameHeaderProps } from "../../types/puzzletile";

export const GameHeader = ({
  moves,
  onNewGame,
  onShuffle,
  showShuffle,
}: GameHeaderProps) => {
  return (
    <div className="text-center mb-2">
      <div className="flex justify-center items-center gap-6 mb-4">
        <span className="text-xl font-bold text-gray-700">Moves: {moves}</span>
        <motion.button
          onClick={onNewGame}
          className="bg-blue-500 text-white cursor-pointer px-6 py-2 rounded-lg font-bold shadow-md hover:bg-blue-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          New Game
        </motion.button>
        {showShuffle && (
          <motion.button
            onClick={onShuffle}
            className="bg-purple-500 text-white cursor-pointer px-6 py-2 rounded-lg font-bold shadow-md hover:bg-purple-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Shuffle
          </motion.button>
        )}
      </div>
    </div>
  );
};
