import { configureStore } from "@reduxjs/toolkit";
import ticTacToeReducer from "./tictactoeSlice";
import rockPaperScissorsReducer from "./rockpaperscissorsSlice";
import memoryMatchReducer from "./memorymatchSlice";
import sudokuReducer from "./sudokuSlice";
import wordSearchReducer from "./wordSearchSlice";
import game2048Reducer from "./game2048Slice";

const store = configureStore({
  reducer: {
    tictactoe: ticTacToeReducer,
    rockPaperScissors: rockPaperScissorsReducer,
    memoryMatch: memoryMatchReducer,
    sudoku: sudokuReducer,
    wordSearch: wordSearchReducer,
    game2048: game2048Reducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: { tictactoe: TicTacToeState, rockPaperScissors: GameState }
export type AppDispatch = typeof store.dispatch;

export default store;
