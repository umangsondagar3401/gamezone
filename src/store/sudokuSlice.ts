import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Difficulty, GameState, Cell } from "../types/sudoku";

const GRID_SIZE = 9;
const BOX_SIZE = 3;

// Helper function to generate a solved Sudoku board
const generateSolvedBoard = (): number[][] => {
  const board = Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(0));

  const isValid = (
    board: number[][],
    row: number,
    col: number,
    num: number
  ): boolean => {
    // Check row and column
    for (let i = 0; i < GRID_SIZE; i++) {
      if (board[row][i] === num || board[i][col] === num) return false;
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
    const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;

    for (let i = 0; i < BOX_SIZE; i++) {
      for (let j = 0; j < BOX_SIZE; j++) {
        if (board[boxRow + i][boxCol + j] === num) return false;
      }
    }

    return true;
  };

  const solve = (row = 0, col = 0): boolean => {
    if (row === GRID_SIZE) return true;
    if (col === GRID_SIZE) return solve(row + 1, 0);
    if (board[row][col] !== 0) return solve(row, col + 1);

    const nums = Array.from({ length: 9 }, (_, i) => i + 1);
    for (let i = nums.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }

    for (const num of nums) {
      if (isValid(board, row, col, num)) {
        board[row][col] = num;
        if (solve(row, col + 1)) return true;
        board[row][col] = 0;
      }
    }

    return false;
  };

  solve();
  return board;
};

// Helper function to create initial board with given cells
const createInitialBoard = (
  solution: number[][],
  difficulty: Difficulty
): Cell[][] => {
  const cellsToRemove = {
    easy: 40, // ~45-50 cells given
    medium: 50, // ~31-35 cells given
    hard: 55, // ~26-30 cells given
  };

  const board = solution.map((row) =>
    row.map((value) => ({
      value,
      isGiven: true,
      isSelected: false,
      isHighlighted: false,
      pencilMarks: [],
      isInvalid: false,
    }))
  );

  // Remove numbers based on difficulty
  const cells = Array.from({ length: 81 }, (_, i) => i);

  // Shuffle cells
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }

  for (let i = 0; i < Math.min(cellsToRemove[difficulty], cells.length); i++) {
    const index = cells[i];
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    board[row][col] = {
      ...board[row][col],
      value: 0,
      isGiven: false,
    };
  }

  return board;
};

const initialState: GameState = {
  board: [],
  solution: [],
  selectedCell: null,
  difficulty: "medium",
  isGameStarted: false,
  isGameWon: false,
  isGameOver: false,
  isPaused: false,
  mistakes: 0,
  timer: 0,
  usedNumbers: {},
};

const sudokuSlice = createSlice({
  name: "sudoku",
  initialState,
  reducers: {
    startNewGame: (state, action: PayloadAction<Difficulty>) => {
      const difficulty = action.payload;
      state.solution = generateSolvedBoard();
      state.board = createInitialBoard(state.solution, difficulty);
      state.difficulty = difficulty;
      state.isGameStarted = true;
      state.isGameWon = false;
      state.isGameOver = false;
      state.isPaused = false;
      state.mistakes = 0;
      state.timer = 0;
      state.selectedCell = null;
      state.usedNumbers = {};

      // Update used numbers for initial board
      const used: Record<number, boolean> = {};
      state.board.forEach((row) => {
        row.forEach((cell) => {
          if (cell.value) {
            used[cell.value] = true;
          }
        });
      });
      state.usedNumbers = used;
    },

    selectDifficulty: (state, action: PayloadAction<Difficulty>) => {
      state.difficulty = action.payload;
    },

    selectCell: (
      state,
      action: PayloadAction<{ row: number; col: number }>
    ) => {
      const { row, col } = action.payload;

      // Deselect all cells
      state.board = state.board.map((r, rIdx) =>
        r.map((cell, cIdx) => ({
          ...cell,
          isSelected: rIdx === row && cIdx === col,
          isHighlighted:
            rIdx === row ||
            cIdx === col ||
            (Math.floor(rIdx / BOX_SIZE) === Math.floor(row / BOX_SIZE) &&
              Math.floor(cIdx / BOX_SIZE) === Math.floor(col / BOX_SIZE)),
        }))
      );

      state.selectedCell = { row, col };
    },

    setCellValue: (state, action: PayloadAction<number | null>) => {
      if (
        !state.selectedCell ||
        !state.isGameStarted ||
        state.isGameWon ||
        state.isGameOver ||
        state.isPaused
      )
        return;

      const { row, col } = state.selectedCell;
      const cell = state.board[row][col];

      // Don't modify given cells
      if (cell.isGiven) return;

      const value = action.payload;

      if (value === null) {
        // Clear the cell
        cell.value = null;
        cell.isInvalid = false;
      } else {
        // Set the cell value
        const isCorrect = state.solution[row][col] === value;

        cell.value = value;
        cell.isInvalid = !isCorrect;

        // If the value is incorrect, increment mistakes
        if (!isCorrect) {
          state.mistakes++;

          // Check if mistake limit is reached
          if (state.mistakes >= 3) {
            state.isGameOver = true;
            return;
          }
        } else {
          // Update used numbers for the correct value
          state.usedNumbers[value] = true;
        }

        // Check if the game is won
        const isComplete = state.board.every((r, i) =>
          r.every(
            (c, j) => c.isGiven || (c.value && c.value === state.solution[i][j])
          )
        );

        if (isComplete) {
          state.isGameWon = true;
        }
      }
    },

    togglePause: (state) => {
      if (state.isGameStarted && !state.isGameOver && !state.isGameWon) {
        state.isPaused = !state.isPaused;
      }
    },

    incrementTimer: (state) => {
      if (!state.isPaused) {
        state.timer += 1;
      }
    },

    resetGame: (state) => {
      Object.assign(state, {
        ...initialState,
        board: [],
        solution: [],
        usedNumbers: {},
      });
    },
  },
});

export const {
  startNewGame,
  selectCell,
  setCellValue,
  selectDifficulty,
  togglePause,
  incrementTimer,
  resetGame,
} = sudokuSlice.actions;

export default sudokuSlice.reducer;
