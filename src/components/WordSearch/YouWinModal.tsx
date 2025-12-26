import React from "react";
import Modal from "../Common/Modal";
import { motion } from "framer-motion";
import ConfettiCannon from "../Common/ConfettiCannon";
import { fadeInDown, fadeInUp } from "../../animation/CommonVariants";

interface YouWinModalProps {
  open: boolean;
  onNewGame: () => void;
  onPlayAgain: () => void;
  timeTaken: number;
}

const YouWinModal: React.FC<YouWinModalProps> = ({
  open,
  timeTaken,
  onNewGame,
  onPlayAgain,
}) => {
  if (!open) return null;
  return (
    <Modal>
      <ConfettiCannon trigger={true} />
      <motion.h2
        variants={fadeInDown}
        initial="hidden"
        animate="show"
        custom={0.1}
        className="text-2xl font-bold text-center mb-4"
      >
        🎉 You Win!
      </motion.h2>
      <p className="mb-2 text-center">
        Time Taken:{" "}
        <span className="font-mono">
          {Math.floor(timeTaken / 60)}:
          {(timeTaken % 60).toString().padStart(2, "0")}
        </span>
      </p>
      <div className="flex flex-col gap-3 mt-3">
        <motion.button
          variants={fadeInUp}
          initial="hidden"
          animate="show"
          custom={0.2}
          onClick={onPlayAgain}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
        >
          Play Again
        </motion.button>
        <motion.button
          variants={fadeInUp}
          initial="hidden"
          animate="show"
          custom={0.3}
          onClick={onNewGame}
          className="w-full bg-white text-gray-700 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          New Game
        </motion.button>
      </div>
    </Modal>
  );
};

export default YouWinModal;
