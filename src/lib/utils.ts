import type { Theme } from "../types/memorymatch";

// Games card
export const games = [
  {
    id: 1,
    name: "Tic-Tac-Toe",
    description: "Challenge a friend or the computer in this classic game",
    icon: "❌⭕",
    color: "from-pink-500 to-pink-700",
    btnColor: "from-pink-400 to-pink-600",
    link: "/tic-tac-toe",
  },
  {
    id: 2,
    name: "Rock-Paper-Scissors",
    description: "Play the ultimate game of chance and strategy",
    icon: "🤜🤛",
    color: "from-indigo-500 to-indigo-700",
    btnColor: "from-indigo-400 to-indigo-600",
    link: "/rock-paper-scissors",
  },
  {
    id: 3,
    name: "Memory Match",
    description: "Test your memory with this classic card matching game",
    icon: "🧠",
    color: "from-blue-500 to-blue-700",
    btnColor: "from-blue-400 to-blue-600",
    link: "/memory-match",
  },
  {
    id: 4,
    name: "Word Search",
    description: "Find hidden words in a grid of letters",
    icon: "🔍",
    color: "from-purple-500 to-purple-700",
    btnColor: "from-purple-400 to-purple-600",
    link: "/word-search",
  },
  {
    id: 5,
    name: "2048",
    description: "Slide tiles to reach 2048!",
    icon: "🧩",
    color: "from-yellow-500 to-yellow-700",
    btnColor: "from-yellow-400 to-yellow-600",
    link: "/game-2048",
  },
  {
    id: 6,
    name: "Sudoku",
    description: "Classic number placement puzzle",
    icon: "🔢",
    color: "from-red-500 to-red-700",
    btnColor: "from-red-400 to-red-600",
    link: "/sudoku",
  },
];

// Tic-Tac-Toe
export const ticTacToeWinningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // Rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // Columns
  [0, 4, 8],
  [2, 4, 6], // Diagonals
];

// Memory Match
export const themeEmojis: Record<Theme, string[]> = {
  numbers: [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
  ],
  animals: [
    "🐶",
    "🐱",
    "🐭",
    "🐹",
    "🐰",
    "🦊",
    "🐻",
    "🐼",
    "🦁",
    "🐮",
    "🐷",
    "🐸",
    "🐵",
    "🐔",
    "🐧",
    "🐦",
    "🐤",
    "🦆",
    "🦅",
    "🦉",
    "🦇",
    "🐺",
    "🐗",
    "🐴",
    "🦄",
    "🐝",
    "🐛",
    "🦋",
  ],
  fruits: [
    "🍎",
    "🍐",
    "🍊",
    "🍋",
    "🍌",
    "🍉",
    "🍇",
    "🍓",
    "🫐",
    "🍒",
    "🍑",
    "🥭",
    "🍍",
    "🥝",
    "🍅",
    "🥥",
    "🥑",
    "🍆",
    "🥔",
    "🥕",
    "🌽",
    "🌶️",
    "🥒",
    "🥬",
    "🥦",
    "🍄",
    "🥜",
    "🌰",
  ],
};

// Game 2048
// Get tile background color based on value
export const getTileColor = (value: number) => {
  const colors: { [key: number]: string } = {
    2: "bg-indigo-100 text-indigo-800", // light
    4: "bg-indigo-200 text-indigo-900",
    8: "bg-indigo-300 text-white",
    16: "bg-indigo-400 text-white",
    32: "bg-indigo-500 text-white",
    64: "bg-indigo-600 text-white",
    128: "bg-violet-500 text-white", // transition to violet
    256: "bg-violet-600 text-white",
    512: "bg-purple-600 text-white",
    1024: "bg-purple-700 text-white",
    2048: "bg-purple-800 text-white", // deep & rich
  };
  return colors[value] || "bg-indigo-50 text-indigo-800"; // default for unknown tiles
};

// Calculate font size based on tile value
export const getFontSize = (value: number) => {
  if (value < 100) return "text-3xl";
  if (value < 1000) return "text-2xl";
  return "text-xl";
};