import React, { useEffect, useState } from "react";
import Box from "./Box";
import Line from "./Line";
import { motion } from "framer-motion";
import { getSpacing } from "../../lib/utils";

type GameBoardProps = {
  gridSize: number;
  horizontalLines: boolean[][];
  verticalLines: boolean[][];
  boxes: (1 | 2 | null)[][];
  horizontalLineOwners: { [key: string]: number };
  verticalLineOwners: { [key: string]: number };
  onLineClick: (
    type: "horizontal" | "vertical",
    row: number,
    col: number
  ) => void;
  getPlayerColor: (player: number) => string;
  currentPlayer: number;
};

const GameBoard: React.FC<GameBoardProps> = ({
  gridSize,
  horizontalLines,
  verticalLines,
  boxes,
  horizontalLineOwners,
  verticalLineOwners,
  onLineClick,
  getPlayerColor,
  currentPlayer,
}) => {
  const isMobileScreen = window.innerWidth <= 640;
  const dotSize = isMobileScreen ? 1.5 : 2;

  const [isMobile, setIsMobile] = useState(isMobileScreen);
  const [spacing, setSpacing] = useState(getSpacing(gridSize, isMobile));

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
      setSpacing(getSpacing(gridSize, isMobile));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [gridSize, isMobile]);

  return (
    <motion.div
      className="relative bg-white p-4 rounded-xl shadow-lg border border-gray-200"
      style={{
        width: `${gridSize * spacing + 40}px`,
        minHeight: `${gridSize * spacing + 40}px`,
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {Array.from({ length: gridSize + 1 }).map((_, i) =>
        Array.from({ length: gridSize + 1 }).map((_, j) => (
          <React.Fragment key={`cell-${i}-${j}`}>
            {/* Dot */}
            <div
              className="absolute bg-gray-800 rounded-full shadow-sm"
              style={{
                width: `${dotSize * 4}px`,
                height: `${dotSize * 4}px`,
                left: `${j * spacing + 20}px`,
                top: `${i * spacing + 20}px`,
                transform: "translate(-50%, -50%)",
                zIndex: 10,
              }}
            />

            {/* Horizontal Line */}
            {j < gridSize && (
              <Line
                type="horizontal"
                row={i}
                col={j}
                spacing={spacing}
                isDrawn={horizontalLines[i]?.[j]}
                lineOwner={horizontalLineOwners[`${i}-${j}`]}
                onClick={onLineClick}
                getPlayerColor={getPlayerColor}
                currentPlayer={currentPlayer}
              />
            )}

            {/* Vertical Line */}
            {i < gridSize && (
              <Line
                type="vertical"
                row={i}
                col={j}
                spacing={spacing}
                isDrawn={verticalLines[i]?.[j]}
                lineOwner={verticalLineOwners[`${i}-${j}`]}
                onClick={onLineClick}
                getPlayerColor={getPlayerColor}
                currentPlayer={currentPlayer}
              />
            )}

            {/* Box */}
            {i < gridSize && j < gridSize && (
              <Box
                row={i}
                col={j}
                spacing={spacing}
                owner={boxes[i][j]}
                getPlayerColor={getPlayerColor}
              />
            )}
          </React.Fragment>
        ))
      )}
    </motion.div>
  );
};

export default GameBoard;
