import { useEffect, useState } from "react";
import {
  makeMove,
  resetGame,
  setGameMode,
  computerMove,
} from "../store/tictactoeSlice";
import type { RootState } from "../store/store";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { ticTacToeWinningCombinations } from "../lib/utils";
import ConfettiCannon from "../components/Common/ConfettiCannon";
import SymbolSelection from "../components/TicTacToe/SymbolSelection";
import GameModeSelection from "../components/TicTacToe/GameModeSelection";
import { fadeInDown } from "../animation/CommonVariants";

const TicTacToe = () => {
  const dispatch = useDispatch();
  const {
    board,
    winner,
    scores,
    gameMode,
    gameOver,
    playerSymbol,
    currentPlayer,
  } = useSelector((state: RootState) => state.tictactoe);
  const [showSymbolSelection, setShowSymbolSelection] = useState(false);

  // Handle computer's move
  useEffect(() => {
    if (
      gameMode === "computer" &&
      playerSymbol &&
      currentPlayer !== playerSymbol &&
      !gameOver
    ) {
      const timer = setTimeout(() => {
        dispatch(computerMove());
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameMode, gameOver, dispatch, playerSymbol]);

  const handleCellClick = (index: number) => {
    if (
      gameMode === "computer" &&
      playerSymbol &&
      currentPlayer !== playerSymbol
    )
      return;
    if (board[index] !== null || gameOver) return;
    dispatch(makeMove(index));
  };

  const resetCurrentGame = () => {
    dispatch(resetGame());
  };

  const renderCell = (index: number) => {
    const isWinningCell =
      winner &&
      winner !== "draw" &&
      ticTacToeWinningCombinations.some(
        (combo) =>
          combo.includes(index) &&
          board[combo[0]] === winner &&
          board[combo[1]] === winner &&
          board[combo[2]] === winner
      );

    return (
      <motion.div
        key={index}
        className={`h-24 flex items-center justify-center text-4xl font-bold rounded-lg cursor-pointer transition-colors ${
          isWinningCell ? "bg-green-200" : "bg-gray-100 hover:bg-gray-200"
        }`}
        whileHover={!board[index] && !gameOver ? { scale: 1.05 } : {}}
        whileTap={!board[index] && !gameOver ? { scale: 0.95 } : {}}
        onClick={() => handleCellClick(index)}
      >
        <AnimatePresence>
          {board[index] && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`${
                board[index] === "X" ? "text-blue-600" : "text-red-600"
              }`}
            >
              {board[index]}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const renderGameBoard = () => (
    <>
      {winner && winner !== "draw" && <ConfettiCannon trigger={true} />}

      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">
            {gameMode === "computer"
              ? `Playing as ${playerSymbol} (vs Computer)`
              : "Play with Friend"}
          </h2>
          <div className="flex justify-center gap-8 mb-4">
            <div className="text-blue-600 font-medium">
              Player X: {scores.x}
            </div>
            <div className="text-gray-600 font-medium">Draw: {scores.draw}</div>
            <div className="text-red-600 font-medium">Player O: {scores.o}</div>
          </div>
          <div className="text-lg mb-4">
            {!gameOver ? (
              <span>
                Current Turn:{" "}
                <span
                  className={`font-bold ${
                    currentPlayer === "X" ? "text-blue-600" : "text-red-600"
                  }`}
                >
                  {currentPlayer}
                </span>
              </span>
            ) : (
              <span className="font-bold">
                {winner === "draw" ? "It's a draw!" : `Player ${winner} wins!`}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6 bg-gray-300 p-3 rounded-lg">
          {Array(9)
            .fill(null)
            .map((_, index) => renderCell(index))}
        </div>

        <div className="flex justify-center items-center flex-wrap gap-x-5 gap-y-2">
          <motion.button
            className="px-6 py-2 bg-purple-500 text-white rounded-lg font-medium cursor-pointer disabled:bg-gray-500 min-w-[150px]"
            disabled={board?.every((cell) => cell === null)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetCurrentGame}
          >
            {gameOver ? "Play Again" : "Reset Game"}
          </motion.button>
          <motion.button
            className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium cursor-pointer min-w-[150px]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              dispatch(setGameMode(null));
              dispatch(resetGame());
            }}
          >
            Change Mode
          </motion.button>
        </div>
      </motion.div>
    </>
  );

  return (
    <div className="flex flex-col items-center justify-center">
      <motion.h1
        className="text-4xl sm:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        variants={fadeInDown}
        initial="hidden"
        animate="show"
        custom={0.2}
      >
        Tic Tac Toe
      </motion.h1>

      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <AnimatePresence mode="wait">
          {!gameMode ? (
            <GameModeSelection
              setShowSymbolSelection={setShowSymbolSelection}
            />
          ) : showSymbolSelection ? (
            <SymbolSelection setShowSymbolSelection={setShowSymbolSelection} />
          ) : (
            renderGameBoard()
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TicTacToe;
