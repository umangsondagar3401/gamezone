import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import type { Cell } from "../types/sudoku";
import type { RootState } from "../store/store";
import Controls from "../components/Sudoku/Controls";
import { AnimatePresence, motion } from "framer-motion";
import { HiMiniPlay } from "react-icons/hi2";
import StatusPanel from "../components/Sudoku/StatusPanel";
import GameWinModal from "../components/Sudoku/GameWinModal";
import GameOverModal from "../components/Sudoku/GameOverModal";
import DifficultySelection from "../components/Sudoku/DifficultySelection";
import {
  selectCell,
  setCellValue,
  incrementTimer,
  togglePause,
} from "../store/sudokuSlice";
import { fadeInDown } from "../animation/CommonVariants";

const Sudoku = () => {
  const dispatch = useDispatch();
  const {
    board,
    isGameWon,
    difficulty,
    isGameOver,
    selectedCell,
    isGameStarted,
    isPaused,
  } = useSelector((state: RootState) => state.sudoku);

  // Get the selected cell's value to highlight matching cells
  const selectedValue = selectedCell
    ? board[selectedCell.row][selectedCell.col].value
    : null;

  // Timer effect
  useEffect(() => {
    if (!isGameStarted || isGameWon || isGameOver || isPaused) return;

    const timerId = setInterval(() => {
      dispatch(incrementTimer());
    }, 1000);

    return () => clearInterval(timerId);
  }, [dispatch, isGameStarted, isGameWon, isGameOver, isPaused]);

  // Handle keyboard input
  useEffect(() => {
    if (!isGameStarted || isGameWon || isGameOver) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCell) return;

      const { key } = e;

      // Number keys 1-9
      if (/^[1-9]$/.test(key)) {
        dispatch(setCellValue(parseInt(key, 10)));
        return;
      }

      // Delete or Backspace
      if (key === "Delete" || key === "Backspace") {
        dispatch(setCellValue(null));
        return;
      }

      // Arrow keys for navigation
      if (selectedCell) {
        const { row, col } = selectedCell;
        let newRow = row;
        let newCol = col;

        switch (key) {
          case "ArrowUp":
            newRow = Math.max(0, row - 1);
            break;
          case "ArrowDown":
            newRow = Math.min(8, row + 1);
            break;
          case "ArrowLeft":
            newCol = Math.max(0, col - 1);
            break;
          case "ArrowRight":
            newCol = Math.min(8, col + 1);
            break;
          default:
            return;
        }

        if (newRow !== row || newCol !== col) {
          dispatch(selectCell({ row: newRow, col: newCol }));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch, selectedCell, isGameStarted, isGameWon, isGameOver]);

  const handleCellClick = (row: number, col: number) => {
    if (!isGameStarted || isGameWon || isGameOver) return;
    dispatch(selectCell({ row, col }));
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const renderGameBoard = () => (
    <>
      <div className="flex flex-col gap-6 w-full max-w-4xl md:flex-row justify-center items-center">
        {/* Game board */}
        <div className="bg-white rounded-xl shadow-lg w-full max-w-lg relative">
          {/* Pause overlay */}
          {isPaused && (
            <div className="absolute inset-0 bg-black/50 rounded-xl z-10 flex items-center justify-center">
              <motion.button
                onClick={() => dispatch(togglePause())}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 shadow-lg hover:bg-indigo-700 transition-colors cursor-pointer"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <HiMiniPlay className="w-5 h-5" />
                Resume Game
              </motion.button>
            </div>
          )}

          <div className="grid grid-cols-9 gap-0.5 bg-gray-300">
            {board.map((row: Cell[], rowIndex: number) =>
              row.map((cell: Cell, colIndex: number) => {
                const isSelected =
                  selectedCell?.row === rowIndex &&
                  selectedCell?.col === colIndex;
                const isSameValue =
                  cell.value !== 0 && selectedValue === cell.value;
                const cellKey = `${rowIndex}-${colIndex}`;

                return (
                  <div
                    key={cellKey}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    className={`
                      aspect-square h-full flex items-center justify-center relative
                      ${
                        rowIndex % 3 === 2 && rowIndex < 8
                          ? "border-b-2 border-gray-800"
                          : ""
                      }
                      ${
                        colIndex % 3 === 2 && colIndex < 8
                          ? "border-r-2 border-gray-800"
                          : ""
                      }
                      ${
                        isSelected && !isPaused
                          ? "bg-indigo-100"
                          : isSameValue && !isPaused
                          ? "bg-indigo-50"
                          : cell.isHighlighted && !isPaused
                          ? "bg-gray-100"
                          : "bg-white"
                      }
                      ${
                        cell.isInvalid && !isPaused
                          ? "text-red-500"
                          : isSameValue && !isSelected && !isPaused
                          ? "text-indigo-600 font-semibold"
                          : cell.isGiven && !isPaused
                          ? "text-gray-900 font-bold"
                          : !isPaused
                          ? "text-indigo-700"
                          : "text-transparent"
                      }
                      ${cell.isInvalid && !isPaused ? "bg-red-50" : ""}
                      ${isPaused ? "cursor-default" : "cursor-pointer"}
                      transition-colors duration-150
                    `}
                  >
                    {cell.value !== 0 && (
                      <span className="text-xl font-medium">
                        {isPaused && !cell.isGiven ? "" : cell.value || ""}
                      </span>
                    )}
                    {isSelected && !isPaused && (
                      <div className="absolute inset-0 border-2 border-indigo-400 pointer-events-none" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="w-full max-w-md md:max-w-64">
          <div className="hidden md:flex items-center space-x-4 justify-center mb-6">
            <StatusPanel formatTime={formatTime} />
          </div>

          <Controls />
        </div>
      </div>
    </>
  );

  // Main game screen
  return (
    <div className="flex flex-col items-center justify-center">
      <div>
        <motion.h1
          className="text-4xl sm:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          variants={fadeInDown}
          initial="hidden"
          animate="show"
          custom={0.1}
        >
          Sudoku
        </motion.h1>

        {isGameStarted && (
          <div className="flex md:hidden items-center space-x-4 justify-center mb-6">
            <StatusPanel formatTime={formatTime} />
          </div>
        )}
      </div>

      <AnimatePresence>
        {!isGameStarted ? <DifficultySelection /> : renderGameBoard()}
      </AnimatePresence>

      <AnimatePresence>
        {isGameOver && <GameOverModal difficulty={difficulty} />}
      </AnimatePresence>

      <AnimatePresence>
        {isGameWon && <GameWinModal formatTime={formatTime} />}
      </AnimatePresence>
    </div>
  );
};

export default Sudoku;
