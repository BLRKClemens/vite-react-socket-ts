import { socket } from "../shared/socket";
import { useSetupSocket } from "../shared/hooks/useSetupSocket";
import { GenericContextProvider } from "../shared/context/genericContext";
import { StopWatch } from "../components/StopWatch";
import { StopWatchControls } from "../components/StopWatchControls";
import { StopWatchControlsAll } from "../components/StopWatchControlsAll";

function App() {
  useSetupSocket(socket);

  return (
    <GenericContextProvider socket={socket}>
      <div style={{ padding: "20px" }}>
        <h1>Stopwatch Left</h1>
        <StopWatch socket={socket} stopwatchIndex={0} />
        <StopWatchControls socket={socket} stopwatchIndex={0} />
        <h1>Stopwatch Right</h1>
        <StopWatch socket={socket} stopwatchIndex={1} />
        <StopWatchControls socket={socket} stopwatchIndex={1} />
        <h1>All Stopwatches</h1>
        <StopWatchControlsAll socket={socket}></StopWatchControlsAll>
      </div>
    </GenericContextProvider>
  );
}

export default App;
