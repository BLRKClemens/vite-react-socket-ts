import { useEffect, useState, useRef } from "react";
import type { Socket } from "socket.io-client";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from "../shared/socketEvents";

import { AnimatePresence, motion } from "motion/react";
import { div } from "motion/react-client";

interface StopWatchProps {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  stopwatchIndex: number;
  stopwatchStyle?: React.CSSProperties;
}

export function StopWatch({
  socket,
  stopwatchIndex,
  stopwatchStyle,
}: StopWatchProps) {
  const [milliseconds, setMilliseconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Track both stopwatches for difference calculation
  const [stopwatch0, setStopwatch0] = useState({
    milliseconds: 0,
    isRunning: false,
  });
  const [stopwatch1, setStopwatch1] = useState({
    milliseconds: 0,
    isRunning: false,
  });

  useEffect(() => {
    const handleUpdateStopwatch = (index: number, stopwatchData: any) => {
      // Update the state for both stopwatches
      if (index === 0) {
        setStopwatch0({
          milliseconds: stopwatchData.milliseconds,
          isRunning: stopwatchData.isRunning,
        });
      } else if (index === 1) {
        setStopwatch1({
          milliseconds: stopwatchData.milliseconds,
          isRunning: stopwatchData.isRunning,
        });
      }

      if (index !== stopwatchIndex) return; // Only update display if it's our stopwatch

      setMilliseconds(stopwatchData.milliseconds);
      setIsRunning(stopwatchData.isRunning);

      if (stopwatchData.isRunning && stopwatchData.startTime) {
        startTimeRef.current = stopwatchData.startTime;
      } else {
        startTimeRef.current = null;
      }
    };

    socket.on("updateStopwatch", handleUpdateStopwatch);
    socket.on("updateData", (data) => {
      handleUpdateStopwatch(0, data.stopwatches[0]);
      handleUpdateStopwatch(1, data.stopwatches[1]);
    });

    return () => {
      socket.off("updateStopwatch");
      socket.off("updateData");
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [socket, stopwatchIndex]);

  useEffect(() => {
    if (!isRunning) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const updateFrame = () => {
      if (startTimeRef.current !== null) {
        const elapsed = Date.now() - startTimeRef.current;
        setMilliseconds(elapsed);
        animationFrameRef.current = requestAnimationFrame(updateFrame);
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateFrame);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const displayMs = Math.floor((ms % 1000) / 10); // Convert to centiseconds (0-99)

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(displayMs).padStart(2, "0")}`;
  };

  // Calculate if we should show the difference
  const bothPaused = !stopwatch0.isRunning && !stopwatch1.isRunning;
  const timeDifference = Math.abs(
    stopwatch0.milliseconds - stopwatch1.milliseconds,
  );
  const isLater =
    stopwatchIndex === 0
      ? stopwatch0.milliseconds > stopwatch1.milliseconds
      : stopwatch1.milliseconds > stopwatch0.milliseconds;
  const showDifference = bothPaused && isLater && timeDifference > 10;

  return (
    <div style={{ ...stopwatchStyle }}>
      <div style={{ position: "relative" }}>
        <div
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            fontFamily: "monospace",
          }}
        >
          {formatTime(milliseconds)}
        </div>
        <AnimatePresence>
          {showDifference && (
            <motion.div
              initial={{ opacity: 0, transform: "translateX(-200px)" }}
              animate={{ opacity: 1, transform: "translateX(0)" }}
              exit={{ opacity: 0, transform: "translateX(-200px)" }}
              transition={{ duration: 0.5 }}
              style={{
                fontSize: "1.2rem",
                fontFamily: "monospace",
                color: "#FF5722",
                marginTop: "5px",
                position: "absolute",
                top: "30px",
                left: "45px",
              }}
            >
              +{formatTime(timeDifference)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
