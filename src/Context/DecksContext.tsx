import { useAuthenticator } from "@aws-amplify/ui-react";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { CreateDeckInput, Deck, UpdateDeckInput } from "@/API";
import { useApp } from "@/Context";
import {
  createDeckFn,
  deleteDeckFn,
  getAllDecksFn,
  updateDeckFn,
} from "@/Logic";

interface DecksContextType {
  allDecks: Deck[];
  userDecks: Deck[];
  decksLoading: boolean;
  createNewDeck: (newDeck: CreateDeckInput) => Promise<void>;
  updateExistingDeck: (updatedDeck: UpdateDeckInput) => Promise<void>;
  deleteDeckById: (deckId: string) => Promise<void>;
}

const DecksContext = createContext<DecksContextType | undefined>(undefined);

export const DecksProvider = ({ children }: PropsWithChildren<{}>) => {
  const { addAppMessage } = useApp();
  const { user } = useAuthenticator((context) => [context.user]);
  const [allDecks, setAllDecks] = useState<Deck[]>([]);
  const [userDecks, setUserDecks] = useState<Deck[]>([]);
  const [decksLoading, setDecksLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setDecksLoading(true);
      fetchDecks();
    }
  }, [user]);

  const fetchDecks = async () => {
    try {
      const decks = await getAllDecksFn();
      const allDecksResponse = decks ?? [];
      setAllDecks(allDecksResponse);
      setUserDecks(
        allDecksResponse.filter((deck) => deck.deckOwnerId === user.userId),
      );
    } catch (error) {
      addAppMessage({
        title: "failed to fetch deck list",
        content: "check console for more details",
        severity: "error",
      });
      setAllDecks([]);
      setUserDecks([]);
    } finally {
      setDecksLoading(false);
    }
  };

  const createNewDeck = async (newDeck: CreateDeckInput) => {
    const deck = await createDeckFn(newDeck);
    if (deck) {
      addAppMessage({
        content: `${deck.deckName} added to deck list`,
        severity: "success",
      });
      // Add the new deck to the state
      setAllDecks((prevDecks) => [...prevDecks, deck]);
      if (deck.deckOwnerId === user?.userId) {
        setUserDecks((prevDecks) => [...prevDecks, deck]);
      }
    } else {
      addAppMessage({
        title: "failed to add deck to deck list",
        content: "check console for more details",
        severity: "error",
      });
    }
  };

  const updateExistingDeck = async (updatedDeck: UpdateDeckInput) => {
    setDecksLoading(true);
    const updateDeckResponse = await updateDeckFn(updatedDeck);
    if (updateDeckResponse) {
      addAppMessage({
        content: `${updatedDeck.deckName} has been updated`,
        severity: "success",
      });
      // Add the updated deck to the state
      setAllDecks((prevDecks) =>
        prevDecks.map((d) =>
          d.id === updatedDeck.id ? updateDeckResponse : d,
        ),
      );
      if (updatedDeck.deckOwnerId === user?.userId) {
        setUserDecks((prevDecks) =>
          prevDecks.map((d) =>
            d.id === updatedDeck.id ? updateDeckResponse : d,
          ),
        );
      }
    } else {
      addAppMessage({
        title: `failed to update ${updatedDeck.deckName}`,
        content: "check console for more details",
        severity: "error",
      });
    }
    setDecksLoading(false);
  };

  const deleteDeckById = async (deckId: string) => {
    setDecksLoading(true);
    const success = await deleteDeckFn(deckId);
    if (success) {
      addAppMessage({
        content: "deck has been removed",
        severity: "info",
      });
      // Filter out the deleted deck from allDecks and userDecks
      setAllDecks((prevDecks) =>
        prevDecks.filter((deck) => deck.id !== deckId),
      );
      setUserDecks((prevDecks) =>
        prevDecks.filter((deck) => deck.id !== deckId),
      );
    } else {
      addAppMessage({
        title: "failed to remove deck",
        content: "check console for more details",
        severity: "error",
      });
    }
    setDecksLoading(false);
  };

  const value = useMemo(
    () => ({
      allDecks,
      userDecks,
      decksLoading,
      createNewDeck,
      updateExistingDeck,
      deleteDeckById,
    }),
    [allDecks, userDecks, decksLoading],
  );

  return (
    <DecksContext.Provider value={value}>{children}</DecksContext.Provider>
  );
};

export const useDecks = () => {
  const context = useContext(DecksContext);
  if (!context) {
    throw new Error("useDecks must be used within a DecksProvider");
  }
  return context;
};
