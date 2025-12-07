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

const getAvailableMoves = (board: Player[]): number[] => {
  return board.reduce<number[]>((acc, cell, index) => {
    if (cell === null) acc.push(index);
    return acc;
  }, []);
};

const isWinningMove = (
  board: Player[],
  index: number,
  symbol: "X" | "O"
): boolean => {
  const newBoard = [...board];
  newBoard[index] = symbol;
  return checkWinner(newBoard) === symbol;
};

const countPotentialWinningLines = (
  board: Player[],
  symbol: "X" | "O"
): number => {
  let count = 0;
  for (const [a, b, c] of ticTacToeWinningCombinations) {
    const line = [a, b, c].map((i) => board[i]);
    const symbolCount = line.filter((cell) => cell === symbol).length;
    const emptyCount = line.filter((cell) => cell === null).length;
    if (symbolCount === 2 && emptyCount === 1) {
      count++;
    }
  }
  return count;
};

const isForkMove = (
  board: Player[],
  index: number,
  symbol: "X" | "O"
): boolean => {
  const newBoard = [...board];
  newBoard[index] = symbol;
  return countPotentialWinningLines(newBoard, symbol) >= 2;
};

const getBestMoveForComputer = (
  board: Player[],
  computer: "X" | "O",
  human: "X" | "O"
): number | null => {
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) return null;

  // 1. Win: If the computer can win on this move, do it.
  for (const move of availableMoves) {
    if (isWinningMove(board, move, computer)) return move;
  }

  // 2. Block: If the opponent can win next move, block it.
  for (const move of availableMoves) {
    if (isWinningMove(board, move, human)) return move;
  }

  // 3. Create a fork (two ways to win on next move).
  for (const move of availableMoves) {
    if (isForkMove(board, move, computer)) return move;
  }

  // 4. Block opponent's fork.
  const opponentForks = availableMoves.filter((move) =>
    isForkMove(board, move, human)
  );
  if (opponentForks.length === 1) {
    return opponentForks[0];
  } else if (opponentForks.length > 1) {
    // If the opponent has multiple fork opportunities, play center if possible,
    // otherwise play a side to reduce their options.
    const centerIndex = 4;
    if (board[centerIndex] === null && availableMoves.includes(centerIndex)) {
      return centerIndex;
    }
    const sideIndices = [1, 3, 5, 7].filter((i) => availableMoves.includes(i));
    if (sideIndices.length > 0) return sideIndices[0];
  }

  // 5. Play center if available.
  if (board[4] === null && availableMoves.includes(4)) {
    return 4;
  }

  // 6. Play opposite corner of opponent.
  const oppositeCornerPairs: [number, number][] = [
    [0, 8],
    [2, 6],
    [6, 2],
    [8, 0],
  ];
  for (const [corner, opposite] of oppositeCornerPairs) {
    if (board[corner] === human && board[opposite] === null) {
      if (availableMoves.includes(opposite)) return opposite;
    }
  }

  // 7. Play any available corner.
  const cornerIndices = [0, 2, 6, 8].filter((i) => availableMoves.includes(i));
  if (cornerIndices.length > 0) return cornerIndices[0];

  // 8. Play any available side.
  const sideIndices = [1, 3, 5, 7].filter((i) => availableMoves.includes(i));
  if (sideIndices.length > 0) return sideIndices[0];

  // 9. Fallback: first available move (should rarely be hit).
  return availableMoves[0];
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
      const humanSymbol = state.playerSymbol === "X" ? "X" : "O";

      const bestMove = getBestMoveForComputer(
        state.board,
        computerSymbol,
        humanSymbol
      );

      if (bestMove === null) return;

      state.board[bestMove] = state.currentPlayer;

      const winner = checkWinner(state.board);
      state.gameOver = winner !== null;
      state.winner = winner;

      if (winner === "X") state.scores.x++;
      else if (winner === "O") state.scores.o++;
      else if (winner === "draw") state.scores.draw++;

      if (!state.gameOver) {
        state.currentPlayer = state.currentPlayer === "X" ? "O" : "X";
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
