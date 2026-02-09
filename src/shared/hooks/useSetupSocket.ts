import { useEffect } from "react";
import type { Socket } from "socket.io-client";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from "../socketEvents";
export function useSetupSocket(
  socket: Socket<ServerToClientEvents, ClientToServerEvents>,
) {
  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);
}
