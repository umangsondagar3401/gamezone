import {
  titleVariants,
  buttonVariants,
  startBtnVariants,
  containerVariants,
} from "../../animation/CommonVariants";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { setGameMode, setGridSize } from "../../store/dotsAndBoxesSlice";

type GameOptionsPanelProps = {
  handleStartGame: () => void;
};

const GameOptionsPanel = ({ handleStartGame }: GameOptionsPanelProps) => {
  const dispatch = useDispatch();
  const { gridSize, gameMode } = useSelector(
    (state: RootState) => state.dotsAndBoxes
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
          Grid Size
        </motion.h2>
        <div className="flex flex-wrap gap-3">
          {([3, 4, 5, 6, 9] as const).map((size) => (
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

      <div>
        <motion.h2
          variants={titleVariants}
          className="text-lg font-medium mb-3"
        >
          Game Mode
        </motion.h2>
        <div className="flex flex-col flex-wrap gap-3">
          {(["friend", "computer"] as const).map((type) => (
            <motion.button
              key={type}
              whileTap="tap"
              initial="hidden"
              whileHover="hover"
              variants={buttonVariants}
              onClick={() => dispatch(setGameMode(type))}
              animate={
                gameMode === type
                  ? ["visible", "selected"]
                  : ["visible", "unselected"]
              }
              className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors cursor-pointer`}
              style={{
                boxShadow:
                  gameMode === type ? "var(--shadow-strong-indigo)" : undefined,
              }}
            >
              <span>Play with {type}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <motion.button
        whileTap="tap"
        initial="hidden"
        animate="visible"
        whileHover="hover"
        disabled={!gridSize || !gameMode}
        variants={startBtnVariants}
        onClick={() => handleStartGame()}
        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium text-lg hover:bg-indigo-700 transition-colors cursor-pointer shadow-md"
      >
        Start Game
      </motion.button>
    </motion.div>
  );
};

export default GameOptionsPanel;
