import { useState, useEffect } from "react";
import type { Data } from "../types";
import type { Socket } from "socket.io-client";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from "../socketEvents";

export function useData(
  socket: Socket<ServerToClientEvents, ClientToServerEvents>,
) {
  const [data, setData] = useState<Data>({} as Data);

  useEffect(() => {
    socket.on("updateData", (newData: Data) => {
      setData(newData);
    });

    return () => {
      socket.off("updateData");
    };
  }, []);

  return data;
}
