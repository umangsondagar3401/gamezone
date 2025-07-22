import React from "react";

interface NewGameButtonProps {
  onClick: () => void;
}

const NewGameButton: React.FC<NewGameButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md"
    aria-label="Start a new game"
  >
    New Game
  </button>
);

export default React.memo(NewGameButton);
