export type StopwatchData = {
  milliseconds: number;
  isRunning: boolean;
  startTime?: number; // Timestamp when stopwatch was started (in ms)
  serverTime?: number; // Server time for synchronization
};

export type Data = {
  counter: number;
  stopwatches: [StopwatchData, StopwatchData]; // Two stopwatches
};
