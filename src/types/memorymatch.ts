export type Card = {
  id: number;
  value: string | number;
  isFlipped: boolean;
  isMatched: boolean;
};

export type Player = {
  id: number;
  name: string;
  score: number;
};

export type Theme = "numbers" | "animals" | "fruits";

export type GameState = {
  gridSize: 4 | 6;
  theme: Theme;
  players: Player[];
  currentPlayerIndex: number;
  cards: Card[];
  flippedCards: number[];
  isGameStarted: boolean;
  isGameOver: boolean;
  moves: number;
};
