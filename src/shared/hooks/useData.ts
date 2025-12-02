import { useState, useEffect } from "react";
import type { Data } from "../types";

export function useData(socket: any) {
  const [data, setData] = useState<Data>({});

  useEffect(() => {
    socket.on("updateData", (newData: Data) => {
      setData(newData);
    });

    return () => socket.off("updateData");
  }, []);

  return data;
}
