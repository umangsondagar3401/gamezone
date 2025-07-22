import React, { useState } from "react";
import { motion } from "framer-motion";
import type { RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import type { Choice } from "../types/rockpaperscissors";
import { resetGame } from "../store/rockpaperscissorsSlice";
import MoveSelection from "../components/RockPaperScissors/MoveSelection";
import { fadeInDown, fadeInUp } from "../animation/CommonVariants";

// Icons for choices
const ChoiceIcons: Record<Choice | "thinking", string> = {
  rock: "✊",
  paper: "✋",
  scissors: "✌️",
  thinking: "🤔",
};

// Game choices
const choices: Choice[] = ["rock", "paper", "scissors"];

const RockPaperScissors: React.FC = () => {
  const dispatch = useDispatch();
  const [showResult, setShowResult] = useState(false);
  const [showChoices, setShowChoices] = useState(true);

  const { playerChoice, computerChoice, playerScore, computerScore, result } =
    useSelector((state: RootState) => state.rockPaperScissors);

  const handlePlayAgain = () => {
    setShowChoices(true);
    setShowResult(false);
    dispatch(resetGame());
  };

  const renderGameResult = () => {
    if (!showResult || !playerChoice || !computerChoice) return null;

    return (
      <div className="text-center">
        <div className="flex justify-between items-start gap-3 mb-8 max-w-md mx-auto">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">You</h3>
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white shadow-md flex items-center justify-center text-5xl sm:text-6xl mx-auto">
              {ChoiceIcons[playerChoice]}
            </div>
          </div>

          <div className="text-xl sm:text-2xl font-bold">
            {result === "You Win!"
              ? "😊"
              : result === "Computer Wins!"
              ? "😢"
              : "🤝"}
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Computer</h3>
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white shadow-md flex items-center justify-center text-5xl sm:text-6xl mx-auto">
              {ChoiceIcons[computerChoice]}
            </div>
          </div>
        </div>

        <motion.h2
          className={`text-3xl font-bold mb-6 ${
            result === "You Win!"
              ? "text-green-600"
              : result === "Computer Wins!"
              ? "text-red-600"
              : "text-yellow-600"
          }`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {result}
        </motion.h2>

        <motion.button
          onClick={handlePlayAgain}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all cursor-pointer"
        >
          Play Again
        </motion.button>
      </div>
    );
  };

  const renderComputerThinking = () => (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">🤔</div>
      <p className="text-xl font-medium text-gray-600">
        Computer is thinking...
      </p>
    </div>
  );

  return (
    <>
      <motion.h1
        className="text-4xl sm:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        variants={fadeInDown}
        initial="hidden"
        animate="show"
        custom={0.1}
      >
        Rock Paper Scissors
      </motion.h1>
      <motion.div
        className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20"
        variants={fadeInUp}
        initial="hidden"
        animate="show"
        custom={0.5}
      >
        {/* Score Board */}
        <div className="flex justify-between max-w-xs mx-auto mb-8 bg-white/50 rounded-xl">
          <div className="text-center">
            <h3 className="text-xl font-semibold">You</h3>
            <div className="text-3xl font-bold text-blue-600">
              {playerScore}
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold">Computer</h3>
            <div className="text-3xl font-bold text-red-600">
              {computerScore}
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="min-h-64 flex items-center justify-center my-8">
          {showChoices ? (
            <MoveSelection
              choices={choices}
              choicesIcons={ChoiceIcons}
              setShowResult={setShowResult}
              setShowChoices={setShowChoices}
            />
          ) : showResult ? (
            renderGameResult()
          ) : (
            renderComputerThinking()
          )}
        </div>
      </motion.div>
    </>
  );
};

export default RockPaperScissors;
