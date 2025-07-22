import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInDown } from "../animation/CommonVariants";
import type { RootState, AppDispatch } from "../store/store";
import { flipCard, checkMatch } from "../store/memorymatchSlice";
import OptionsPanel from "../components/MemoryMatch/OptionsPanel";
import GameResultModal from "../components/MemoryMatch/GameResultModal";
const MemoryMatch = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    cards,
    moves,
    players,
    gridSize,
    isGameOver,
    isGameStarted,
    currentPlayerIndex,
    flippedCards,
  } = useSelector((state: RootState) => state.memoryMatch);
  const [showPreview, setShowPreview] = useState(false);
  // Show preview for 2s (4x4) or 3s (6x6) with no animation
  useEffect(() => {
    if (isGameStarted && !isGameOver) {
      setShowPreview(true);
      const previewDuration = gridSize === 4 ? 2000 : 3000;
      const timer = setTimeout(() => {
        setShowPreview(false);
      }, previewDuration);
      return () => clearTimeout(timer);
    } else {
      setShowPreview(false);
    }
  }, [isGameStarted, isGameOver, gridSize]);
  const handleCardClick = (cardId: number) => {
    // Don't allow clicks during preview or when two cards are already flipped
    if (showPreview || flippedCards.length >= 2) return;
    dispatch(flipCard(cardId));
    setTimeout(() => {
      dispatch(checkMatch());
    }, 10);
  };
  const renderGameBoard = () => (
    <div className="w-full max-w-4xl mx-auto">
      {/* Players status */}
      <div className="flex justify-center gap-4 mb-6 flex-wrap">
        {players?.map((player, index) => (
          <div
            key={player?.id}
            className={`p-3 rounded-lg border-2 transition-all text-center min-w-24 ${
              currentPlayerIndex === index
                ? "border-indigo-600 bg-indigo-50 scale-105"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="font-medium">{player?.name}</div>
            <div className="text-2xl font-bold text-indigo-600">
              {player?.score}
            </div>
            {currentPlayerIndex === index && (
              <div className="text-xs text-indigo-500 mt-1">Turn</div>
            )}
          </div>
        ))}
        <div className="p-3 rounded-lg border-2 border-gray-200 bg-white text-center min-w-24">
          <div className="font-medium">Moves</div>
          <div className="text-2xl font-bold text-gray-800">{moves}</div>
        </div>
      </div>
      {/* Game board */}
      <div
        className={`grid gap-3 mx-auto ${
          gridSize === 4 ? "grid-cols-4 max-w-lg" : "grid-cols-6 max-w-xl"
        }`}
      >
        {cards?.map((card) => (
          <motion.div
            key={card?.id}
            className={`aspect-square rounded-lg cursor-pointer relative ${
              card?.isMatched ? "opacity-50" : ""
            }`}
            onClick={() => handleCardClick(card?.id)}
            whileHover={card?.isMatched ? {} : { scale: 1.05 }}
            whileTap={card?.isMatched ? {} : { scale: 0.95 }}
          >
            <div className="absolute inset-0 rounded-lg">
              {/* Card Back */}
              <motion.div
                className="absolute inset-0 bg-indigo-600 rounded-lg"
                initial={false}
                animate={{
                  opacity:
                    card?.isFlipped || card?.isMatched || showPreview ? 0 : 1,
                }}
                transition={showPreview ? { duration: 0.6 } : { duration: 0 }}
              />
              {/* Card Front */}
              <AnimatePresence mode="wait">
                {(card?.isFlipped || card?.isMatched || showPreview) && (
                  <motion.div
                    key={card?.id + "-front"}
                    className="absolute inset-0 bg-white border-2 border-indigo-400 rounded-lg flex items-center justify-center text-2xl sm:text-3xl font-bold text-indigo-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {card?.value}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
  // Game board
  return (
    <div className="flex flex-col items-center justify-center">
      <motion.h1
        className="text-4xl sm:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        variants={fadeInDown}
        initial="hidden"
        animate="show"
        custom={0.1}
      >
        Memory Match
      </motion.h1>
      <AnimatePresence mode="wait">
        {!isGameStarted ? <OptionsPanel /> : renderGameBoard()}
      </AnimatePresence>
      {/* Game over modal */}
      <AnimatePresence>{isGameOver && <GameResultModal />}</AnimatePresence>
    </div>
  );
};
export default MemoryMatch;
