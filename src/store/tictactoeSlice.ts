import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ticTacToeWinningCombinations } from "../lib/utils";
import type { Player, GameMode, TicTacToeState } from "../types/tictactoe";

const initialState: TicTacToeState = {
  board: Array(9).fill(null),
  currentPlayer: "X",
  playerSymbol: null,
  winner: null,
  gameMode: null,
  scores: {
    x: 0,
    o: 0,
    draw: 0,
  },
  gameOver: false,
};

const checkWinner = (board: Player[]): Player | "draw" | null => {
  for (const [a, b, c] of ticTacToeWinningCombinations) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return board.every((cell: Player) => cell !== null) ? "draw" : null;
};

const ticTacToeSlice = createSlice({
  name: "tictactoe",
  initialState,
  reducers: {
    makeMove: (state, action: PayloadAction<number>) => {
      if (state.gameOver || state.board[action.payload] !== null) return;

      const newBoard = [...state.board];
      newBoard[action.payload] = state.currentPlayer;

      const winner = checkWinner(newBoard);
      const gameOver = winner !== null;

      state.board = newBoard;
      state.winner = winner;
      state.gameOver = gameOver;

      if (winner === "X") state.scores.x++;
      else if (winner === "O") state.scores.o++;
      else if (winner === "draw") state.scores.draw++;

      if (!gameOver) {
        state.currentPlayer = state.currentPlayer === "X" ? "O" : "X";

        // If playing against computer and it's computer's turn, trigger computer move
        if (
          state.gameMode === "computer" &&
          state.playerSymbol &&
          state.currentPlayer !== state.playerSymbol
        ) {
          // The computer move will be handled by the useEffect in the component
        }
      }
    },

    resetGame: (state) => {
      state.board = Array(9).fill(null);
      state.currentPlayer = "X";
      state.winner = null;
      state.gameOver = false;
    },

    setGameMode: (state, action: PayloadAction<GameMode>) => {
      state.gameMode = action.payload;
      state.board = Array(9).fill(null);
      state.winner = null;
      state.gameOver = false;
      state.currentPlayer = "X";
      state.playerSymbol = null;
      state.scores = {
        x: 0,
        o: 0,
        draw: 0,
      };
    },

    setPlayerSymbol: (state, action: PayloadAction<"X" | "O">) => {
      state.playerSymbol = action.payload;
      state.currentPlayer = "X";
    },

    computerMove: (state) => {
      if (
        state.gameOver ||
        !state.playerSymbol ||
        state.gameMode !== "computer"
      )
        return;

      // Get computer's symbol (opposite of player's symbol)
      const computerSymbol = state.playerSymbol === "X" ? "O" : "X";

      // If it's not computer's turn, do nothing
      if (state.currentPlayer !== computerSymbol) return;

      // Simple AI: Choose a random empty cell
      const emptyCells = state.board.reduce<number[]>((acc, cell, index) => {
        if (cell === null) acc.push(index);
        return acc;
      }, []);

      if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const move = emptyCells[randomIndex];

        state.board[move] = state.currentPlayer;

        const winner = checkWinner(state.board);
        state.gameOver = winner !== null;
        state.winner = winner;

        if (winner === "X") state.scores.x++;
        else if (winner === "O") state.scores.o++;
        else if (winner === "draw") state.scores.draw++;

        if (!state.gameOver) {
          state.currentPlayer = state.currentPlayer === "X" ? "O" : "X";
        }
      }
    },
  },
});

export const {
  makeMove,
  resetGame,
  setGameMode,
  setPlayerSymbol,
  computerMove,
} = ticTacToeSlice.actions;

export default ticTacToeSlice.reducer;
