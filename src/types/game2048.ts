export type Direction = "up" | "down" | "left" | "right";

export interface Tile {
  id: string;
  value: number;
  merged?: boolean;
  isNew?: boolean;
}

export interface Position {
  row: number;
  col: number;
}

export interface GameState {
  board: (Tile | null)[][];
  score: number;
  bestScore: number;
  gameOver: boolean;
  won: boolean;
  moved: boolean;
}
