import { useEffect, useCallback } from "react";
import type { Tile } from "../types/game2048";
import { useSwipeable } from "react-swipeable";
import type { RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { getFontSize, getTileColor } from "../lib/utils";
import { startNewGame, moveTiles } from "../store/game2048Slice";
import { fadeInDown, fadeInUp } from "../animation/CommonVariants";
import GameResultModal from "../components/Game2048/GameResultModal";

const Game2048 = () => {
  const dispatch = useDispatch();
  const { board, score, bestScore, gameOver, won } = useSelector(
    (state: RootState) => state.game2048
  );

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (gameOver || won) return;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          dispatch(moveTiles("up"));
          break;
        case "ArrowDown":
          e.preventDefault();
          dispatch(moveTiles("down"));
          break;
        case "ArrowLeft":
          e.preventDefault();
          dispatch(moveTiles("left"));
          break;
        case "ArrowRight":
          e.preventDefault();
          dispatch(moveTiles("right"));
          break;
        default:
          break;
      }
    },
    [dispatch, gameOver, won]
  );

  // Add keyboard event listeners
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Handle swipe gestures
  const handlers = useSwipeable({
    onSwipedUp: (e) => {
      e.event.preventDefault();
      if (!gameOver && !won) dispatch(moveTiles("up"));
    },
    onSwipedDown: (e) => {
      e.event.preventDefault();
      if (!gameOver && !won) dispatch(moveTiles("down"));
    },
    onSwipedLeft: (e) => {
      e.event.preventDefault();
      if (!gameOver && !won) dispatch(moveTiles("left"));
    },
    onSwipedRight: (e) => {
      e.event.preventDefault();
      if (!gameOver && !won) dispatch(moveTiles("right"));
    },
    onTouchStartOrOnMouseDown: (e) => {
      e.event.preventDefault();
    },
    trackMouse: false,
    preventScrollOnSwipe: true,
    touchEventOptions: { passive: false },
  });

  // Start new game on mount
  useEffect(() => {
    dispatch(startNewGame());
  }, [dispatch]);

  const getPositionOffset = (index: number) => {
    const basePercent = index * 25;
    const offsetPx = index * 2 + 1;
    return `calc(${basePercent}% + ${offsetPx}px)`;
  };

  return (
    <div>
      <div className="max-w-xl mx-auto">
        <motion.h1
          className="text-4xl sm:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          variants={fadeInDown}
          initial="hidden"
          animate="show"
          custom={0.1}
        >
          2048
        </motion.h1>

        <div className="flex justify-center items-center gap-4 mb-6">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="show"
            className="bg-white px-4 py-2 rounded-lg shadow"
          >
            <div className="text-sm text-gray-500 text-center">Score</div>
            <div className="font-mono font-bold text-center">{score}</div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="show"
            custom={0.3}
            className="bg-white px-4 py-2 rounded-lg shadow"
          >
            <div className="text-sm text-gray-500 text-center">Best</div>
            <div className="font-bold text-red-500 text-center">
              {bestScore}
            </div>
          </motion.div>
        </div>

        {/* Game board */}
        <div className="relative">
          <div
            className="bg-indigo-200 p-2 rounded-lg shadow-md mb-6 w-full aspect-square max-w-md mx-auto"
            {...handlers}
          >
            <div className="relative w-full h-full select-none">
              {/* Empty grid cells */}
              <div className="grid grid-cols-4 gap-2 w-full h-full">
                {Array(16)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={`empty-${index}`}
                      className="bg-indigo-50 rounded-sm"
                    />
                  ))}
              </div>

              {/* Tiles */}
              <AnimatePresence>
                {board.flatMap((row: (Tile | null)[], rowIndex: number) =>
                  row.map((cell: Tile | null, colIndex: number) => {
                    return cell ? (
                      <motion.div
                        key={cell.id}
                        className={`absolute flex items-center justify-center rounded-sm font-bold ${getTileColor(
                          cell.value
                        )} ${getFontSize(cell.value)}`}
                        style={{
                          width: "calc(25% - 8px)",
                          height: "calc(25% - 8px)",
                          //   left: `calc(${colIndex * 25}% + 4px)`,
                          //   top: `calc(${rowIndex * 25}% + 4px)`,
                          left: getPositionOffset(colIndex),
                          top: getPositionOffset(rowIndex),

                          transform: "translate(0, 0)",
                        }}
                        initial={cell.isNew ? { scale: 0 } : false}
                        animate={{
                          scale: 1,
                          transition: { duration: 0.15 },
                        }}
                        exit={{ scale: 0 }}
                      >
                        {cell.value}
                      </motion.div>
                    ) : null;
                  })
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center gap-4">
            <motion.button
              variants={fadeInUp}
              initial="hidden"
              animate="show"
              custom={0.2}
              onClick={() => dispatch(startNewGame())}
              className="w-full max-w-3xs bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Play Again
            </motion.button>
          </div>
        </div>

        {/* Game instructions */}
        <div className="mt-8 text-sm text-gray-600">
          <p className="mb-2">
            <strong>How to play:</strong> Use ◀️ ▶️ 🔼 🔽 or swipe to move the
            tiles. When two tiles with the same number touch, they merge into
            one!
          </p>
          <p>
            <strong>Goal:</strong> Reach the 2048 tile!
          </p>
        </div>

        {/* Game over overlay */}
        <AnimatePresence>
          {(gameOver || won) && <GameResultModal />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Game2048;
