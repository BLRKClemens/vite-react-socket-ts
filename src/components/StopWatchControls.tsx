import type { Socket } from "socket.io-client";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from "../shared/socketEvents";

interface StopWatchControlsProps {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  stopwatchIndex: number;
}

export function StopWatchControls({
  socket,
  stopwatchIndex,
}: StopWatchControlsProps) {
  const handlePlay = () => {
    socket.emit("stopwatchPlay", stopwatchIndex);
  };

  const handlePause = () => {
    socket.emit("stopwatchPause", stopwatchIndex);
  };

  const handleStop = () => {
    socket.emit("stopwatchStop", stopwatchIndex);
  };

  return (
    <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
      <button
        onClick={handlePlay}
        style={{
          padding: "10px 20px",
          fontSize: "1rem",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        ▶️ Play
      </button>
      <button
        onClick={handlePause}
        style={{
          padding: "10px 20px",
          fontSize: "1rem",
          backgroundColor: "#FFC107",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        ⏸️ Pause
      </button>
      <button
        onClick={handleStop}
        style={{
          padding: "10px 20px",
          fontSize: "1rem",
          backgroundColor: "#f44336",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        ⏹️ Stop
      </button>
    </div>
  );
}
