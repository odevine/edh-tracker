import { useAuthenticator } from "@aws-amplify/ui-react";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { Decks } from "@/API";
import { getAllDecks } from "@/Logic";

// Define the type for the user profile context
interface DecksContextType {
  allDecks: Decks[];
  userDecks: Decks[];
  decksLoading: boolean;
}

// Create the context
const DecksContext = createContext<DecksContextType | undefined>(undefined);

// UserProvider component
export const DecksProvider = (props: PropsWithChildren) => {
  const { user } = useAuthenticator((context) => [context.user]);
  const [allDecks, setAllDecks] = useState<Decks[]>([]);
  const [userDecks, setUserDecks] = useState<Decks[]>([]);
  const [decksLoading, setDecksLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      setDecksLoading(true);
      getAllDecks()
        .then((decks) => {
          const allDecksResponse = decks ?? [];
          setAllDecks(allDecksResponse);
          setUserDecks(
            allDecksResponse.filter((deck) => deck.deckOwnerID === user.userId),
          );
          setDecksLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch decks:", error);
          setAllDecks([]);
          setUserDecks([]);
          setDecksLoading(false);
        });
    }
  }, [user]);

  return (
    <DecksContext.Provider value={{ allDecks, userDecks, decksLoading }}>
      {props.children}
    </DecksContext.Provider>
  );
};

// Export the useDecks hook to access the context
export const useDecks = () => {
  const context = useContext(DecksContext);
  if (!context) {
    throw new Error("useDecks must be used within a DecksProvider");
  }
  return context;
};
