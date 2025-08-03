import { motion } from "framer-motion";
import { fadeInUp } from "../../animation/CommonVariants";

type ScoreboardProps = {
  scores: { player1: number; player2: number };
  currentPlayer: 1 | 2;
  gameMode: "computer" | "friend";
  gameOver: boolean;
  winner: 1 | 2 | "draw" | null;
};

const Scoreboard: React.FC<ScoreboardProps> = ({
  scores,
  currentPlayer,
  gameMode,
  gameOver,
  winner,
}) => {
  return (
    <div className="flex justify-center items-center bg-white p-4 rounded-lg shadow-md mb-6 gap-2 sm:gap-8">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="show"
        className={`text-lg font-semibold px-4 py-2 rounded-lg transition-colors flex flex-col justify-center items-center gap-1 ${
          currentPlayer === 1
            ? "bg-blue-100 text-blue-700 shadow-inner"
            : "text-gray-600"
        }`}
      >
        <span>Player 1</span>
        <span className="font-bold">{scores.player1}</span>
      </motion.div>

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="show"
        custom={0.3}
        className=" hidden sm:flex text-lg font-semibold px-4 py-2 min-w-32 bg-gray-100 rounded-lg text-gray-700 flex-col justify-center items-center gap-1"
      >
        {gameOver ? (
          winner === "draw" ? (
            <span className="text-yellow-600">It's a Draw!</span>
          ) : (
            <span className="font-bold text-green-600">
              {gameMode === "computer" && winner === 2
                ? "Computer Wins! 🎉"
                : `Player ${winner} Wins! 🎉`}
            </span>
          )
        ) : (
          <>
            <span className="text-gray-500">Turn: </span>
            <span
              className={`font-bold ${
                currentPlayer === 1 ? "text-blue-600" : "text-red-600"
              }`}
            >
              {gameMode === "computer" && currentPlayer === 2
                ? "Computer"
                : `Player ${currentPlayer}`}
            </span>
          </>
        )}
      </motion.div>

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="show"
        custom={0.4}
        className={`text-lg font-semibold px-4 py-2 rounded-lg transition-colors flex flex-col justify-center items-center gap-1 ${
          currentPlayer === 2
            ? "bg-red-100 text-red-700 shadow-inner"
            : "text-gray-600"
        }`}
      >
        <span>{gameMode === "friend" ? "Player 2" : "Computer"}</span>
        <span className="font-bold">{scores.player2}</span>
      </motion.div>
    </div>
  );
};

export default Scoreboard;
