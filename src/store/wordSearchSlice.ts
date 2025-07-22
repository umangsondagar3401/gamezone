import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface WordSearchState {
  foundWords: string[];
  difficulty: "easy" | "hard" | "medium" | null;
  timeTaken: number;
}

const initialState: WordSearchState = {
  foundWords: [],
  difficulty: "medium",
  timeTaken: 0,
};

const wordSearchSlice = createSlice({
  name: "wordSearch",
  initialState,
  reducers: {
    addFoundWord(state, action: PayloadAction<string>) {
      if (!state.foundWords.includes(action.payload)) {
        state.foundWords.push(action.payload);
      }
    },
    setLevel(state, action: PayloadAction<"easy" | "hard" | "medium" | null>) {
      state.difficulty = action.payload ?? "medium";
    },
    resetLevel(state) {
      state.difficulty = "medium";
    },
    resetWordSearch(state) {
      state.foundWords = [];
      state.timeTaken = 0;
    },
    setTimeTaken(state, action: PayloadAction<number>) {
      state.timeTaken = action.payload;
    },
  },
});

export const {
  addFoundWord,
  setLevel,
  resetLevel,
  resetWordSearch,
  setTimeTaken,
} = wordSearchSlice.actions;
export default wordSearchSlice.reducer;

// Memoized selectors
import { createSelector } from "reselect";
import type { RootState } from "./store";

export const selectWordSearch = (state: RootState) => state.wordSearch;
export const selectDifficulty = createSelector(
  selectWordSearch,
  (ws) => ws.difficulty
);
export const selectFoundWords = createSelector(
  selectWordSearch,
  (ws) => ws.foundWords
);
export const selectTimeTaken = createSelector(
  selectWordSearch,
  (ws) => ws.timeTaken
);
