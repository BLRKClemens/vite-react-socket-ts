import { useEffect } from "react";
export function useSetupSocket(socket: any) {
  useEffect(() => {
    socket.connect();
    return () => socket.disconnect();
  }, []);
}
