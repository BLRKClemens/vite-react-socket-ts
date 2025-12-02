import { createContext } from "react";
import { useData } from "../hooks/useData";
import type { Data } from "../types";

type GenericContextType = {
  data: Data;
  socket: any;
};
// create the context
export const GenericContext = createContext<GenericContextType>(
  {} as GenericContextType
);

// provider that receives socket as a prop
export const GenericContextProvider = ({ socket, children }: any) => {
  const data = useData(socket);
  return (
    <GenericContext.Provider value={{ data, socket }}>
      {children}
    </GenericContext.Provider>
  );
};
