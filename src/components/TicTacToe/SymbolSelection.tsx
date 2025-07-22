import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import type { Player } from "../../types/tictactoe";
import { setGameMode, setPlayerSymbol } from "../../store/tictactoeSlice";

const SymbolSelection = ({
  setShowSymbolSelection,
}: {
  setShowSymbolSelection: (value: boolean) => void;
}) => {
  const dispatch = useDispatch();

  const handleSymbolSelect = (symbol: Player) => {
    if (!symbol) return;
    dispatch(setPlayerSymbol(symbol));
    setShowSymbolSelection(false);
  };

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold mb-1">Choose Your Symbol</h2>
      <p className="text-gray-500 mb-6 text-sm">Remember : X goes first</p>

      <div className="flex gap-6 justify-center mb-8">
        <motion.button
          className="px-8 py-4 bg-blue-500 text-white rounded-lg font-bold text-2xl cursor-pointer w-24"
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSymbolSelect("X")}
        >
          X
        </motion.button>
        <motion.button
          className="px-8 py-4 bg-red-500 text-white rounded-lg font-bold text-2xl cursor-pointer w-24"
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 15px rgba(239, 68, 68, 0.5)",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSymbolSelect("O")}
        >
          O
        </motion.button>
      </div>
      <motion.button
        className="px-4 py-2 text-gray-600 hover:text-gray-800"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setShowSymbolSelection(false);
          dispatch(setGameMode(null));
        }}
      >
        ← Back to Game Modes
      </motion.button>
    </motion.div>
  );
};

export default SymbolSelection;
