import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useDispatch } from "react-redux";
import { resetGame, setCellValue } from "../../store/sudokuSlice";
import { motion } from "framer-motion";
import { fadeInUp } from "../../animation/CommonVariants";

const Controls = () => {
  const { selectedCell, isGameStarted, isGameWon, isGameOver } = useSelector(
    (state: RootState) => state.sudoku
  );

  const dispatch = useDispatch();

  // Count how many times each number appears correctly on the board
  const numberCounts = useSelector((state: RootState) => {
    const counts: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
    };
    state.sudoku.board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (
          cell.value &&
          cell.value === state.sudoku.solution[rowIndex][colIndex]
        ) {
          counts[cell.value]++;
        }
      });
    });
    return counts;
  });

  const handleErase = () => {
    if (!selectedCell || !isGameStarted || isGameWon || isGameOver) return;
    dispatch(setCellValue(null));
  };

  const handleNumberClick = (number: number) => {
    if (!selectedCell || !isGameStarted || isGameWon || isGameOver) return;
    dispatch(setCellValue(number));
  };

  // Disable number pad if game is over or not started
  const isNumberPadDisabled = !isGameStarted || isGameWon || isGameOver;

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg w-full max-w-md md:max-w-64">
      <div className="flex justify-between gap-2 items-center mb-4">
        <div className="flex space-x-3">
          <motion.button
            variants={fadeInUp}
            initial="hidden"
            animate="show"
            onClick={handleErase}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Erase
          </motion.button>
        </div>
        <motion.button
          variants={fadeInUp}
          initial="hidden"
          animate="show"
          custom={0.3}
          onClick={() => dispatch(resetGame())}
          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors cursor-pointer"
        >
          New Game
        </motion.button>
      </div>

      {/* Number pad */}
      <div className="grid grid-cols-9 md:grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <motion.button
            variants={fadeInUp}
            initial="hidden"
            animate="show"
            key={num}
            onClick={() => handleNumberClick(num)}
            disabled={isNumberPadDisabled || numberCounts[num] >= 9}
            className={`
                      aspect-square h-full flex items-center justify-center rounded-lg font-bold text-xl cursor-pointer
                      ${
                        isNumberPadDisabled || numberCounts[num] >= 9
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                      }
                      transition-colors`}
          >
            {num}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Controls;
