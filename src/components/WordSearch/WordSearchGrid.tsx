import { motion } from "framer-motion";
import React, { useRef, useEffect, useState } from "react";
import { HiMiniPlay } from "react-icons/hi2";

export interface GridCell {
  letter: string;
  row: number;
  col: number;
  selected?: boolean;
  found?: boolean;
}

interface WordSearchGridProps {
  grid: GridCell[][];
  onCellMouseUp: () => void;
  onCellMouseDown: (row: number, col: number) => void;
  onCellMouseEnter: (row: number, col: number) => void;
  gridSize?: number;
  paused?: boolean;
  onResume?: () => void;
  hintCells?: [number, number][];
}

const WordSearchGrid: React.FC<WordSearchGridProps> = ({
  grid,
  onCellMouseUp,
  onCellMouseDown,
  onCellMouseEnter,
  gridSize = 10,
  paused = false,
  onResume,
  hintCells = [],
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(375);

  useEffect(() => {
    function updateWidth() {
      if (gridRef.current) {
        setContainerWidth(gridRef.current.offsetWidth);
      }
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <div
      ref={gridRef}
      className="relative grid mx-auto select-none w-full min-w-0"
      style={{
        display: "grid",
        touchAction: "none",
        WebkitOverflowScrolling: "touch",
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
      }}
    >
      {grid?.map((row, rowIdx) =>
        row?.map((cell, colIdx) => {
          // Use the measured container width for cell size
          const cellPx = containerWidth / gridSize;
          const fontSize = Math.min(cellPx * 0.6, 18);
          const cellSize = `${cellPx}px`;
          return (
            <div
              data-row={rowIdx}
              data-col={colIdx}
              onMouseUp={paused ? undefined : onCellMouseUp}
              style={{
                touchAction: "none",
                width: cellSize,
                height: cellSize,
                minWidth: 0,
                minHeight: 0,
                fontSize: `${fontSize}px`,
                background: paused
                  ? "var(--color-wordsearch-paused-bg)"
                  : undefined,
                color: paused ? "var(--color-transparent)" : undefined,
                cursor: paused ? "not-allowed" : undefined,
              }}
              onTouchEnd={paused ? undefined : () => onCellMouseUp()}
              onTouchCancel={paused ? undefined : () => onCellMouseUp()}
              key={`cell-${gridSize}-${rowIdx}-${colIdx}`}
              onMouseDown={
                paused ? undefined : () => onCellMouseDown(rowIdx, colIdx)
              }
              onTouchStart={
                paused ? undefined : () => onCellMouseDown(rowIdx, colIdx)
              }
              onMouseEnter={
                paused ? undefined : () => onCellMouseEnter(rowIdx, colIdx)
              }
              className={`flex items-center justify-center border rounded font-bold text-lg transition touch-manipulation
                ${cell?.selected && !paused ? "bg-blue-300" : ""}
                ${cell?.found && !paused ? "bg-blue-300 text-white" : ""}
                ${
                  hintCells.some(([r, c]) => r === rowIdx && c === colIdx) &&
                  !paused
                    ? "bg-yellow-300 text-black animate-pulse"
                    : ""
                }
              `}
              onTouchMove={
                paused
                  ? undefined
                  : (e) => {
                      const touch = e.touches[0];
                      if (!touch) return;
                      const el = document.elementFromPoint(
                        touch.clientX,
                        touch.clientY
                      );
                      if (el && el instanceof HTMLElement) {
                        const row = el.getAttribute("data-row");
                        const col = el.getAttribute("data-col");
                        if (row !== null && col !== null) {
                          onCellMouseEnter(Number(row), Number(col));
                        }
                      }
                    }
              }
            >
              {paused ? "" : cell?.letter}
            </div>
          );
        })
      )}
      {paused && (
        <div className="absolute inset-0 bg-black/50 rounded-xl z-10 flex items-center justify-center">
          <motion.button
            onClick={onResume}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 shadow-lg hover:bg-indigo-700 transition-colors cursor-pointer"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <HiMiniPlay className="w-5 h-5" />
            Resume Game
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default WordSearchGrid;
