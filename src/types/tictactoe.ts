export type Player = "X" | "O" | null;
export type GameMode = "computer" | "friend" | null;

export interface TicTacToeState {
  board: Player[];
  currentPlayer: Player;
  playerSymbol: Player; // 'X' or 'O' that the player chose
  winner: Player | "draw" | null;
  gameMode: GameMode;
  scores: {
    x: number;
    o: number;
    draw: number;
  };
  gameOver: boolean;
}
