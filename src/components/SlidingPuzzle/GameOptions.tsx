import {
  startGame,
  setGridSize,
  setPuzzleType,
} from "../../store/slidingPuzzleSlice";
import {
  buttonVariants,
  containerVariants,
  startBtnVariants,
  titleVariants,
} from "../../animation/CommonVariants";
import { motion } from "framer-motion";
import type { RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";

const GameOptions = () => {
  const dispatch = useDispatch();
  const { puzzleType, gridSize } = useSelector(
    (state: RootState) => state.slidingPuzzle
  );

  return (
    <motion.div
      className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div>
        <motion.h2
          variants={titleVariants}
          className="text-lg font-medium mb-3"
        >
          Puzzle Type
        </motion.h2>
        <div className="flex flex-wrap gap-3">
          {(["number", "image"] as const).map((type) => (
            <motion.button
              key={type}
              whileTap="tap"
              initial="hidden"
              whileHover="hover"
              variants={buttonVariants}
              onClick={() => dispatch(setPuzzleType(type))}
              animate={
                puzzleType === type
                  ? ["visible", "selected"]
                  : ["visible", "unselected"]
              }
              className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors cursor-pointer`}
              style={{
                boxShadow:
                  puzzleType === type ? "var(--shadow-strong-indigo)" : undefined,
              }}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <motion.h2
          variants={titleVariants}
          className="text-lg font-medium mb-3"
        >
          Grid Size
        </motion.h2>
        <div className="flex flex-wrap gap-3">
          {([3, 4] as const).map((size) => (
            <motion.button
              key={size}
              whileTap="tap"
              initial="hidden"
              whileHover="hover"
              variants={buttonVariants}
              onClick={() => dispatch(setGridSize(size))}
              animate={
                gridSize === size
                  ? ["visible", "selected"]
                  : ["visible", "unselected"]
              }
              className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors cursor-pointer`}
              style={{
                boxShadow:
                  gridSize === size ? "var(--shadow-strong-indigo)" : undefined,
              }}
            >
              {size}x{size}
            </motion.button>
          ))}
        </div>
      </div>

      <motion.button
        whileTap="tap"
        initial="hidden"
        animate="visible"
        whileHover="hover"
        disabled={!gridSize || !puzzleType}
        variants={startBtnVariants}
        onClick={() => dispatch(startGame())}
        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium text-lg hover:bg-indigo-700 transition-colors cursor-pointer shadow-md"
      >
        Start Game
      </motion.button>
    </motion.div>
  );
};

export default GameOptions;
