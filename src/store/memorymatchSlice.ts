import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Card, GameState, Theme } from "../types/memorymatch";
import { themeEmojis } from "../lib/utils";

const initialState: GameState = {
  gridSize: 4,
  theme: "numbers",
  players: [
    { id: 1, name: "Player 1", score: 0 },
    { id: 2, name: "Player 2", score: 0 },
  ],
  currentPlayerIndex: 0,
  cards: [],
  flippedCards: [],
  isGameStarted: false,
  isGameOver: false,
  moves: 0,
};

const generateCards = (gridSize: number, theme: Theme): Card[] => {
  const totalPairs = (gridSize * gridSize) / 2;

  // Get emojis for the current theme
  const emojis = themeEmojis[theme];

  // Create pairs of emoji indices
  const values = Array.from(
    { length: Math.min(totalPairs, emojis.length) },
    (_, i) => i
  );
  const pairs = [...values, ...values].slice(0, gridSize * gridSize);

  // Shuffle the pairs
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }

  return pairs.map((value, index) => ({
    id: index,
    value: emojis[value % emojis.length],
    isFlipped: false,
    isMatched: false,
  }));
};

// Async thunk for handling the delayed card flip
export const checkMatch = createAsyncThunk(
  "memoryMatch/checkMatch",
  async (_, { dispatch, getState }) => {
    const state = getState() as { memoryMatch: GameState };

    if (state.memoryMatch.flippedCards.length === 2) {
      await new Promise((resolve) => setTimeout(resolve, 750));

      const [firstCardId, secondCardId] = state.memoryMatch.flippedCards;
      const firstCard = state.memoryMatch.cards.find(
        (c) => c.id === firstCardId
      );
      const secondCard = state.memoryMatch.cards.find(
        (c) => c.id === secondCardId
      );

      if (
        firstCard &&
        secondCard &&
        String(firstCard.value) === String(secondCard.value)
      ) {
        // Match found
        dispatch(matchFound({ firstCardId, secondCardId }));
      } else {
        // No match, flip cards back
        dispatch(flipCardsBack());
      }
    }
  }
);

const gameSlice = createSlice({
  name: "memoryMatch",
  initialState,
  reducers: {
    setGridSize: (state, action: PayloadAction<4 | 6>) => {
      state.gridSize = action.payload;
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
    setPlayers: (state, action: PayloadAction<number>) => {
      const numPlayers = action.payload;
      state.players = Array.from({ length: numPlayers }, (_, i) => ({
        id: i + 1,
        name: `Player ${i + 1}`,
        score: 0,
      }));
    },
    startGame: (state) => {
      state.cards = generateCards(state.gridSize, state.theme);
      state.isGameStarted = true;
      state.isGameOver = false;
      state.moves = 0;
      state.currentPlayerIndex = 0;
      state.flippedCards = [];
      state.players = state.players.map((player) => ({ ...player, score: 0 }));
    },
    flipCard: (state, action: PayloadAction<number>) => {
      const cardId = action.payload;
      const card = state.cards.find((card) => card.id === cardId);

      if (
        !card ||
        card.isMatched ||
        card.isFlipped ||
        state.flippedCards.length >= 2
      ) {
        return;
      }

      card.isFlipped = true;
      state.flippedCards.push(cardId);

      if (state.flippedCards.length === 2) {
        state.moves++;
      }
    },
    matchFound: (
      state,
      action: PayloadAction<{ firstCardId: number; secondCardId: number }>
    ) => {
      const { firstCardId, secondCardId } = action.payload;
      const firstCard = state.cards.find((card) => card.id === firstCardId);
      const secondCard = state.cards.find((card) => card.id === secondCardId);

      if (firstCard && secondCard) {
        firstCard.isMatched = true;
        secondCard.isMatched = true;

        // Update current player's score
        state.players[state.currentPlayerIndex].score++;

        // Check for game over
        state.isGameOver = state.cards.every((card) => card.isMatched);
      }

      state.flippedCards = [];
    },
    flipCardsBack: (state) => {
      state.flippedCards.forEach((cardId) => {
        const card = state.cards.find((c) => c.id === cardId);
        if (card) {
          card.isFlipped = false;
        }
      });

      // Switch to next player
      state.currentPlayerIndex =
        (state.currentPlayerIndex + 1) % state.players.length;
      state.flippedCards = [];
    },
    resetGame: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(checkMatch.fulfilled, () => {
      // This will be called after the async thunk completes
    });
  },
});

export const {
  setGridSize,
  setTheme,
  setPlayers,
  startGame,
  flipCard,
  resetGame,
  matchFound,
  flipCardsBack,
} = gameSlice.actions;
export default gameSlice.reducer;
