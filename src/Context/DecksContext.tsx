import { useAuthenticator } from "@aws-amplify/ui-react";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { CreateDecksInput, Decks, UpdateDecksInput } from "@/API";
import { useApp } from "@/Context";
import { createDeck, deleteDeck, getAllDecks, updateDeck } from "@/Logic";

interface DecksContextType {
  allDecks: Decks[];
  userDecks: Decks[];
  decksLoading: boolean;
  createNewDeck: (newDeck: CreateDecksInput) => Promise<void>;
  updateExistingDeck: (updatedDeck: UpdateDecksInput) => Promise<void>;
  deleteDeckById: (deckId: string) => Promise<void>;
}

const DecksContext = createContext<DecksContextType | undefined>(undefined);

export const DecksProvider = ({ children }: PropsWithChildren<{}>) => {
  const { addAppMessage } = useApp();
  const { user } = useAuthenticator((context) => [context.user]);
  const [allDecks, setAllDecks] = useState<Decks[]>([]);
  const [userDecks, setUserDecks] = useState<Decks[]>([]);
  const [decksLoading, setDecksLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setDecksLoading(true);
      fetchDecks();
    }
  }, [user]);

  const fetchDecks = async () => {
    try {
      const decks = await getAllDecks();
      const allDecksResponse = decks ?? [];
      setAllDecks(allDecksResponse);
      setUserDecks(
        allDecksResponse.filter((deck) => deck.deckOwnerID === user.userId),
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

  const createNewDeck = async (newDeck: CreateDecksInput) => {
    const deck = await createDeck(newDeck);
    if (deck) {
      addAppMessage({
        content: `${deck.deckName} added to deck list`,
        severity: "success",
      });
      // Add the new deck to the state
      setAllDecks((prevDecks) => [...prevDecks, deck]);
      if (deck.deckOwnerID === user?.userId) {
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

  const updateExistingDeck = async (updatedDeck: UpdateDecksInput) => {
    setDecksLoading(true);
    const updateDeckResponse = await updateDeck(updatedDeck);
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
      if (updatedDeck.deckOwnerID === user?.userId) {
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
    const success = await deleteDeck(deckId);
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
