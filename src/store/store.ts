import sudokuReducer from "./sudokuSlice";
import game2048Reducer from "./game2048Slice";
import ticTacToeReducer from "./tictactoeSlice";
import { configureStore } from "@reduxjs/toolkit";
import wordSearchReducer from "./wordSearchSlice";
import memoryMatchReducer from "./memorymatchSlice";
import dotsAndBoxesReducer from "./dotsAndBoxesSlice";
import slidingPuzzleReducer from "./slidingPuzzleSlice";
import rockPaperScissorsReducer from "./rockpaperscissorsSlice";

const store = configureStore({
  reducer: {
    tictactoe: ticTacToeReducer,
    rockPaperScissors: rockPaperScissorsReducer,
    memoryMatch: memoryMatchReducer,
    sudoku: sudokuReducer,
    wordSearch: wordSearchReducer,
    game2048: game2048Reducer,
    slidingPuzzle: slidingPuzzleReducer,
    dotsAndBoxes: dotsAndBoxesReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: { tictactoe: TicTacToeState, rockPaperScissors: GameState }
export type AppDispatch = typeof store.dispatch;

export default store;
