import { PropsWithChildren, createContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { IAppMessage } from "@/components";

interface AppContextType {
  appMessages: IAppMessage[];
  addAppMessage: (message: Omit<IAppMessage, "id">) => void;
  deleteAppMessage: (messageId: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: PropsWithChildren<{}>) => {
  const [appMessages, setAppMessages] = useState<IAppMessage[]>([]);

  const addAppMessage = (message: Omit<IAppMessage, "id">) => {
    setAppMessages((prevState) => [
      ...prevState,
      {
        id: uuidv4(),
        ...message,
      },
    ]);
  };

  const deleteAppMessage = (messageId: string) => {
    setAppMessages((prevState) =>
      prevState.filter((message) => message.id !== messageId),
    );
  };

  return (
    <AppContext.Provider
      value={{
        appMessages,
        addAppMessage,
        deleteAppMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
