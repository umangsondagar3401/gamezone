import React, { useCallback, useEffect, useState } from "react";
import Timer from "./Timer";
import WordList from "./WordList";
import { generate } from "random-words";
import YouWinModal from "./YouWinModal";
import { useSelector } from "react-redux";
import NewGameButton from "./NewGameButton";
import WordSearchGrid from "./WordSearchGrid";
import { HiMiniPlay } from "react-icons/hi2";
import { HiMiniPause } from "react-icons/hi2";
import { HiOutlineLightBulb } from "react-icons/hi";
import { selectDifficulty } from "../../store/wordSearchSlice";
import { placeWords, buildGridCells } from "../../lib/wordSearchUtils";

interface WordSearchBoardProps {
  onNewGame: () => void;
  gridSize: number;
  resetKey: number;
  onReset: () => void;
}

const WordSearchBoard: React.FC<WordSearchBoardProps> = ({
  onReset,
  gridSize,
  resetKey,
  onNewGame,
}) => {
  // Use memoized selector for difficulty
  const difficulty = useSelector(selectDifficulty);

  const [win, setWin] = useState<boolean>(false);
  const [grid, setGrid] = useState<string[][]>([]);
  const [timeTaken, setTimeTaken] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [timerActive, setTimerActive] = useState<boolean>(true);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [currentWords, setCurrentWords] = useState<string[]>([]);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [foundMap, setFoundMap] = useState<Record<string, boolean[][]>>({});
  const [selectedCells, setSelectedCells] = useState<[number, number][]>([]);
  const [wordPlacements, setWordPlacements] = useState<
    { word: string; positions: [number, number][] }[]
  >([]);
  const [hintCells, setHintCells] = useState<[number, number][]>([]);
  const [hintActive, setHintActive] = useState<boolean>(false);
  const [hintCount, setHintCount] = useState<number>(0);
  const maxHints = 3;

  // Reset all state and generate a new game when resetKey, gridSize, or difficulty changes
  useEffect(() => {
    setWin(false);
    setGrid([]);
    setTimeTaken(0);
    setTimerActive(true);
    setIsSelecting(false);
    setCurrentWords([]);
    setFoundWords(new Set());
    setFoundMap({});
    setSelectedCells([]);
    setWordPlacements([]);
    setHintCells([]);
    setHintActive(false);
    setHintCount(0);
    generateGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey, gridSize, difficulty]);

  // Generate a new game
  const generateGame = useCallback(async () => {
    if (!difficulty) return;
    const numWords = gridSize; // Always match word count to grid size
    const maxWordLength =
      difficulty === "easy" ? 7 : difficulty === "medium" ? 9 : 12;
    // Generate unique words
    const words: string[] = [];
    const seen = new Set<string>();
    while (words.length < numWords) {
      const candidate = (
        generate({
          exactly: 1,
          maxLength: maxWordLength,
          formatter: (w: string) => w.toUpperCase(),
        }) as string[]
      )[0];
      if (!seen.has(candidate)) {
        seen.add(candidate);
        words.push(candidate);
      }
    }
    setCurrentWords(words);
    const { grid, wordPlacements } = placeWords(
      words,
      gridSize,
      difficulty as "easy" | "medium" | "hard"
    );
    // Ensure grid is always NxN
    setGrid(
      Array.from({ length: gridSize }, (_, i) =>
        Array.from({ length: gridSize }, (_, j) => grid[i]?.[j] || "")
      )
    );
    setWordPlacements(wordPlacements);
    setFoundWords(new Set());
    setFoundMap(
      Object.fromEntries(
        words.map((w) => [
          w,
          Array.from({ length: gridSize }, () => Array(gridSize).fill(false)),
        ])
      )
    );
    setSelectedCells([]);
    setIsSelecting(false);
    setWin(false);
    setTimerActive(true);
    setTimeTaken(0);
  }, [difficulty, gridSize]);

  useEffect(() => {
    if (difficulty) {
      generateGame();
    }
  }, [difficulty, generateGame]);

  // Hint logic
  const handleHint = useCallback(() => {
    if (hintActive || hintCount >= maxHints) return; // Prevent spamming or over-limit
    // Find unfound words
    const unfound = currentWords.filter((w) => !foundWords.has(w));
    if (unfound.length === 0) return;
    // Pick a random unfound word
    const word = unfound[Math.floor(Math.random() * unfound.length)];
    // Find its positions
    const placement = wordPlacements.find((wp) => wp.word === word);
    if (!placement) return;
    setHintCells(placement.positions);
    setHintActive(true);
    setHintCount((c) => c + 1);
    setTimeout(() => {
      setHintCells([]);
      setHintActive(false);
    }, 2000); // Highlight for 2 seconds
  }, [
    currentWords,
    foundWords,
    wordPlacements,
    hintActive,
    hintCount,
    maxHints,
  ]);

  const handleCellMouseDown = useCallback((row: number, col: number) => {
    setIsSelecting(true);
    setSelectedCells([[row, col]]);
  }, []);

  const handleCellMouseEnter = useCallback(
    (row: number, col: number) => {
      if (!isSelecting) return;
      setSelectedCells((prev): [number, number][] => {
        if (prev.length === 0) return [[row, col]];
        const [startRow, startCol] = prev[0];
        // Only allow straight lines (horizontal, vertical, diagonal)
        const dRow = row - startRow;
        const dCol = col - startCol;
        if (dRow === 0 || dCol === 0 || Math.abs(dRow) === Math.abs(dCol)) {
          // Build the path
          const len = Math.max(Math.abs(dRow), Math.abs(dCol));
          const cells: [number, number][] = [];
          for (let i = 0; i <= len; i++) {
            cells.push([
              startRow + Math.sign(dRow) * i,
              startCol + Math.sign(dCol) * i,
            ]);
          }
          return cells;
        }
        return prev;
      });
    },
    [isSelecting]
  );

  const handleCellMouseUp = useCallback(() => {
    if (!isSelecting) return;
    setIsSelecting(false);
    if (selectedCells.length === 0) return;
    const selectedWord = selectedCells
      .map(([r, c]) => grid[r]?.[c] ?? "")
      .join("");
    const reversed = selectedCells
      .map(([r, c]) => grid[r]?.[c] ?? "")
      .reverse()
      .join("");
    let matched: string | null = null;
    for (const { word, positions } of wordPlacements) {
      const posString = positions.map(([r, c]) => `${r},${c}`).join("-");
      const selString = selectedCells.map(([r, c]) => `${r},${c}`).join("-");
      const selStringRev = selectedCells
        .slice()
        .reverse()
        .map(([r, c]) => `${r},${c}`)
        .join("-");
      if (
        (selectedWord === word && selString === posString) ||
        (reversed === word && selStringRev === posString)
      ) {
        matched = word;
        break;
      }
    }
    if (matched) {
      setFoundWords((prev) => {
        const newSet = new Set(prev);
        newSet.add(matched!);
        return newSet;
      });
      setFoundMap((prev) => {
        const newMap = { ...prev };
        for (const [r, c] of selectedCells) {
          if (newMap[matched!]?.[r]?.[c] !== undefined) {
            newMap[matched!][r][c] = true;
          }
        }
        return newMap;
      });
    }
    setSelectedCells([]);
  }, [isSelecting, selectedCells, grid, wordPlacements]);

  // Win condition
  useEffect(() => {
    if (currentWords.length > 0 && foundWords.size === currentWords.length) {
      setWin(true);
      setTimerActive(false);
    }
  }, [foundWords, currentWords]);

  // Timer update
  const handleTimeUpdate = (s: number) => setTimeTaken(s);

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center w-full mb-4 gap-3 md:gap-0">
        <span className="font-semibold text-base capitalize text-center md:text-left">
          Level: {difficulty}
        </span>

        {/* Pause/Resume Button */}
        <div className="flex gap-2 justify-center md:justify-end">
          <button
            onClick={onReset}
            disabled={isPaused}
            aria-label="Reset Game"
            className="px-4 py-2 bg-gray-200 cursor-pointer text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
          >
            Reset
          </button>
          <button
            className="px-4 py-2 bg-indigo-100 text-indigo-700 cursor-pointer rounded-lg font-medium hover:bg-indigo-100 transition"
            onClick={() => {
              setIsPaused((prev) => !prev);
              setTimerActive((prev) => !prev);
            }}
            aria-label={isPaused ? "Resume Game" : "Pause Game"}
          >
            {isPaused ? (
              <HiMiniPlay className="w-5 h-5" />
            ) : (
              <HiMiniPause className="w-5 h-5" />
            )}
          </button>
          <button
            className="px-4 py-2 bg-yellow-100 text-yellow-700 cursor-pointer rounded-lg font-medium hover:bg-yellow-200 transition flex items-center gap-1"
            onClick={handleHint}
            aria-label={`Show Hint (${maxHints - hintCount} left)`}
            disabled={hintActive || win || isPaused || hintCount >= maxHints}
          >
            <HiOutlineLightBulb className="w-5 h-5" /> Hint (
            {maxHints - hintCount})
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6 md:flex-row items-center md:items-start justify-center w-full">
        {/* Main game area: Timer, Grid, New Game */}
        <div className="flex flex-col items-center w-full md:max-w-lg max-w-full">
          <Timer
            key={resetKey}
            isActive={timerActive}
            onTimeUpdate={handleTimeUpdate}
          />
          <div className="bg-white rounded-xl shadow-lg w-full max-w-[min(100vw,425px)] mt-1.5">
            <WordSearchGrid
              paused={isPaused}
              gridSize={gridSize}
              hintCells={hintCells}
              onCellMouseUp={handleCellMouseUp}
              onCellMouseDown={handleCellMouseDown}
              onCellMouseEnter={handleCellMouseEnter}
              grid={buildGridCells(grid, foundMap, selectedCells)}
              onResume={() => {
                setIsPaused(false);
                setTimerActive(true);
              }}
            />
          </div>
          <div className="mt-5 w-full flex justify-center">
            <NewGameButton onClick={onNewGame} />
          </div>
        </div>

        {/* Right Side Word list */}
        <div className="flex-shrink-0 mt-0 md:mt-9 flex justify-center md:justify-start">
          <WordList words={currentWords} foundWords={foundWords} />
        </div>

        {win && (
          <YouWinModal
            open={win}
            timeTaken={timeTaken}
            onPlayAgain={() => {
              setWin(false);
              setTimeTaken(0);
              setTimerActive(true);
              onReset();
            }}
            onNewGame={() => {
              setWin(false);
              setTimeTaken(0);
              onNewGame();
            }}
          />
        )}
      </div>
    </>
  );
};

export default React.memo(WordSearchBoard);
