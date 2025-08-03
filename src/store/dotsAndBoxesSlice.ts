// src/store/gameSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface GameState {
  gridSize: number;
  gameMode: "computer" | "friend";
  currentPlayer: 1 | 2;
  scores: { player1: number; player2: number };
  horizontalLines: boolean[][];
  verticalLines: boolean[][];
  boxes: (1 | 2 | null)[][];
  gameStarted: boolean;
  gameOver: boolean;
  winner: 1 | 2 | "draw" | null;
}

const initialState: GameState = {
  gridSize: 3,
  gameMode: "friend",
  currentPlayer: 1,
  scores: { player1: 0, player2: 0 },
  horizontalLines: [],
  verticalLines: [],
  boxes: [],
  gameStarted: false,
  gameOver: false,
  winner: null,
};

const dotsAndBoxesSlice = createSlice({
  name: "dotsAndBoxes",
  initialState,
  reducers: {
    setGridSize: (state, action: PayloadAction<number>) => {
      state.gridSize = action.payload;
    },
    setGameMode: (state, action: PayloadAction<"computer" | "friend">) => {
      state.gameMode = action.payload;
    },
    startGame: (state) => {
      const size = state.gridSize;
      state.horizontalLines = Array(size + 1)
        .fill(null)
        .map(() => Array(size).fill(false));
      state.verticalLines = Array(size)
        .fill(null)
        .map(() => Array(size + 1).fill(false));
      state.boxes = Array(size)
        .fill(null)
        .map(() => Array(size).fill(null));
      state.scores = { player1: 0, player2: 0 };
      state.currentPlayer = 1;
      state.gameStarted = true;
      state.gameOver = false;
      state.winner = null;
    },
    startNewGame: (state) => {
      state.horizontalLines = [];
      state.verticalLines = [];
      state.boxes = [];
      state.scores = { player1: 0, player2: 0 };
      state.currentPlayer = 1;
      state.gameStarted = false;
      state.gameOver = false;
      state.winner = null;
    },
    makeMove: (
      state,
      action: PayloadAction<{
        type: "horizontal" | "vertical";
        row: number;
        col: number;
      }>
    ) => {
      const { type, row, col } = action.payload;
      if (type === "horizontal") {
        state.horizontalLines[row][col] = true;
      } else {
        state.verticalLines[row][col] = true;
      }

      // Check for completed boxes
      const size = state.gridSize;
      let boxCompleted = false;

      // Check for completed boxes after this move
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if (
            !state.boxes[i][j] &&
            state.horizontalLines[i][j] &&
            state.horizontalLines[i + 1][j] &&
            state.verticalLines[i][j] &&
            state.verticalLines[i][j + 1]
          ) {
            state.boxes[i][j] = state.currentPlayer;
            if (state.currentPlayer === 1) {
              state.scores.player1++;
            } else {
              state.scores.player2++;
            }
            boxCompleted = true;
          }
        }
      }

      // Check for game over
      const totalBoxes = size * size;
      if (state.scores.player1 + state.scores.player2 === totalBoxes) {
        state.gameOver = true;
        if (state.scores.player1 > state.scores.player2) {
          state.winner = 1;
        } else if (state.scores.player2 > state.scores.player1) {
          state.winner = 2;
        } else {
          state.winner = "draw";
        }
      } else if (!boxCompleted) {
        // Switch player if no box was completed
        state.currentPlayer = state.currentPlayer === 1 ? 2 : 1;
      }

      // Computer's turn in single player mode - handled in the component
    },
  },
});

export const { setGridSize, setGameMode, startGame, makeMove, startNewGame } =
  dotsAndBoxesSlice.actions;
export default dotsAndBoxesSlice.reducer;
