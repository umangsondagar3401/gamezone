import { io, Socket } from "socket.io-client";
import type { Player } from "../types/tictactoe";

export type ServerStatePayload = {
  board: Player[];
  currentPlayer: Player;
  winner: Player | "draw" | null;
  gameOver: boolean;
  scores: {
    x: number;
    o: number;
    draw: number;
  };
};

export type CreateMatchAck =
  | {
      ok: true;
      matchId: string;
      mySymbol: "X" | "O";
      state: ServerStatePayload;
    }
  | {
      ok: false;
      error: string;
    };

export type JoinMatchAck =
  | {
      ok: true;
      matchId: string;
      mySymbol: "X" | "O";
      state: ServerStatePayload;
    }
  | {
      ok: false;
      error: string;
    };

export type BasicAck =
  | {
      ok: true;
    }
  | {
      ok: false;
      error: string;
    };

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (socket) return socket;

  const url = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

  socket = io(url, {
    transports: ["websocket"],
    autoConnect: true,
  });

  return socket;
}

export function disconnectSocket() {
  if (!socket) return;
  socket.disconnect();
  socket = null;
}
