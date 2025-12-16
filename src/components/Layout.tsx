import React from "react";
import SEO from "./SEO";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getPageSeo } from "../lib/seoUtils";
import { HiMiniArrowLeft } from "react-icons/hi2";
import { fadeInDown } from "../animation/CommonVariants";
import { resetGame as resetGame2048 } from "../store/game2048Slice";
import { resetGame as resetGameSudoku } from "../store/sudokuSlice";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { resetGame as resetMemoryMatch } from "../store/memorymatchSlice";
import { backToHome as resetGameTicTacToe } from "../store/tictactoeSlice";
import { resetGame as resetGameWordSearch } from "../store/wordSearchSlice";
import { resetGame as resetGameDotAndBoxes } from "../store/dotsAndBoxesSlice";
import { backToHome as resetGameSlidingPuzzle } from "../store/slidingPuzzleSlice";
import { resetGame as resetRockPaperScissors } from "../store/rockpaperscissorsSlice";
import type { RootState } from "../store/store";
import { getSocket } from "../lib/tictactoeOnlineSocket";

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const ttt = useSelector((state: RootState) => state.tictactoe);
  const { title, description, keywords } = getPageSeo(location.pathname);

  const routeActions: Record<string, () => void> = {
    "/tic-tac-toe": () => dispatch(resetGameTicTacToe()),
    "/memory-match": () => dispatch(resetMemoryMatch()),
    "/rock-paper-scissors": () => dispatch(resetRockPaperScissors()),
    "/2048": () => dispatch(resetGame2048()),
    "/word-search": () => dispatch(resetGameWordSearch()),
    "/sliding-puzzle": () => dispatch(resetGameSlidingPuzzle()),
    "/sudoku": () => dispatch(resetGameSudoku()),
    "/dots-and-boxes": () => dispatch(resetGameDotAndBoxes()),
  };

  const handleBackToHome = () => {
    if (
      location.pathname === "/tic-tac-toe" &&
      ttt.gameMode === "online" &&
      ttt.onlineMatchCode &&
      ttt.onlinePlayerId
    ) {
      const socket = getSocket();
      socket.emit("match:end", {
        matchId: ttt.onlineMatchCode,
        playerId: ttt.onlinePlayerId,
        reason: "home",
      });
      localStorage.removeItem("ttt:matchId");
    }

    navigate("/");

    routeActions[location.pathname]?.();
  };

  return (
    <>
      <SEO title={title} description={description} keywords={keywords} />
      <div className="flex flex-col gap-4 items-center justify-between p-4 md:p-8 bg-gray-50 min-h-screen">
        {location.pathname !== "/" && (
          <motion.button
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 cursor-pointer ml-3 mr-auto"
            onClick={handleBackToHome}
            initial="hidden"
            animate="show"
            variants={fadeInDown}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <HiMiniArrowLeft /> Back to home
          </motion.button>
        )}
        <main className="flex items-center justify-center flex-1 max-w-[1440px] w-full mx-auto">
          <div className="w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default Layout;
