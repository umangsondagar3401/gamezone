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

  // Perform random moves to shuffle
  for (let i = 0; i < 1000; i++) {
    const directions: number[] = [];
    const row = Math.floor(emptyIndex / boardSize);
    const col = emptyIndex % boardSize;

    if (row > 0) directions.push(-boardSize);
    if (row < boardSize - 1) directions.push(boardSize);
    if (col > 0) directions.push(-1);
    if (col < boardSize - 1) directions.push(1);

    const direction = directions[Math.floor(Math.random() * directions.length)];
    const swapIndex = emptyIndex + direction;

    [shuffled[emptyIndex], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[emptyIndex],
    ];
    emptyIndex = swapIndex;
  }

  // Ensure the puzzle is solvable (only for number puzzles)
  if (puzzleType === "number") {
    let inversions = 0;
    const tilesWithoutEmpty = shuffled.filter((tile) => tile !== 0) as number[];

    for (let i = 0; i < tilesWithoutEmpty.length - 1; i++) {
      for (let j = i + 1; j < tilesWithoutEmpty.length; j++) {
        if (tilesWithoutEmpty[i] > tilesWithoutEmpty[j]) inversions++;
      }
    }

    if (inversions % 2 !== 0) {
      const first = shuffled[0];
      const second = shuffled[1];
      shuffled[0] = second;
      shuffled[1] = first;
    }
  }

  return shuffled;
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
