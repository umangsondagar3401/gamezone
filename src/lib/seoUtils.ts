// Default SEO values
export const defaultTitle = "GameZone - Play Free Online Games";
export const defaultDescription =
  "Play a variety of free online games including 2048, Sudoku, Tic Tac Toe, Memory Match, Word Search, and more!";

// Type for SEO data
export interface SeoData {
  title: string;
  description: string;
  keywords: string[];
}

// Get page-specific SEO data based on route
export const getPageSeo = (path: string): SeoData => {
  switch (path) {
    case "/tic-tac-toe":
      return {
        title: "Tic Tac Toe - Play Online | GameZone",
        description:
          "Play the classic Tic Tac Toe game online for free. Challenge yourself or play against a friend!",
        keywords: [
          "tic tac toe",
          "noughts and crosses",
          "online game",
          "free game",
          "two player game",
        ],
      };
    case "/rock-paper-scissors":
      return {
        title: "Rock Paper Scissors - Play Online | GameZone",
        description:
          "Play the classic Rock Paper Scissors game online. Best of three?",
        keywords: [
          "rock paper scissors",
          "online game",
          "free game",
          "hand game",
        ],
      };
    case "/memory-match":
      return {
        title: "Memory Match - Play Online | GameZone",
        description:
          "Test your memory with this fun and challenging Memory Match game. Find all matching pairs!",
        keywords: [
          "memory match",
          "memory game",
          "concentration",
          "card matching game",
        ],
      };
    case "/word-search":
      return {
        title: "Word Search - Play Online | GameZone",
        description:
          "Challenge yourself with our Word Search puzzles. Find all the hidden words!",
        keywords: [
          "word search",
          "word find",
          "word puzzle",
          "vocabulary game",
        ],
      };
    case "/2048":
      return {
        title: "2048 - Play Online | GameZone",
        description:
          "Play the addictive 2048 puzzle game. Combine the tiles and reach the 2048 tile!",
        keywords: ["2048", "puzzle game", "number game", "sliding puzzle"],
      };
    case "/sudoku":
      return {
        title: "Sudoku - Play Online | GameZone",
        description:
          "Play Sudoku online for free. Choose your difficulty and improve your logical thinking!",
        keywords: ["sudoku", "number puzzle", "logic game", "brain game"],
      };
    case "/sliding-puzzle":
      return {
        title: "Sliding Puzzle - Play Online | GameZone",
        description:
          "Challenge yourself with sliding puzzles. Rearrange the tiles to complete the picture!",
        keywords: [
          "sliding puzzle",
          "15 puzzle",
          "sliding block puzzle",
          "tile game",
        ],
      };
    default:
      return {
        title: defaultTitle,
        description: defaultDescription,
        keywords: [],
      };
  }
};
