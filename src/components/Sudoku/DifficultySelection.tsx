import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { selectDifficulty, startNewGame } from "../../store/sudokuSlice";
import {
  buttonVariants,
  containerVariants,
  startBtnVariants,
  titleVariants,
} from "../../animation/CommonVariants";

const DifficultySelection = () => {
  const dispatch = useDispatch();
  const { difficulty } = useSelector((state: RootState) => state.sudoku);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto"
    >
      <motion.h2 variants={titleVariants} className="text-lg font-medium mb-3">
        Difficulty
      </motion.h2>
      <div className="flex flex-wrap gap-3 mb-6">
        {(["easy", "medium", "hard"] as const).map((diff) => (
          <motion.button
            key={diff}
            whileTap="tap"
            initial="hidden"
            whileHover="hover"
            variants={buttonVariants}
            onClick={() => dispatch(selectDifficulty(diff))}
            animate={
              difficulty === diff
                ? ["visible", "selected"]
                : ["visible", "unselected"]
            }
            className={`flex-1 min-w-[80px] py-2 px-1 rounded-lg border-2 transition-colors duration-500 cursor-pointer`}
            style={{
              boxShadow:
                difficulty === diff ? "0 6px 24px 0 #6366f144" : undefined,
            }}
          >
            {diff.charAt(0).toUpperCase() + diff.slice(1)}
          </motion.button>
        ))}
      </div>
      <motion.button
        whileTap="tap"
        initial="hidden"
        animate="visible"
        whileHover="hover"
        disabled={!difficulty}
        variants={startBtnVariants}
        onClick={() => dispatch(startNewGame(difficulty))}
        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium text-lg hover:bg-indigo-700 transition-colors cursor-pointer shadow-md"
      >
        Start Game
      </motion.button>
    </motion.div>
  );
};

export default DifficultySelection;
