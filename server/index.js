import express from "express";
import http from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
const CLIENT_ORIGIN =
  "http://localhost:5174" || "https://gamezonevibes.vercel.app/";

const app = express();
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST"],
  },
});

const WINNING_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function checkWinner(board) {
  for (const [a, b, c] of WINNING_COMBOS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return board.every((cell) => cell !== null) ? "draw" : null;
}

function createInitialState() {
  return {
    board: Array(9).fill(null),
    currentPlayer: "X",
    winner: null,
    gameOver: false,
    scores: { x: 0, o: 0, draw: 0 },
  };
}

function randomMatchId() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}
const matches = new Map();

function getOrCreateMatch(matchId) {
  const existing = matches.get(matchId);
  if (existing) return existing;
  const match = {
    matchId,
    state: createInitialState(),
    players: { X: null, O: null },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  matches.set(matchId, match);
  return match;
}

function serializeMatch(match, mySymbol) {
  return {
    matchId: match.matchId,
    mySymbol,
    state: match.state,
    players: match.players,
  };
}

function assignSymbol(match, playerId) {
  // Rejoin
  if (match.players.X === playerId) return "X";
  if (match.players.O === playerId) return "O";

  // New join
  if (!match.players.X) {
    match.players.X = playerId;
    return "X";
  }
  if (!match.players.O) {
    match.players.O = playerId;
    return "O";
  }
  return null;
}

function emitState(matchId) {
  const match = matches.get(matchId);
  if (!match) return;
  io.to(matchId).emit("match:state", { state: match.state });
}

function endMatch(matchId, reason) {
  const match = matches.get(matchId);
  if (!match) return;
  io.to(matchId).emit("match:ended", { matchId, reason });
  matches.delete(matchId);
}

io.on("connection", (socket) => {
  socket.on("match:create", ({ playerId }, ack) => {
    try {
      if (!playerId) {
        ack?.({ ok: false, error: "playerId is required" });
        return;
      }

      const matchId = randomMatchId();
      const match = getOrCreateMatch(matchId);
      const mySymbol = assignSymbol(match, playerId);

      socket.join(matchId);
      match.updatedAt = Date.now();

      ack?.({ ok: true, ...serializeMatch(match, mySymbol) });
      emitState(matchId);
    } catch (e) {
      ack?.({ ok: false, error: "Failed to create match" });
    }
  });

  socket.on("match:end", ({ matchId, playerId, reason }, ack) => {
    try {
      const match = matches.get(matchId);
      if (!match) {
        ack?.({ ok: false, error: "Match not found" });
        return;
      }

      const isPlayer =
        match.players.X === playerId || match.players.O === playerId;
      if (!isPlayer) {
        ack?.({ ok: false, error: "Not a player in this match" });
        return;
      }

      endMatch(matchId, typeof reason === "string" ? reason : "ended");
      ack?.({ ok: true });
    } catch {
      ack?.({ ok: false, error: "Failed to end match" });
    }
  });

  socket.on("match:join", ({ matchId, playerId }, ack) => {
    try {
      if (!matchId || !playerId) {
        ack?.({ ok: false, error: "matchId and playerId are required" });
        return;
      }

      const match = matches.get(matchId);
      if (!match) {
        ack?.({ ok: false, error: "Match not found" });
        return;
      }

      const mySymbol = assignSymbol(match, playerId);
      if (!mySymbol) {
        ack?.({ ok: false, error: "Match is full" });
        return;
      }

      socket.join(matchId);
      match.updatedAt = Date.now();

      ack?.({ ok: true, ...serializeMatch(match, mySymbol) });
      emitState(matchId);
    } catch (e) {
      ack?.({ ok: false, error: "Failed to join match" });
    }
  });

  socket.on("match:move", ({ matchId, playerId, index }, ack) => {
    try {
      const match = matches.get(matchId);
      if (!match) {
        ack?.({ ok: false, error: "Match not found" });
        return;
      }

      const symbol =
        match.players.X === playerId
          ? "X"
          : match.players.O === playerId
          ? "O"
          : null;
      if (!symbol) {
        ack?.({ ok: false, error: "Not a player in this match" });
        return;
      }

      if (match.state.gameOver) {
        ack?.({ ok: false, error: "Game is over" });
        return;
      }

      if (typeof index !== "number" || index < 0 || index > 8) {
        ack?.({ ok: false, error: "Invalid move index" });
        return;
      }

      if (match.state.board[index] !== null) {
        ack?.({ ok: false, error: "Cell already occupied" });
        return;
      }

      if (match.state.currentPlayer !== symbol) {
        ack?.({ ok: false, error: "Not your turn" });
        return;
      }

      match.state.board[index] = symbol;

      const winner = checkWinner(match.state.board);
      match.state.winner = winner;
      match.state.gameOver = winner !== null;

      if (winner === "X") match.state.scores.x++;
      else if (winner === "O") match.state.scores.o++;
      else if (winner === "draw") match.state.scores.draw++;

      if (!match.state.gameOver) {
        match.state.currentPlayer =
          match.state.currentPlayer === "X" ? "O" : "X";
      }

      match.updatedAt = Date.now();

      emitState(matchId);
      ack?.({ ok: true });
    } catch (e) {
      ack?.({ ok: false, error: "Failed to make move" });
    }
  });

  socket.on("match:reset", ({ matchId, playerId }, ack) => {
    try {
      const match = matches.get(matchId);
      if (!match) {
        ack?.({ ok: false, error: "Match not found" });
        return;
      }

      const isPlayer =
        match.players.X === playerId || match.players.O === playerId;
      if (!isPlayer) {
        ack?.({ ok: false, error: "Not a player in this match" });
        return;
      }

      // Reset board only; keep scores (matches current UX of resetGame)
      match.state.board = Array(9).fill(null);
      match.state.currentPlayer = "X";
      match.state.winner = null;
      match.state.gameOver = false;

      match.updatedAt = Date.now();

      emitState(matchId);
      ack?.({ ok: true });
    } catch (e) {
      ack?.({ ok: false, error: "Failed to reset match" });
    }
  });

  socket.on("match:leave", ({ matchId, playerId, end }, ack) => {
    try {
      if (matchId) {
        socket.leave(matchId);
        if (end) {
          const match = matches.get(matchId);
          const isPlayer =
            !!match &&
            (match.players.X === playerId || match.players.O === playerId);
          if (isPlayer) endMatch(matchId, "left");
        }
      }
      ack?.({ ok: true });
    } catch {
      ack?.({ ok: false, error: "Failed to leave match" });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Socket server listening on http://localhost:${PORT}`);
  console.log(`CORS allowed origin: ${CLIENT_ORIGIN}`);
});
