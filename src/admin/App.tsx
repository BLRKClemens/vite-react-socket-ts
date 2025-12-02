import { socket } from "../shared/socket";
import { useSetupSocket } from "../shared/hooks/useSetupSocket";
import { GenericContextProvider } from "../shared/context/genericContext";
function App() {
  useSetupSocket(socket);

  return (
    <GenericContextProvider socket={socket}>
      <></>
    </GenericContextProvider>
  );
}

export default App;
