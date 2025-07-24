import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type PuzzleType = "number" | "image";
type GridSize = 3 | 4;

interface SlidingPuzzleState {
  puzzleType: "number" | "image";
  gridSize: 3 | 4;
  moves: number;
  isGameStarted: boolean;
  isGameWon: boolean;
}

const initialState: SlidingPuzzleState = {
  puzzleType: "number",
  gridSize: 3,
  moves: 0,
  isGameStarted: false,
  isGameWon: false,
};

const slidingPuzzleSlice = createSlice({
  name: "slidingPuzzle",
  initialState,
  reducers: {
    setPuzzleType: (state, action: PayloadAction<PuzzleType>) => {
      state.puzzleType = action.payload;
      state.isGameStarted = false;
      state.isGameWon = false;
      state.moves = 0;
    },
    setGridSize: (state, action: PayloadAction<GridSize>) => {
      state.gridSize = action.payload;
      state.isGameStarted = false;
      state.isGameWon = false;
      state.moves = 0;
    },

    startGame: (state) => {
      state.isGameStarted = true;
      state.isGameWon = false;
      state.moves = 0;
    },
    incrementMoves: (state) => {
      state.moves += 1;
    },
    setGameWon: (state) => {
      state.isGameWon = true;
    },
    resetGame: (state) => {
      state.moves = 0;
      state.isGameWon = false;
      state.isGameStarted = false;
    },
  },
});

export const {
  setPuzzleType,
  setGridSize,
  startGame,
  incrementMoves,
  setGameWon,
  resetGame,
} = slidingPuzzleSlice.actions;

export default slidingPuzzleSlice.reducer;
