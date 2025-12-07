import { useState } from "react";
import { motion } from "framer-motion";

type LineProps = {
  type: "horizontal" | "vertical";
  row: number;
  col: number;
  isDrawn: boolean;
  lineOwner?: number;
  currentPlayer: number;
  onClick: (type: "horizontal" | "vertical", row: number, col: number) => void;
  getPlayerColor: (player: number) => string;
  spacing: number;
};

const Line: React.FC<LineProps> = ({
  type,
  row,
  col,
  isDrawn,
  lineOwner,
  currentPlayer,
  onClick,
  getPlayerColor,
  spacing,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const isHorizontal = type === "horizontal";

  // Visual line dimensions (kept small for appearance)
  const visualWidth = isHorizontal ? spacing : 3;
  const visualHeight = isHorizontal ? 3 : spacing;

  // Clickable area dimensions (larger for better UX)
  const clickableWidth = isHorizontal ? spacing : 25; // Increased from 3px to 25px
  const clickableHeight = isHorizontal ? 25 : spacing; // Increased from 3px to 25px

  // Calculate positions
  const left = col * spacing + 20;
  const top = row * spacing + 20;

  const playerColor =
    isDrawn && lineOwner !== undefined
      ? getPlayerColor(lineOwner)
      : getPlayerColor(2);

  return (
    <div
      className="absolute flex items-center justify-center"
      style={{
        width: `${clickableWidth}px`,
        height: `${clickableHeight}px`,
        left: `${left}px`,
        top: `${top}px`,
        transform: isHorizontal
          ? `translateY(-${Math.floor(clickableHeight / 2)}px)`
          : `translateX(-${Math.floor(clickableWidth / 2)}px)`,
        zIndex: 5,
        cursor: "pointer",
      }}
      onClick={() => !isDrawn && onClick(type, row, col)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className={`${!isDrawn ? "opacity-80" : ""}`}
        style={{
          width: `${visualWidth}px`,
          height: `${visualHeight}px`,
          borderRadius: "2px",
          backgroundColor: isDrawn
            ? playerColor
            : isHovered
            ? getPlayerColor(currentPlayer)
            : "var(--color-border-subtle)",
        }}
        initial={false}
      />
    </div>
  );
};

export default Line;
