import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { GameState, Tile, Direction } from "../types/game2048";

const GRID_SIZE = 4;

const getInitialBoard = (): (Tile | null)[][] => {
  return Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(null));
};

const initialState: GameState = {
  board: getInitialBoard(),
  score: 0,
  bestScore: parseInt(localStorage.getItem("bestScore") || "0"),
  gameOver: false,
  won: false,
  moved: false,
};

const addRandomTile = (state: GameState) => {
  const emptyCells: { row: number; col: number }[] = [];

  state.board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (!cell) {
        emptyCells.push({ row: rowIndex, col: colIndex });
      }
    });
  });

  if (emptyCells.length > 0) {
    const { row, col } =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    state.board[row][col] = {
      id: Math.random().toString(36).substr(2, 9) + Date.now(),
      value: Math.random() < 0.9 ? 2 : 4,
      isNew: true,
    };
  }
};

const hasValidMoves = (board: (Tile | null)[][]): boolean => {
  // Check for empty cells
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (!board[row][col]) return true;

      // Check adjacent cells for possible merges
      const current = board[row][col];
      const directions = [
        { dr: 0, dc: 1 },
        { dr: 1, dc: 0 },
      ];

      for (const { dr, dc } of directions) {
        const newRow = row + dr;
        const newCol = col + dc;

        if (newRow < GRID_SIZE && newCol < GRID_SIZE) {
          const neighbor = board[newRow][newCol];
          if (!neighbor || current?.value === neighbor.value) {
            return true;
          }
        }
      }
    }
  }
  return false;
};

const game2048Slice = createSlice({
  name: "game2048",
  initialState,
  reducers: {
    startNewGame: (state) => {
      state.board = getInitialBoard();
      state.score = 0;
      state.gameOver = false;
      state.won = false;
      state.moved = false;
      addRandomTile(state);
      addRandomTile(state);
    },

    moveTiles: (state, action: PayloadAction<Direction>) => {
      if (state.gameOver || state.won) return;

      const direction = action.payload;
      const newBoard = JSON.parse(
        JSON.stringify(state.board)
      ) as (Tile | null)[][];
      let moved = false;
      let score = state.score;

      // Reset merged flags and clear isNew
      newBoard.forEach((row) => {
        row.forEach((cell) => {
          if (cell) {
            cell.merged = false;
            delete cell.isNew;
          }
        });
      });

      const moveCell = (row: number, col: number) => {
        if (!newBoard[row][col]) return;

        let currentRow = row;
        let currentCol = col;
        let newRow = row;
        let newCol = col;

        while (true) {
          if (direction === "up") newRow--;
          if (direction === "down") newRow++;
          if (direction === "left") newCol--;
          if (direction === "right") newCol++;

          // Check boundaries
          if (
            newRow < 0 ||
            newRow >= GRID_SIZE ||
            newCol < 0 ||
            newCol >= GRID_SIZE
          )
            break;

          const currentCell = newBoard[currentRow][currentCol];
          const targetCell = newBoard[newRow][newCol];

          if (!targetCell) {
            // Move to empty cell
            newBoard[newRow][newCol] = currentCell;
            newBoard[currentRow][currentCol] = null;
            currentRow = newRow;
            currentCol = newCol;
            moved = true;
          } else if (
            targetCell.value === currentCell?.value &&
            !targetCell.merged &&
            !currentCell.merged
          ) {
            // Merge cells
            targetCell.value *= 2;
            targetCell.merged = true;
            newBoard[currentRow][currentCol] = null;
            score += targetCell.value;
            moved = true;

            // Check for win condition
            if (targetCell.value === 2048) {
              state.won = true;
            }
            break;
          } else {
            // Can't move further
            break;
          }
        }
      };

      // Process cells in the correct order based on direction
      if (direction === "up" || direction === "left") {
        for (let i = 0; i < GRID_SIZE; i++) {
          for (let j = 0; j < GRID_SIZE; j++) {
            if (direction === "up" && i > 0) moveCell(i, j);
            if (direction === "left" && j > 0) moveCell(i, j);
          }
        }
      } else {
        for (let i = GRID_SIZE - 1; i >= 0; i--) {
          for (let j = GRID_SIZE - 1; j >= 0; j--) {
            if (direction === "down" && i < GRID_SIZE - 1) moveCell(i, j);
            if (direction === "right" && j < GRID_SIZE - 1) moveCell(i, j);
          }
        }
      }

      if (moved) {
        state.moved = true;
        state.board = newBoard;
        state.score = score;

        if (score > state.bestScore) {
          state.bestScore = score;
          localStorage.setItem("bestScore", score.toString());
        }

        // Add new tile after move
        addRandomTile(state);

        // Check for game over
        if (!hasValidMoves(state.board)) {
          state.gameOver = true;
        }
      }
    },
  },
});

export const { startNewGame, moveTiles } = game2048Slice.actions;
export default game2048Slice.reducer;
