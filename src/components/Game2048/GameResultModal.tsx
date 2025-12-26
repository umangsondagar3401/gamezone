import Modal from "../Common/Modal";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import ConfettiCannon from "../Common/ConfettiCannon";
import { startNewGame } from "../../store/game2048Slice";
import { fadeInDown, fadeInUp } from "../../animation/CommonVariants";

const GameResultModal = () => {
  const dispatch = useDispatch();
  const { won, score } = useSelector((state: RootState) => state.game2048);

  return (
    <Modal>
      <ConfettiCannon trigger={won} />
      <motion.h2
        variants={fadeInDown}
        initial="hidden"
        animate="show"
        custom={0.1}
        className="text-2xl font-bold text-center mb-4"
      >
        {won ? "🎉 You Win!" : "Game Over!"}
      </motion.h2>
      <p className="mb-2 text-center">
        Score: <span className="font-mono">{score}</span>
      </p>
      <div className="flex flex-col gap-3 mt-3">
        <motion.button
          variants={fadeInUp}
          initial="hidden"
          animate="show"
          custom={0.2}
          onClick={() => dispatch(startNewGame())}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
        >
          Play Again
        </motion.button>
      </div>
    </Modal>
  );
};

export default GameResultModal;
