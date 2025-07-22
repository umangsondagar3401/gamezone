export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Cell {
  value: number | null;
  isGiven: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  isInvalid: boolean;
}

export interface GameState {
  board: Cell[][];
  solution: number[][];
  selectedCell: { row: number; col: number } | null;
  difficulty: Difficulty;
  isGameStarted: boolean;
  isGameWon: boolean;
  isGameOver: boolean;
  isPaused: boolean;
  mistakes: number;
  timer: number;
  usedNumbers: Record<number, boolean>;
}

export type NumberInput = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;