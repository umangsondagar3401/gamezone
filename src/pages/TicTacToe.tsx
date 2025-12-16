import { useEffect, useState } from "react";
import {
  makeMove,
  resetGame,
  setGameMode,
  computerMove,
  applyServerState,
  setOnlineConnected,
  setOnlineSession,
  clearOnlineSession,
} from "../store/tictactoeSlice";
import type { RootState } from "../store/store";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { ticTacToeWinningCombinations } from "../lib/utils";
import ConfettiCannon from "../components/Common/ConfettiCannon";
import SymbolSelection from "../components/TicTacToe/SymbolSelection";
import GameModeSelection from "../components/TicTacToe/GameModeSelection";
import { fadeInDown } from "../animation/CommonVariants";
import {
  disconnectSocket,
  getSocket,
  type CreateMatchAck,
  type JoinMatchAck,
  type ServerStatePayload,
} from "../lib/tictactoeOnlineSocket";
import { BiCheck, BiSolidCopy } from "react-icons/bi";

const TicTacToe = () => {
  const dispatch = useDispatch();
  const {
    board,
    winner,
    scores,
    gameMode,
    gameOver,
    playerSymbol,
    currentPlayer,
    onlineMatchCode,
    onlinePlayerId,
    onlineMySymbol,
    onlineConnected,
  } = useSelector((state: RootState) => state.tictactoe);
  const [showSymbolSelection, setShowSymbolSelection] = useState(false);
  const [joinMatchId, setJoinMatchId] = useState("");
  const [onlineError, setOnlineError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const isOnline = gameMode === "online";
  const isMyTurnOnline =
    isOnline && onlineMySymbol && currentPlayer === onlineMySymbol;

  const getOrCreatePlayerId = () => {
    const key = "ttt:playerId";
    const existing = localStorage.getItem(key);
    if (existing) return existing;
    const next =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);
    localStorage.setItem(key, next);
    return next;
  };

  // 1. Handle computer's move
  useEffect(() => {
    if (
      gameMode === "computer" &&
      playerSymbol &&
      currentPlayer !== playerSymbol &&
      !gameOver
    ) {
      const timer = setTimeout(() => {
        dispatch(computerMove());
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameMode, gameOver, dispatch, playerSymbol]);

  // 2. Handle auto-rejoin if matchId exists in localStorage
  useEffect(() => {
    const storedMatchId = localStorage.getItem("ttt:matchId");
    if (!storedMatchId) return;
    if (gameMode) return;
    dispatch(setGameMode("online"));
  }, [dispatch, gameMode]);

  // 3. NEW: Force clear inputs when Game Mode changes
  // This ensures inputs are cleared for the opponent when the match ends
  useEffect(() => {
    if (gameMode !== "online") {
      setJoinMatchId("");
      setOnlineError(null);
    }
  }, [gameMode]);

  // 4. Handle Socket Connections and Events
  useEffect(() => {
    if (!isOnline) return;

    const socket = getSocket();

    const onConnect = () => {
      dispatch(setOnlineConnected(true));
    };

    const onDisconnect = () => {
      dispatch(setOnlineConnected(false));
    };

    const onState = (payload: { state: ServerStatePayload }) => {
      if (!payload?.state) return;
      dispatch(applyServerState(payload.state));
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("match:state", onState);

    const onEnded = () => {
      localStorage.removeItem("ttt:matchId");
      dispatch(clearOnlineSession());
      dispatch(setGameMode(null));
      // Note: setJoinMatchId("") is now handled by the useEffect above
      // effectively guaranteeing it clears when setGameMode(null) runs.
    };

    socket.on("match:ended", onEnded);

    if (socket.connected) dispatch(setOnlineConnected(true));

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("match:state", onState);
      socket.off("match:ended", onEnded);
      dispatch(setOnlineConnected(false));
      disconnectSocket();
    };
  }, [dispatch, isOnline]);

  // 5. Handle cleanup when component unmounts or match ends
  useEffect(() => {
    return () => {
      const storedMatchId = localStorage.getItem("ttt:matchId");
      if (
        isOnline &&
        onlineMatchCode &&
        onlinePlayerId &&
        storedMatchId === onlineMatchCode
      ) {
        const socket = getSocket();
        socket.emit("match:end", {
          matchId: onlineMatchCode,
          playerId: onlinePlayerId,
          reason: "left",
        });
        localStorage.removeItem("ttt:matchId");
      }
    };
  }, [isOnline, onlineMatchCode, onlinePlayerId]);

  // 6. Handle joining a match automatically if logic dictates
  useEffect(() => {
    if (!isOnline) return;
    if (!onlineConnected) return;
    if (onlineMatchCode && onlinePlayerId && onlineMySymbol) return;

    const storedMatchId = localStorage.getItem("ttt:matchId");
    if (!storedMatchId) return;

    const playerId = getOrCreatePlayerId();
    const socket = getSocket();

    socket.emit(
      "match:join",
      { matchId: storedMatchId, playerId },
      (ack: JoinMatchAck) => {
        if (!ack?.ok) {
          setOnlineError(ack?.error || "Failed to rejoin match");
          localStorage.removeItem("ttt:matchId");
          dispatch(clearOnlineSession());
          return;
        }

        localStorage.setItem("ttt:matchId", ack.matchId);
        dispatch(
          setOnlineSession({
            matchId: ack.matchId,
            playerId,
            mySymbol: ack.mySymbol,
          })
        );
        dispatch(applyServerState(ack.state));
        setOnlineError(null);
      }
    );
  }, [
    dispatch,
    isOnline,
    onlineConnected,
    onlineMatchCode,
    onlineMySymbol,
    onlinePlayerId,
  ]);

  const handleCellClick = (index: number) => {
    if (isOnline) {
      if (!onlineMatchCode || !onlinePlayerId || !onlineConnected) return;
      if (!isMyTurnOnline) return;
      if (board[index] !== null || gameOver) return;
      const socket = getSocket();
      socket.emit("match:move", {
        matchId: onlineMatchCode,
        playerId: onlinePlayerId,
        index,
      });
      return;
    }
    if (
      gameMode === "computer" &&
      playerSymbol &&
      currentPlayer !== playerSymbol
    )
      return;
    if (board[index] !== null || gameOver) return;
    dispatch(makeMove(index));
  };

  const resetCurrentGame = () => {
    if (isOnline) {
      if (!onlineMatchCode || !onlinePlayerId || !onlineConnected) return;
      const socket = getSocket();
      socket.emit("match:reset", {
        matchId: onlineMatchCode,
        playerId: onlinePlayerId,
      });
      return;
    }
    dispatch(resetGame());
  };

  const createOnlineMatch = () => {
    const playerId = getOrCreatePlayerId();
    const socket = getSocket();

    socket.emit("match:create", { playerId }, (ack: CreateMatchAck) => {
      if (!ack?.ok) {
        setOnlineError(ack?.error || "Failed to create match");
        return;
      }

      localStorage.setItem("ttt:matchId", ack.matchId);
      dispatch(
        setOnlineSession({
          matchId: ack.matchId,
          playerId,
          mySymbol: ack.mySymbol,
        })
      );
      dispatch(applyServerState(ack.state));
      setOnlineError(null);
    });
  };

  const joinOnlineMatch = () => {
    const matchId = joinMatchId.trim().toUpperCase();
    if (!matchId) return;

    const playerId = getOrCreatePlayerId();
    const socket = getSocket();

    socket.emit("match:join", { matchId, playerId }, (ack: JoinMatchAck) => {
      if (!ack?.ok) {
        setOnlineError(ack?.error || "Failed to join match");
        return;
      }

      localStorage.setItem("ttt:matchId", ack.matchId);
      dispatch(
        setOnlineSession({
          matchId: ack.matchId,
          playerId,
          mySymbol: ack.mySymbol,
        })
      );
      dispatch(applyServerState(ack.state));
      setOnlineError(null);
    });
  };

  const endOnlineMatch = (reason: string) => {
    if (onlineMatchCode && onlinePlayerId && onlineConnected) {
      const socket = getSocket();
      socket.emit("match:end", {
        matchId: onlineMatchCode,
        playerId: onlinePlayerId,
        reason,
      });
    }
    localStorage.removeItem("ttt:matchId");
    dispatch(clearOnlineSession());
  };

  const leaveOnlineMatch = () => {
    // We don't strictly need this here anymore because the useEffect handles it,
    // but it's safe to keep for immediate feedback.
    setJoinMatchId("");
    endOnlineMatch("left");
  };

  const handleCopyCode = async () => {
    if (!onlineMatchCode) return;

    let copied = false;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(onlineMatchCode);
        copied = true;
      }
    } catch {
      void 0;
    }

    if (!copied) {
      try {
        const el = document.createElement("textarea");
        el.value = onlineMatchCode;
        el.setAttribute("readonly", "");
        el.style.position = "fixed";
        el.style.opacity = "0";
        document.body.appendChild(el);
        el.focus();
        el.select();
        copied = document.execCommand("copy");
        document.body.removeChild(el);
      } catch {
        void 0;
      }
    }

    if (copied) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const renderCell = (index: number) => {
    const isWinningCell =
      winner &&
      winner !== "draw" &&
      ticTacToeWinningCombinations.some(
        (combo) =>
          combo.includes(index) &&
          board[combo[0]] === winner &&
          board[combo[1]] === winner &&
          board[combo[2]] === winner
      );

    return (
      <motion.div
        key={index}
        onClick={() => handleCellClick(index)}
        whileTap={!board[index] && !gameOver ? { scale: 0.95 } : {}}
        whileHover={!board[index] && !gameOver ? { scale: 1.05 } : {}}
        className={`h-24 flex items-center justify-center text-4xl font-bold rounded-lg cursor-pointer transition-colors ${
          isWinningCell ? "bg-green-200" : "bg-gray-100 hover:bg-gray-200"
        }`}
      >
        <AnimatePresence>
          {board[index] && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`${
                board[index] === "X" ? "text-blue-600" : "text-red-600"
              }`}
            >
              {board[index]}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const renderGameBoard = () => (
    <>
      {winner && winner !== "draw" && <ConfettiCannon trigger={true} />}

      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">
            {gameMode === "computer"
              ? `Playing as ${playerSymbol} (vs Computer)`
              : gameMode === "online"
              ? `Play Online with Friend${
                  onlineMySymbol ? ` (You: ${onlineMySymbol})` : ""
                }`
              : "Play with Friend"}
          </h2>
          {isOnline && onlineMatchCode && (
            <div className="mb-3">
              <div className="text-sm text-gray-600">Match Code</div>
              <div className="flex items-center justify-center gap-2">
                <div className="font-mono font-bold tracking-widest">
                  {onlineMatchCode}
                </div>
                <motion.button
                  onClick={handleCopyCode}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                  aria-label="Copy Match Code"
                  className="cursor-pointer mb-0.5 p-1 rounded-full hover:bg-gray-100 outline-none"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {isCopied ? (
                      <motion.div
                        key="check"
                        className="text-green-500"
                        transition={{ duration: 0.2 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        initial={{ opacity: 0, scale: 0.5 }}
                      >
                        <BiCheck size={18} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="copy"
                        className="text-gray-600"
                        transition={{ duration: 0.2 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        initial={{ opacity: 0, scale: 0.5 }}
                      >
                        <BiSolidCopy size={18} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {onlineConnected ? "Connected" : "Disconnected"}
              </div>
            </div>
          )}
          <div className="flex justify-center gap-8 mb-4">
            <div className="text-blue-600 font-medium">
              Player X: {scores.x}
            </div>
            <div className="text-gray-600 font-medium">Draw: {scores.draw}</div>
            <div className="text-red-600 font-medium">Player O: {scores.o}</div>
          </div>
          <div className="text-lg mb-4">
            {!gameOver ? (
              <span>
                Current Turn:{" "}
                <span
                  className={`font-bold ${
                    currentPlayer === "X" ? "text-blue-600" : "text-red-600"
                  }`}
                >
                  {currentPlayer}
                </span>
              </span>
            ) : (
              <span className="font-bold">
                {winner === "draw" ? "It's a draw!" : `Player ${winner} wins!`}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6 bg-gray-300 p-3 rounded-lg">
          {Array(9)
            .fill(null)
            .map((_, index) => renderCell(index))}
        </div>

        <div className="flex justify-center items-center flex-wrap gap-x-5 gap-y-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={resetCurrentGame}
            whileHover={{ scale: 1.05 }}
            disabled={board?.every((cell) => cell === null)}
            className="px-6 py-2 bg-purple-500 text-white rounded-lg font-medium cursor-pointer disabled:bg-gray-500 min-w-[150px]"
          >
            {gameOver ? "Play Again" : "Reset Game"}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium cursor-pointer min-w-[150px]"
            onClick={() => {
              if (isOnline) endOnlineMatch("change_mode");
              dispatch(setGameMode(null));
              dispatch(resetGame());
              leaveOnlineMatch();
            }}
          >
            Change Mode
          </motion.button>
        </div>
      </motion.div>
    </>
  );

  const renderOnlineLobby = () => (
    <motion.div
      className="text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-2xl font-bold mb-2">Play Online with Friend</h2>
      <div className="text-sm text-gray-600 mb-3">
        {onlineConnected ? "Connected" : "Connecting..."}
      </div>

      {onlineError && (
        <div className="text-sm text-red-600 mb-4">{onlineError}</div>
      )}

      <div className="flex flex-col gap-3 items-center">
        <motion.button
          whileTap={{ scale: 0.98 }}
          disabled={!onlineConnected}
          onClick={createOnlineMatch}
          whileHover={{ scale: 1.05 }}
          className="px-8 py-3 bg-purple-600 text-white rounded-xl font-medium cursor-pointer min-w-[240px] disabled:bg-gray-400"
        >
          Create Match
        </motion.button>

        <div className="text-gray-500 text-sm">or</div>

        <input
          value={joinMatchId}
          placeholder="Enter Code"
          onChange={(e) => setJoinMatchId(e.target.value)}
          className="w-full max-w-[240px] px-4 py-2 border rounded-lg outline-none"
        />
        <motion.button
          onClick={joinOnlineMatch}
          whileTap={{ scale: 0.98 }}
          disabled={!onlineConnected}
          whileHover={{ scale: 1.05 }}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium cursor-pointer min-w-[240px] disabled:bg-gray-400"
        >
          Join Match
        </motion.button>
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        className="mt-6 px-4 py-2 text-gray-600 hover:text-gray-800 cursor-pointer"
        onClick={() => {
          leaveOnlineMatch();
          dispatch(setGameMode(null));
        }}
      >
        ← Back to Game Modes
      </motion.button>
    </motion.div>
  );

  return (
    <div className="flex flex-col items-center justify-center">
      <motion.h1
        custom={0.2}
        animate="show"
        initial="hidden"
        variants={fadeInDown}
        className="text-4xl sm:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
      >
        Tic Tac Toe
      </motion.h1>

      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <AnimatePresence mode="wait">
          {!gameMode ? (
            <GameModeSelection
              setShowSymbolSelection={setShowSymbolSelection}
            />
          ) : showSymbolSelection ? (
            <SymbolSelection setShowSymbolSelection={setShowSymbolSelection} />
          ) : gameMode === "online" && !onlineMatchCode ? (
            renderOnlineLobby()
          ) : (
            renderGameBoard()
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TicTacToe;
