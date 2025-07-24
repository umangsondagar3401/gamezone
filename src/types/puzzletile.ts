export const imageCategories = {
  nature: [
    100, 111, 173, 183, 191, 211, 237, 306, 318, 433, 437, 718, 742, 859, 1074,
  ],
} as const;

export type ImageCategory = keyof typeof imageCategories;
export type Tile = number | string;

export interface ImagePiece {
  imageUrl: string;
  backgroundPosition: string;
}

export type PuzzleTileProps = {
  tile: number | string;
  index: number;
  isClickable: boolean;
  puzzleType: "number" | "image";
  imagePieces: ImagePiece[];
  loadedImages: Record<string, boolean>;
  boardSize: number;
  onClick: (index: number) => void;
};

export type GameBoardProps = {
  boardSize: number;
  imagePieces: ImagePiece[];
  tiles: (number | string)[];
  showCompleteImage?: boolean;
  puzzleType: "number" | "image";
  onImageLoad: (url: string) => void;
  onTileClick: (index: number) => void;
  loadedImages: Record<string, boolean>;
};

export type VictoryModalProps = {
  isOpen: boolean;
  moves: number;
  onNewGame: () => void;
};

export type GameHeaderProps = {
  moves: number;
  onNewGame: () => void;
  onShuffle: () => void;
  showShuffle: boolean;
};
