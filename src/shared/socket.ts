import { io, Socket } from "socket.io-client";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "./socketEvents";

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  URL,
  { autoConnect: false },
);
