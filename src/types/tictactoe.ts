export type Player = "X" | "O" | null;
export type GameMode = "computer" | "friend" | "online" | null;

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
  onlineMatchCode: string | null;
  onlinePlayerId: string | null;
  onlineMySymbol: "X" | "O" | null;
  onlineConnected: boolean;
}
