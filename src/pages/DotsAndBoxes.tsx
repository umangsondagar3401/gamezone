import React, { useEffect, useState } from "react";
import type { RootState } from "../store/store";
import type { AppDispatch } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import GameBoard from "../components/DotsAndBoxes/GameBoard";
import Scoreboard from "../components/DotsAndBoxes/Scoreboard";
import { fadeInDown, fadeInUp } from "../animation/CommonVariants";
import GameResultModal from "../components/DotsAndBoxes/GameResultModal";
import GameOptionsPanel from "../components/DotsAndBoxes/GameOptionsPanel";
import { startGame, makeMove, startNewGame } from "../store/dotsAndBoxesSlice";

const DotsAndBoxes: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [horizontalLineOwners, setHorizontalLineOwners] = useState<
    Record<string, number>
  >({});
  const [verticalLineOwners, setVerticalLineOwners] = useState<
    Record<string, number>
  >({});

  const {
    gridSize,
    gameMode,
    currentPlayer,
    scores,
    horizontalLines,
    verticalLines,
    boxes,
    gameStarted,
    gameOver,
    winner,
  } = useSelector((state: RootState) => state.dotsAndBoxes);

  const getPlayerColor = (player: number) => {
    return player === 1 ? "#3b82f6" : "#ef4444";
  };

  const handleStartGame = () => {
    setHorizontalLineOwners({});
    setVerticalLineOwners({});
    dispatch(startGame());
  };

  const handleLineClick = (
    type: "horizontal" | "vertical",
    row: number,
    col: number
  ) => {
    if (
      gameOver ||
      !gameStarted ||
      (gameMode === "computer" && currentPlayer === 2)
    ) {
      return;
    }

    if (type === "horizontal" && !horizontalLines[row][col]) {
      setHorizontalLineOwners((prev: Record<string, number>) => ({
        ...prev,
        [`${row}-${col}`]: currentPlayer,
      }));
      dispatch(makeMove({ type: "horizontal", row, col }));
    } else if (type === "vertical" && !verticalLines[row][col]) {
      setVerticalLineOwners((prev: Record<string, number>) => ({
        ...prev,
        [`${row}-${col}`]: currentPlayer,
      }));
      dispatch(makeMove({ type: "vertical", row, col }));
    }
  };

  // Computer move logic
  useEffect(() => {
    if (
      gameMode !== "computer" ||
      currentPlayer !== 2 ||
      gameOver ||
      !gameStarted
    )
      return;

    const timer = setTimeout(() => {
      const moves: {
        type: "horizontal" | "vertical";
        row: number;
        col: number;
      }[] = [];

      for (let i = 0; i <= gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          if (!horizontalLines[i]?.[j])
            moves.push({ type: "horizontal", row: i, col: j });
        }
      }
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j <= gridSize; j++) {
          if (!verticalLines[i]?.[j])
            moves.push({ type: "vertical", row: i, col: j });
        }
      }

      // // Simple AI: make a random valid move
      // if (moves.length > 0) {
      //   const randomMove = moves[Math.floor(Math.random() * moves.length)];
      //   if (randomMove.type === "horizontal") {
      //     setHorizontalLineOwners((prev) => ({
      //       ...prev,
      //       [randomMove.row + "-" + randomMove.col]: 2,
      //     }));
      //   } else {
      //     setVerticalLineOwners((prev) => ({
      //       ...prev,
      //       [randomMove.row + "-" + randomMove.col]: 2,
      //     }));
      //   }
      //   dispatch(makeMove(randomMove));
      // }

      // Advanced AI: make a move that completes a box or blocks the opponent
      const boxLines = (r: number, c: number) =>
        +horizontalLines[r]?.[c] +
        +horizontalLines[r + 1]?.[c] +
        +verticalLines[r]?.[c] +
        +verticalLines[r]?.[c + 1];

      const affected = (t: "horizontal" | "vertical", r: number, c: number) =>
        t === "horizontal"
          ? [
              [r - 1, c],
              [r, c],
            ].filter(([x]) => x >= 0 && x < gridSize)
          : [
              [r, c - 1],
              [r, c],
            ].filter(([, y]) => y >= 0 && y < gridSize);

      const moveCompletesBox = moves.find(({ type, row, col }) =>
        affected(type, row, col).some(([r, c]) => boxLines(r, c) === 3)
      );

      const safeMoves = moves.filter(({ type, row, col }) =>
        affected(type, row, col).every(([r, c]) => boxLines(r, c) !== 2)
      );

      const move =
        moveCompletesBox ??
        (safeMoves.length
          ? safeMoves[Math.floor(Math.random() * safeMoves.length)]
          : moves[Math.floor(Math.random() * moves.length)]);

      if (move) {
        const key = `${move.row}-${move.col}`;
        (move.type === "horizontal"
          ? setHorizontalLineOwners
          : setVerticalLineOwners)((prev) => ({ ...prev, [key]: 2 }));
        dispatch(makeMove(move));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [
    currentPlayer,
    gameMode,
    gameOver,
    gameStarted,
    gridSize,
    horizontalLines,
    verticalLines,
    dispatch,
  ]);

  // Reset line owners when game starts or grid size changes
  useEffect(() => {
    if (gameStarted) {
      setHorizontalLineOwners({});
      setVerticalLineOwners({});
    }
  }, [gameStarted, gridSize]);

  const renderGameBoard = () => (
    <>
      <Scoreboard
        scores={scores}
        currentPlayer={currentPlayer}
        gameMode={gameMode}
        gameOver={gameOver}
        winner={winner}
      />

      <div className="mb-8">
        <GameBoard
          gridSize={gridSize}
          horizontalLines={horizontalLines}
          verticalLines={verticalLines}
          boxes={boxes}
          currentPlayer={currentPlayer}
          horizontalLineOwners={horizontalLineOwners}
          verticalLineOwners={verticalLineOwners}
          onLineClick={handleLineClick}
          getPlayerColor={getPlayerColor}
        />
      </div>

      <div className="flex justify-center items-center flex-wrap gap-x-5 gap-y-2">
        <motion.button
          variants={fadeInUp}
          initial="hidden"
          animate="show"
          onClick={() => dispatch(startGame())}
          className="px-6 py-2 bg-purple-500 text-white rounded-lg font-medium cursor-pointer min-w-[150px]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Reset Game
        </motion.button>
        <motion.button
          variants={fadeInUp}
          initial="hidden"
          animate="show"
          custom={0.3}
          onClick={() => dispatch(startNewGame())}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium cursor-pointer min-w-[150px]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          New Game
        </motion.button>
      </div>
    </>
  );

  return (
    <div className="flex flex-col items-center justify-center">
      <motion.h1
        className="text-4xl sm:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        variants={fadeInDown}
        initial="hidden"
        animate="show"
        custom={0.1}
      >
        Dots and Boxes
      </motion.h1>

      <AnimatePresence mode="wait">
        {!gameStarted ? (
          <GameOptionsPanel handleStartGame={handleStartGame} />
        ) : (
          renderGameBoard()
        )}
      </AnimatePresence>

      {/* Game over modal */}
      <AnimatePresence>{gameOver && <GameResultModal />}</AnimatePresence>
    </div>
  );
};

export default DotsAndBoxes;
