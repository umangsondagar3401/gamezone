import React, { useMemo, useCallback, useState } from "react";
import {
  setLevel,
  resetLevel,
  selectDifficulty,
} from "../store/wordSearchSlice";
import { motion } from "framer-motion";
import { getGridSize } from "../lib/wordSearchUtils";
import { useDispatch, useSelector } from "react-redux";
import LevelSelection from "../components/WordSearch/LevelSelection";
import WordSearchBoard from "../components/WordSearch/WordSearchBoard";

const WordSearchPage: React.FC = () => {
  const dispatch = useDispatch();
  const difficulty = useSelector(selectDifficulty);

  const [resetKey, setResetKey] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);

  const handleLevelSelect = useCallback(
    (lvl: "easy" | "medium" | "hard") => {
      dispatch(setLevel(lvl));
    },
    [dispatch]
  );

  const handleReset = useCallback(() => setResetKey((k) => k + 1), []);

  const handleNewGame = useCallback(() => {
    setResetKey((k) => k + 1);
    dispatch(setLevel("medium"));
    dispatch(resetLevel());
    setIsGameStarted(false);
  }, [dispatch]);

  const handleStartGame = useCallback(() => {
    setIsGameStarted(true);
    setResetKey((k) => k + 1);
  }, []);

  const gridSize = useMemo(() => getGridSize(difficulty), [difficulty]);

  return (
    <div className="max-w-4xl mx-auto">
      <motion.h1
        transition={{ delay: 0.2 }}
        animate={{ y: 0, opacity: 1 }}
        initial={{ y: -50, opacity: 0 }}
        className="text-4xl sm:text-5xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent md:mb-0 mb-4"
      >
        Word Search
      </motion.h1>
      <div className="w-full md:p-8 p-1 flex flex-col items-center">
        {!isGameStarted ? (
          <LevelSelection
            onSelect={handleLevelSelect}
            handleStartGame={handleStartGame}
          />
        ) : (
          <>
            {difficulty && gridSize && !isNaN(gridSize) && (
              <WordSearchBoard
                gridSize={gridSize}
                resetKey={resetKey}
                onReset={handleReset}
                onNewGame={handleNewGame}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WordSearchPage;
