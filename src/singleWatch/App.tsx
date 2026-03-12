import { socket } from "../shared/socket";
import { useSetupSocket } from "../shared/hooks/useSetupSocket";
import { GenericContextProvider } from "../shared/context/genericContext";
import { StopWatch } from "../components/StopWatch";
import { useQueryState, parseAsInteger } from "nuqs";

function App() {
  useSetupSocket(socket);
  const [stopwatchIndex, setStopwatchIndex] = useQueryState(
    "stopwatch",
    parseAsInteger.withDefault(0),
  );
  return (
    <GenericContextProvider socket={socket}>
      <div className="w-screen h-screen overflow-hidden flex justify-center items-center">
        <StopWatch
          socket={socket}
          stopwatchIndex={stopwatchIndex}
          stopwatchStyle={{ position: "absolute", zoom: "1200%" }}
        ></StopWatch>
      </div>
    </GenericContextProvider>
  );
}

export default App;
