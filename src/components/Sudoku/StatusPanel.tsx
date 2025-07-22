import { motion } from "framer-motion";
import { HiMiniPlay } from "react-icons/hi2";
import { HiMiniPause } from "react-icons/hi2";
import type { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { togglePause } from "../../store/sudokuSlice";
import { useDispatch } from "react-redux";
import { fadeInUp } from "../../animation/CommonVariants";

interface StatusPanelProps {
  formatTime: (time: number) => string;
}

const StatusPanel = ({ formatTime }: StatusPanelProps) => {
  const dispatch = useDispatch();
  const { timer, mistakes, isGameStarted, isPaused } = useSelector(
    (state: RootState) => state.sudoku
  );

  return (
    <div className="flex items-center space-x-3">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="show"
        className="bg-white px-4 py-2 rounded-lg shadow"
      >
        <div className="text-sm text-gray-500 text-center">Time</div>
        <div className="font-mono font-bold text-center">
          {formatTime(timer)}
        </div>
      </motion.div>

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="show"
        custom={0.3}
        className="bg-white px-4 py-2 rounded-lg shadow"
      >
        <div className="text-sm text-gray-500 text-center">Mistakes</div>
        <div className="font-bold text-red-500 text-center">{mistakes}/3</div>
      </motion.div>

      {isGameStarted && (
        <motion.button
          variants={fadeInUp}
          initial="hidden"
          animate="show"
          custom={0.4}
          onClick={() => dispatch(togglePause())}
          className="bg-indigo-100 p-2 rounded-lg shadow hover:bg-indigo-200 transition-colors cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={isPaused ? "Resume" : "Pause"}
        >
          {isPaused ? (
            <HiMiniPlay className="w-5 h-5 text-indigo-700" />
          ) : (
            <HiMiniPause className="w-5 h-5 text-indigo-700" />
          )}
        </motion.button>
      )}
    </div>
  );
};

export default StatusPanel;
