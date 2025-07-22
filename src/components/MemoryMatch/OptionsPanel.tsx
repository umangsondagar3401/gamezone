import {
  setTheme,
  startGame,
  setPlayers,
  setGridSize,
} from "../../store/memorymatchSlice";
import {
  titleVariants,
  buttonVariants,
  startBtnVariants,
  containerVariants,
} from "../../animation/CommonVariants";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import type { RootState } from "../../store/store";

const OptionsPanel = () => {
  const dispatch = useDispatch();
  const { gridSize, theme, players } = useSelector(
    (state: RootState) => state.memoryMatch
  );
  const handleStartGame = () => {
    dispatch(startGame());
  };
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
          Grid Size
        </motion.h2>
        <div className="flex flex-wrap gap-3">
          {([4, 6] as const).map((size: 4 | 6) => (
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
              className={`flex-1 min-w-[80px] py-2 px-1 rounded-lg border-2 transition-colors duration-500 cursor-pointer`}
              style={{
                boxShadow:
                  gridSize === size ? "0 6px 24px 0 #6366f144" : undefined,
              }}
            >
              {size}×{size} ({size === 4 ? "8" : "18"} Pairs)
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <motion.h2
          variants={titleVariants}
          className="text-lg font-medium mb-3"
        >
          Theme
        </motion.h2>
        <div className="flex flex-wrap gap-3">
          {["numbers", "animals", "fruits"].map((themeOption) => (
            <motion.button
              key={themeOption}
              whileTap="tap"
              initial="hidden"
              whileHover="hover"
              variants={buttonVariants}
              onClick={() =>
                dispatch(
                  setTheme(themeOption as "numbers" | "animals" | "fruits")
                )
              }
              animate={
                theme === themeOption
                  ? ["visible", "selected"]
                  : ["visible", "unselected"]
              }
              className={`flex-1 min-w-[80px] py-2 px-1 rounded-lg border-2 transition-colors duration-500 cursor-pointer`}
              style={{
                boxShadow:
                  theme === themeOption ? "0 6px 24px 0 #6366f144" : undefined,
              }}
            >
              {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <motion.h2
          variants={titleVariants}
          className="text-lg font-medium mb-3"
        >
          Number of Players
        </motion.h2>
        <div className="flex flex-wrap gap-3">
          {[2, 3].map((num) => (
            <motion.button
              key={num}
              whileTap="tap"
              initial="hidden"
              whileHover="hover"
              variants={buttonVariants}
              onClick={() => dispatch(setPlayers(num))}
              animate={
                players.length === num
                  ? ["visible", "selected"]
                  : ["visible", "unselected"]
              }
              className={`flex-1 min-w-[80px] py-2 px-1 rounded-lg border-2 transition-colors duration-500 cursor-pointer`}
              style={{
                boxShadow:
                  players.length === num ? "0 6px 24px 0 #6366f144" : undefined,
              }}
            >
              {num} Players
            </motion.button>
          ))}
        </div>
      </div>

      <motion.button
        whileTap="tap"
        initial="hidden"
        animate="visible"
        whileHover="hover"
        disabled={!gridSize || !theme || players.length === 0}
        variants={startBtnVariants}
        onClick={handleStartGame}
        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium text-lg hover:bg-indigo-700 transition-colors cursor-pointer shadow-md"
      >
        Start Game
      </motion.button>
    </motion.div>
  );
};
export default OptionsPanel;
