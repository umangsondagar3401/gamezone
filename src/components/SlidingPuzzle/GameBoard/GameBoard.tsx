import { useCallback, useEffect } from "react";
import { PuzzleTile } from "./PuzzleTile";
import type { GameBoardProps } from "../../../types/puzzletile";

export const GameBoard = ({
  tiles,
  boardSize,
  puzzleType,
  imagePieces,
  loadedImages,
  onTileClick,
  onImageLoad,
  showCompleteImage = false,
}: GameBoardProps) => {
  // Preload images when imagePieces change
  useEffect(() => {
    if (puzzleType === "image" && imagePieces.length > 0) {
      imagePieces.forEach((piece) => {
        const img = new Image();
        img.src = piece.imageUrl;
        img.onload = () => onImageLoad(piece.imageUrl);
        img.onerror = () => onImageLoad(piece.imageUrl);
      });
    }
  }, [imagePieces, puzzleType, onImageLoad]);

  const isClickable = useCallback(
    (tile: number | string) => {
      if (tile === 0) return false;
      const emptyIndex = tiles.indexOf(0);
      const tileIndex = tiles.indexOf(tile);
      const tileRow = Math.floor(tileIndex / boardSize);
      const tileCol = tileIndex % boardSize;
      const emptyRow = Math.floor(emptyIndex / boardSize);
      const emptyCol = emptyIndex % boardSize;

      return (
        (tileRow === emptyRow && Math.abs(tileCol - emptyCol) === 1) ||
        (tileCol === emptyCol && Math.abs(tileRow - emptyRow) === 1)
      );
    },
    [tiles, boardSize]
  );

  // If showing complete image, just show the full image
  if (showCompleteImage && puzzleType === "image" && imagePieces?.length > 0) {
    return (
      <div className="relative w-full max-w-md mx-auto aspect-square">
        <img
          alt="Complete puzzle"
          src={imagePieces[0]?.imageUrl}
          className="w-full h-full object-cover rounded-2xl shadow-2xl"
        />
      </div>
    );
  }

  return (
    <div className="w-full px-4">
      <div
        className={`grid gap-2 sm:gap-3 bg-indigo-200 p-2 sm:p-4 rounded-2xl shadow-2xl mx-auto ${
          boardSize === 3 ? "max-w-md" : "max-w-2xl"
        } w-full`}
        style={{
          gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
          aspectRatio: "1/1",
        }}
      >
        {tiles?.map((tile, index) => (
          <PuzzleTile
            key={index}
            tile={tile}
            index={index}
            boardSize={boardSize}
            onClick={onTileClick}
            puzzleType={puzzleType}
            imagePieces={imagePieces}
            loadedImages={loadedImages}
            isClickable={isClickable(tile)}
          />
        ))}
      </div>
    </div>
  );
};
