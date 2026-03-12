import { socket } from "./shared/socket";
import { useSetupSocket } from "./shared/hooks/useSetupSocket";
import { GenericContextProvider } from "./shared/context/genericContext";
import { StopWatch } from "./components/StopWatch";

function App() {
  useSetupSocket(socket);

  return (
    <GenericContextProvider socket={socket}>
      <div style={{ padding: "20px" }}>
        <StopWatch
          socket={socket}
          stopwatchIndex={0}
          stopwatchStyle={{
            left: 0,
            top: 0,
            margin: "20px",
            position: "absolute",
          }}
        />
        <StopWatch
          socket={socket}
          stopwatchIndex={1}
          stopwatchStyle={{
            right: 0,
            top: 0,
            margin: "20px",
            position: "absolute",
          }}
        />
      </div>
    </GenericContextProvider>
  );
}

export default App;
