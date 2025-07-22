// Utility functions and constants for Word Search game

export const getGridSize = (difficulty: "easy" | "medium" | "hard" | null) => {
  if (difficulty === "easy") return 9;
  if (difficulty === "medium") return 12;
  if (difficulty === "hard") return 15;
  return 9;
};

export const DIRECTIONS = [
  { dx: 1, dy: 0 }, // right
  { dx: -1, dy: 0 }, // left
  { dx: 0, dy: 1 }, // down
  { dx: 0, dy: -1 }, // up
  { dx: 1, dy: 1 }, // down-right
  { dx: -1, dy: 1 }, // down-left
  { dx: 1, dy: -1 }, // up-right
  { dx: -1, dy: -1 }, // up-left
];

export function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomLetter() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return alphabet[getRandomInt(0, alphabet.length - 1)];
}

export function shuffle<T>(array: T[]): T[] {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Try to place a word in the grid at random positions and directions
export function placeWords(
  words: string[],
  size: number,
  difficulty: "easy" | "medium" | "hard"
) {
  const grid: (string | null)[][] = Array.from({ length: size }, () =>
    Array(size).fill(null)
  );
  const wordPlacements: { word: string; positions: [number, number][] }[] = [];
  const directions =
    difficulty === "easy" ? DIRECTIONS?.slice(0, 4) : DIRECTIONS;

  for (const word of shuffle(words)) {
    let placed = false;
    let tries = 0;
    while (!placed && tries < 200) {
      tries++;
      const dir = directions[getRandomInt(0, directions.length - 1)];
      const row = getRandomInt(0, size - 1);
      const col = getRandomInt(0, size - 1);
      const positions: [number, number][] = [];
      let r = row,
        c = col;
      let fits = true;
      for (let i = 0; i < word.length; i++) {
        if (
          r < 0 ||
          r >= size ||
          c < 0 ||
          c >= size ||
          (grid[r][c] && grid[r][c] !== word[i])
        ) {
          fits = false;
          break;
        }
        positions.push([r, c]);
        r += dir.dy;
        c += dir.dx;
      }
      if (fits) {
        // Place word
        for (let i = 0; i < word?.length; i++) {
          const [pr, pc] = positions[i];
          grid[pr][pc] = word[i];
        }
        wordPlacements.push({ word, positions });
        placed = true;
      }
    }
  }
  // Fill empty cells with random letters
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!grid[r][c]) grid[r][c] = randomLetter();
    }
  }
  return { grid, wordPlacements };
}

export function buildGridCells(
  grid: string[][],
  foundMap: Record<string, boolean[][]>,
  selected: [number, number][]
) {
  return grid.map((row, r) =>
    row.map((letter, c) => {
      let found = false;
      for (const key in foundMap) {
        if (foundMap[key][r][c]) found = true;
      }
      const selectedCell = selected.some(([sr, sc]) => sr === r && sc === c);
      return { letter, row: r, col: c, found, selected: selectedCell };
    })
  );
}
