import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Choice, GameState } from "../types/rockpaperscissors";

const initialState: GameState = {
  playerChoice: null,
  computerChoice: null,
  playerScore: 0,
  computerScore: 0,
  result: null,
  isAnimating: false,
};

const determineWinner = (
  player: Choice | null,
  computer: Choice | null
): string => {
  if (!player || !computer) return "";

  if (player === computer) return "Draw!";

  if (
    (player === "rock" && computer === "scissors") ||
    (player === "paper" && computer === "rock") ||
    (player === "scissors" && computer === "paper")
  ) {
    return "You Win!";
  }

  return "Computer Wins!";
};

const gameSlice = createSlice({
  name: "rockPaperScissors",
  initialState,
  reducers: {
    makeChoice: (state, action: PayloadAction<Choice>) => {
      if (state.isAnimating) return;

      const choices: Choice[] = ["rock", "paper", "scissors"];
      const computerChoice = choices[Math.floor(Math.random() * 3)];

      state.playerChoice = action.payload;
      state.computerChoice = computerChoice;
      state.isAnimating = true;

      const result = determineWinner(action.payload, computerChoice);
      state.result = result;

      if (result === "You Win!") {
        state.playerScore += 1;
      } else if (result === "Computer Wins!") {
        state.computerScore += 1;
      }
    },
    resetGame: (state) => {
      state.playerChoice = null;
      state.computerChoice = null;
      state.result = null;
      state.isAnimating = false;
    },
  },
});

export const { makeChoice, resetGame } = gameSlice.actions;
export default gameSlice.reducer;
