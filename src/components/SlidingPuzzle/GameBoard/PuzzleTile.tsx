import { motion } from "framer-motion";
import type { PuzzleTileProps } from "../../../types/puzzletile";

export const PuzzleTile = ({
  tile,
  index,
  isClickable,
  puzzleType,
  imagePieces,
  loadedImages,
  boardSize,
  onClick,
}: PuzzleTileProps) => {
  if (tile === 0) {
    return <div className="bg-transparent aspect-square" />;
  }

  const isLoading =
    puzzleType === "image" &&
    !loadedImages[imagePieces[(tile as number) - 1]?.imageUrl];

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="relative w-full h-full">
          <div className="absolute inset-0 bg-indigo-50 animate-pulse rounded-lg" />
        </div>
      );
    }

    if (puzzleType === "image") {
      const piece = imagePieces[(tile as number) - 1];
      if (!piece) return null;

      return (
        <>
          <span className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs font-bold px-2 py-1 rounded-full">
            {tile}
          </span>
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${piece.imageUrl})`,
              backgroundSize: `${boardSize * 100}%`,
              backgroundPosition: piece.backgroundPosition,
            }}
          />
        </>
      );
    }

    return (
      <span className="text-[28px] font-extrabold text-white drop-shadow-md">
        {tile}
      </span>
    );
  };

  return (
    <motion.div
      className={`flex items-center justify-center rounded-xl cursor-pointer select-none overflow-hidden ${
        puzzleType === "number"
          ? "bg-indigo-400 text-white shadow-lg hover:shadow-xl"
          : "bg-indigo-200"
      } aspect-square w-full h-full`}
      initial={{ scale: 1 }}
      onClick={() => onClick(index)}
      whileTap={{ scale: isClickable ? 0.95 : 1 }}
      whileHover={{ scale: isClickable ? 1.03 : 1 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17,
        scale: { duration: 0.15 },
      }}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {renderContent()}
      </div>
    </motion.div>
  );
};
