import { useState, useCallback, useEffect } from "react";
import {
  setGameWon,
  incrementMoves,
  resetGame as resetGameAction,
} from "../store/slidingPuzzleSlice";
import { motion } from "framer-motion";
import type { RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  splitImage,
  shuffleTiles,
  getRandomCategory,
  initializeBoard,
  checkSolved,
  handleImageLoad as handleImageLoadUtil,
} from "../lib/imageUtils";
import GameOptions from "../components/SlidingPuzzle/GameOptions";
import { GameHeader } from "../components/SlidingPuzzle/GameHeader";
import { VictoryModal } from "../components/SlidingPuzzle/VictoryModal";
import type { ImageCategory, ImagePiece, Tile } from "../types/puzzletile";
import { GameBoard } from "../components/SlidingPuzzle/GameBoard/GameBoard";

const SlidingPuzzle = () => {
  const dispatch = useDispatch();
  // Redux state
  const {
    moves,
    isGameWon,
    puzzleType,
    isGameStarted,
    gridSize: BOARD_SIZE,
  } = useSelector((state: RootState) => state.slidingPuzzle);
  const TOTAL_TILES = BOARD_SIZE * BOARD_SIZE - 1;

  const [tiles, setTiles] = useState<Tile[]>([]);
  const [imagePieces, setImagePieces] = useState<ImagePiece[]>([]);
  const [showCompleteImage, setShowCompleteImage] = useState(false);
  const [imageCategory] = useState<ImageCategory>(getRandomCategory());
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  // Check if the puzzle is solved
  const checkPuzzleSolved = useCallback(
    (currentTiles: Tile[]) => {
      return checkSolved(
        currentTiles,
        TOTAL_TILES,
        puzzleType,
        setShowCompleteImage,
        dispatch
      );
    },
    [TOTAL_TILES, puzzleType, dispatch]
  );

  // Shuffle the tiles using the utility function
  const shuffleTilesHandler = useCallback(
    (tilesToShuffle: Tile[]) => {
      return shuffleTiles(tilesToShuffle, BOARD_SIZE, puzzleType);
    },
    [BOARD_SIZE, puzzleType]
  );

  // Handle shuffle button click
  const handleShuffleClick = useCallback(() => {
    if (isGameStarted) {
      setTiles((prevTiles) => shuffleTilesHandler(prevTiles));
    }
  }, [isGameStarted, shuffleTilesHandler]);

  // Initialize or reset the game
  const startNewGame = useCallback(() => {
    setShowCompleteImage(false);
    dispatch(resetGameAction());
    if (puzzleType === "image") {
      splitImage(BOARD_SIZE, imageCategory).then((pieces) => {
        setImagePieces(pieces);
        const initialTiles = Array.from(
          { length: BOARD_SIZE * BOARD_SIZE - 1 },
          (_, i) => i + 1
        ).concat(0);
        setTiles(shuffleTilesHandler(initialTiles));
      });
    } else {
      const initialTiles = initializeBoard(TOTAL_TILES);
      setTiles(shuffleTilesHandler(initialTiles));
    }
  }, [
    BOARD_SIZE,
    dispatch,
    imageCategory,
    puzzleType,
    shuffleTilesHandler,
    TOTAL_TILES,
  ]);

  // Reset the game board
  const resetGame = useCallback(() => {
    const initialTiles = initializeBoard(TOTAL_TILES);
    setTiles(shuffleTilesHandler(initialTiles));
    setLoadedImages({});
    if (puzzleType === "image") {
      splitImage(BOARD_SIZE, imageCategory)
        .then((pieces) => {
          setImagePieces(pieces);
        })
        .catch((error) => {
          console.error("Error loading image:", error);
        });
    } else {
      setImagePieces([]);
    }
  }, [
    BOARD_SIZE,
    imageCategory,
    puzzleType,
    shuffleTilesHandler,
    setLoadedImages,
    setImagePieces,
    TOTAL_TILES,
  ]);

  // Handle tile click
  const handleTileClick = useCallback(
    (index: number) => {
      if (isGameWon || !isGameStarted) return;

      const emptyIndex = tiles.indexOf(0);
      const clickedRow = Math.floor(index / BOARD_SIZE);
      const clickedCol = index % BOARD_SIZE;
      const emptyRow = Math.floor(emptyIndex / BOARD_SIZE);
      const emptyCol = emptyIndex % BOARD_SIZE;

      // Check if clicked tile is adjacent to empty space
      const isAdjacent =
        (clickedRow === emptyRow && Math.abs(clickedCol - emptyCol) === 1) ||
        (clickedCol === emptyCol && Math.abs(clickedRow - emptyRow) === 1);

      if (isAdjacent) {
        const newTiles = [...tiles];
        [newTiles[index], newTiles[emptyIndex]] = [
          newTiles[emptyIndex],
          newTiles[index],
        ];

        setTiles(newTiles);
        dispatch(incrementMoves());

        if (checkPuzzleSolved(newTiles)) {
          dispatch(setGameWon());
        }
      }
    },
    [BOARD_SIZE, checkPuzzleSolved, dispatch, isGameStarted, isGameWon, tiles]
  );

  // Handle image loading
  const handleImageLoad = useCallback(
    (url: string) => {
      handleImageLoadUtil(url, setLoadedImages);
    },
    [setLoadedImages]
  );

  // Preload images when imagePieces change
  useEffect(() => {
    if (puzzleType === "image" && imagePieces.length > 0) {
      imagePieces.forEach((piece) => {
        const img = new Image();
        img.src = piece.imageUrl;
        img.onload = () => handleImageLoad(piece.imageUrl);
        img.onerror = () => handleImageLoad(piece.imageUrl);
      });
    }
  }, [imagePieces, puzzleType, handleImageLoad]);

  // Initialize the game when it starts or resets
  useEffect(() => {
    if (isGameStarted) {
      resetGame();
    }
  }, [isGameStarted, resetGame]);

  const showOptions = !isGameStarted;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <motion.h1
        className="text-4xl sm:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Sliding Puzzle
      </motion.h1>

      {showOptions ? (
        <GameOptions />
      ) : (
        <>
          <GameHeader
            moves={moves}
            onNewGame={startNewGame}
            showShuffle={isGameStarted}
            onShuffle={handleShuffleClick}
          />

          <GameBoard
            tiles={tiles}
            boardSize={BOARD_SIZE}
            puzzleType={puzzleType}
            imagePieces={imagePieces}
            loadedImages={loadedImages}
            onTileClick={handleTileClick}
            onImageLoad={handleImageLoad}
            showCompleteImage={showCompleteImage}
          />

          {isGameWon && (
            <VictoryModal
              moves={moves}
              isOpen={isGameWon}
              onNewGame={startNewGame}
            />
          )}
        </>
      )}
    </div>
  );
};

export default SlidingPuzzle;
