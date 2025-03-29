import { useAuthenticator } from "@aws-amplify/ui-react";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";

import { IAppMessage } from "@/components";

// Define the type for the user profile context
interface AppContextType {
  appMessages: IAppMessage[];
  addAppMessage: (message: Omit<IAppMessage, "id">) => void;
  deleteAppMessage: (messageId: string) => void;
}

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// UserProvider component
export const AppProvider = ({ children }: PropsWithChildren<{}>) => {
  const { user } = useAuthenticator((context) => [context.user]);
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

  useEffect(() => {
    if (user) {
      // TODO:
    }
  }, [user]);

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

// Export the useUser hook to access the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
