import {
  type ImagePiece,
  imageCategories,
  type ImageCategory,
  type Tile,
} from "../types/puzzletile";
import { setGameWon } from "../store/slidingPuzzleSlice";

export const getRandomImageUrl = (
  category: ImageCategory = "nature"
): string => {
  const ids = imageCategories[category];
  const randomId = ids[Math.floor(Math.random() * ids.length)];
  return `https://picsum.photos/id/${randomId}/400/400`;
};

export const splitImage = async (
  gridSize: number,
  category: ImageCategory
): Promise<ImagePiece[]> => {
  const imageUrl = getRandomImageUrl(category);
  const totalTiles = gridSize * gridSize - 1;
  const pieces: ImagePiece[] = [];

  for (let i = 0; i < totalTiles; i++) {
    const row = Math.floor(i / gridSize);
    const col = i % gridSize;

    const posX = `${(col / (gridSize - 1)) * 100}%`;
    const posY = `${(row / (gridSize - 1)) * 100}%`;

    pieces.push({
      imageUrl,
      backgroundPosition: `${posX} ${posY}`,
    });
  }

  return pieces;
};

export const shuffleTiles = <T extends number | string>(
  initialTiles: T[],
  boardSize: number,
  puzzleType: "number" | "image"
): T[] => {
  const shuffled = [...initialTiles];
  let emptyIndex = boardSize * boardSize - 1;

  // Perform random moves starting from solved state
  for (let i = 0; i < 1000; i++) {
    const directions: number[] = [];
    const row = Math.floor(emptyIndex / boardSize);
    const col = emptyIndex % boardSize;

    if (row > 0) directions.push(-boardSize); // Up
    if (row < boardSize - 1) directions.push(boardSize); // Down
    if (col > 0) directions.push(-1); // Left
    if (col < boardSize - 1) directions.push(1); // Right

    const direction = directions[Math.floor(Math.random() * directions.length)];
    const swapIndex = emptyIndex + direction;

    [shuffled[emptyIndex], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[emptyIndex],
    ];
    emptyIndex = swapIndex;
  }

  // Ensure solvability (only for number puzzles)
  if (puzzleType === "number") {
    if (!isSolvable(shuffled as number[], boardSize)) {
      // Swap two non-zero tiles (not the empty tile)
      for (let i = 0; i < shuffled.length - 1; i++) {
        if (shuffled[i] !== 0 && shuffled[i + 1] !== 0) {
          [shuffled[i], shuffled[i + 1]] = [shuffled[i + 1], shuffled[i]];
          break;
        }
      }
    }
  }

  return shuffled;
};

export const isSolvable = (tiles: number[], boardSize: number): boolean => {
  const inversions = getInversionCount(tiles);
  const emptyIndex = tiles.indexOf(0);
  const emptyRowFromBottom = boardSize - Math.floor(emptyIndex / boardSize);

  if (boardSize % 2 === 1) {
    // Odd grid: solvable if inversions is even
    return inversions % 2 === 0;
  } else {
    // Even grid: more complex rule
    // Solvable if:
    //  - blank is on even row from bottom AND inversions is odd
    //  - OR blank is on odd row from bottom AND inversions is even
    const isBlankOnEvenRowFromBottom = emptyRowFromBottom % 2 === 0;
    return (
      (isBlankOnEvenRowFromBottom && inversions % 2 === 1) ||
      (!isBlankOnEvenRowFromBottom && inversions % 2 === 0)
    );
  }
};

const getInversionCount = (tiles: number[]): number => {
  const arr = tiles.filter((t) => t !== 0);
  let count = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) count++;
    }
  }
  return count;
};

export const getRandomCategory = (): ImageCategory => {
  const categories: ImageCategory[] = ["nature"];
  return categories[Math.floor(Math.random() * categories.length)];
};

export const initializeBoard = (totalTiles: number): Tile[] => {
  return Array.from({ length: totalTiles }, (_, i) => i + 1).concat(0);
};

export const checkSolved = (
  currentTiles: Tile[],
  totalTiles: number,
  puzzleType: "number" | "image",
  setShowCompleteImage: (show: boolean) => void,
  dispatch: (action: { type: string }) => void
): boolean => {
  for (let i = 0; i < totalTiles; i++) {
    if (currentTiles[i] !== i + 1) return false;
  }

  const isSolved = currentTiles[totalTiles] === 0;

  if (isSolved && puzzleType === "image") {
    setShowCompleteImage(true);
    // Show victory modal after a short delay to see the complete image
    setTimeout(() => {
      dispatch(setGameWon());
    }, 1500);
    return false; // Return false to prevent immediate win state
  }

  return isSolved;
};

export const handleImageLoad = (
  url: string,
  setLoadedImages: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
) => {
  setLoadedImages((prev) => ({
    ...prev,
    [url]: true,
  }));
};
