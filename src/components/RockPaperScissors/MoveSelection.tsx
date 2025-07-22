import React from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import type { Choice, MoveSelectionProps } from "../../types/rockpaperscissors";
import { makeChoice } from "../../store/rockpaperscissorsSlice";

const MoveSelection: React.FC<MoveSelectionProps> = ({
  choices,
  choicesIcons,
  setShowChoices,
  setShowResult,
}) => {
  const dispatch = useDispatch();

  const handleChoice = (choice: Choice) => {
    setShowChoices(false);
    setShowResult(false);

    // Show result after a delay
    setTimeout(() => {
      setShowResult(true);
      dispatch(makeChoice(choice));
    }, 1000);
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-8 text-gray-800">
        Choose your move
      </h2>
      <div className="flex justify-center flex-wrap gap-6 mb-8">
        {choices.map((choice) => (
          <motion.button
            key={choice}
            onClick={() => handleChoice(choice)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center text-5xl hover:shadow-xl transition-all cursor-pointer"
          >
            {choicesIcons[choice]}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default MoveSelection;
