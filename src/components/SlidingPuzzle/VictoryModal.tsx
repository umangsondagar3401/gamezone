import ConfettiCannon from "../Common/ConfettiCannon";
import { motion, AnimatePresence } from "framer-motion";
import type { VictoryModalProps } from "../../types/puzzletile";

export const VictoryModal = ({
  isOpen,
  moves,
  onNewGame,
}: VictoryModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            onClick={onNewGame}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 z-40"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 500,
                bounce: 0.5,
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-2xl p-8 w-full max-w-md mx-auto shadow-2xl"
            >
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="text-3xl font-bold text-gray-800 mb-4"
              >
                Congratulations! 🎉
              </motion.h2>

              <motion.p
                className="text-gray-600 mb-6 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                You solved the puzzle in {moves} moves!
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <button
                  onClick={onNewGame}
                  className="w-full bg-blue-500 cursor-pointer hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  New Game
                </button>
              </motion.div>

              <ConfettiCannon trigger={isOpen} />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
