import type { Data } from "./types";

export type ClientToServerEvents = {
  test: (testString: string) => void;
};

export type ServerToClientEvents = {
  updateData: (data: Data) => void;
};
