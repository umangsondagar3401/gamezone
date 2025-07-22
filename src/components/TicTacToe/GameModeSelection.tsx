import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import type { GameMode } from "../../types/tictactoe";
import FriendIcon from "../../assets/icons/FriendIcon";
import ComputerIcon from "../../assets/icons/ComputerIcon";
import { resetGame, setGameMode } from "../../store/tictactoeSlice";
import { fadeInUp } from "../../animation/CommonVariants";

const GameModeSelection = ({
  setShowSymbolSelection,
}: {
  setShowSymbolSelection: (value: boolean) => void;
}) => {
  const dispatch = useDispatch();

  const selectGameMode = (mode: GameMode) => {
    dispatch(setGameMode(mode));
    dispatch(resetGame());
    setShowSymbolSelection(mode === "computer");
  };

  return (
    <motion.div
      className="text-center"
      variants={fadeInUp}
      initial="hidden"
      animate="show"
      exit="hidden"
      custom={0.2}
    >
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Select Game Mode
      </h2>
      <div className="flex flex-col gap-4 justify-center">
        <motion.button
          className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium text-lg cursor-pointer shadow-lg hover:shadow-xl transition-all"
          variants={fadeInUp}
          initial="hidden"
          animate="show"
          custom={0.2}
          whileHover={{
            scale: 1.05,
            y: -5,
            boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)",
          }}
          whileTap={{ scale: 0.98 }}
          onClick={() => selectGameMode("computer")}
        >
          <ComputerIcon width={24} height={24} />
          Player vs Computer
        </motion.button>
        <motion.button
          className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium text-lg cursor-pointer shadow-lg hover:shadow-xl transition-all"
          variants={fadeInUp}
          initial="hidden"
          animate="show"
          custom={0.3}
          whileHover={{
            scale: 1.05,
            y: -5,
            boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.4)",
          }}
          whileTap={{ scale: 0.98 }}
          onClick={() => selectGameMode("friend")}
        >
          <FriendIcon width={24} height={24} />
          Play with Friend
        </motion.button>
      </div>
    </motion.div>
  );
};

export default GameModeSelection;
