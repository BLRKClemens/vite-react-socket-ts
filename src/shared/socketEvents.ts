import type { Data, StopwatchData } from "./types";

export type ClientToServerEvents = {
  test: (testString: string) => void;
  stopwatchPlay: (index: number) => void;
  stopwatchPause: (index: number) => void;
  stopwatchStop: (index: number) => void;
  buzzerPressed: (buzzerIndex: number) => void;
};

export type ServerToClientEvents = {
  updateData: (data: Data) => void;
  updateStopwatch: (index: number, stopwatchData: StopwatchData) => void;
};
