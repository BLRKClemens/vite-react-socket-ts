import type { Socket } from "socket.io-client";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from "../shared/socketEvents";

interface StopWatchControlsAllProps {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
}

export function StopWatchControlsAll({ socket }: StopWatchControlsAllProps) {
  const handlePlayAll = () => {
    socket.emit("stopwatchPlay", 0);
    socket.emit("stopwatchPlay", 1);
  };

  const handlePauseAll = () => {
    socket.emit("stopwatchPause", 0);
    socket.emit("stopwatchPause", 1);
  };

  const handleStopAll = () => {
    socket.emit("stopwatchStop", 0);
    socket.emit("stopwatchStop", 1);
  };

  return (
    <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
      <button
        onClick={handlePlayAll}
        style={{
          padding: "10px 20px",
          fontSize: "1rem",
          backgroundColor: "#2196F3",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        ▶️▶️ Play All
      </button>
      <button
        onClick={handlePauseAll}
        style={{
          padding: "10px 20px",
          fontSize: "1rem",
          backgroundColor: "#FF9800",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        ⏸️⏸️ Pause All
      </button>
      <button
        onClick={handleStopAll}
        style={{
          padding: "10px 20px",
          fontSize: "1rem",
          backgroundColor: "#9C27B0",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        ⏹️⏹️ Stop All
      </button>
    </div>
  );
}
