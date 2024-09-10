import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CreateDeckInput,
  Deck,
  DeckCategory,
  UpdateDeckInput,
  User,
} from "@/API";
import { useApp, useTheme, useUser } from "@/Context";
import {
  createDeckFn,
  deleteDeckFn,
  getAllDecksCategoriesFn,
  getAllDecksFn,
  updateDeckFn,
} from "@/Logic";

interface DecksContextType {
  allDecks: Deck[];
  allDeckCategories: DeckCategory[];
  userDecks: Deck[];
  decksLoading: boolean;
  deckToUserMap: Map<string, User>;
  getDeckUserColor: (deckId: string) => string;
  createNewDeck: (newDeck: CreateDeckInput) => Promise<void>;
  updateExistingDeck: (updatedDeck: UpdateDeckInput) => Promise<void>;
  deleteDeckById: (deckId: string) => Promise<void>;
}

const DecksContext = createContext<DecksContextType | undefined>(undefined);

export const DeckProvider = ({ children }: PropsWithChildren<{}>) => {
  const { addAppMessage } = useApp();
  const { mode } = useTheme();
  const { authenticatedUser, allUserProfiles } = useUser();

  const [allDecks, setAllDecks] = useState<Deck[]>([]);
  const [allDeckCategories, setAllDeckCategories] = useState<DeckCategory[]>(
    [],
  );
  const [userDecks, setUserDecks] = useState<Deck[]>([]);
  const [decksLoading, setDecksLoading] = useState(true);
  const [deckToUserMap, setDeckToUserMap] = useState(new Map<string, User>());

  useEffect(() => {
    if (authenticatedUser) {
      setDecksLoading(true);
      fetchDecks();
      fetchDeckCategories();
    } else {
      setDecksLoading(false);
    }
  }, [authenticatedUser]);

  useEffect(() => {
    const map = new Map<string, User>();
    allDecks.forEach((deck) => {
      const user = allUserProfiles.find((user) => user.id === deck.deckOwnerId);
      if (user) {
        map.set(deck.id, user);
      }
    });
    setDeckToUserMap(map);
  }, [allDecks, allUserProfiles]);

  const fetchDecks = async () => {
    try {
      const decks = await getAllDecksFn();
      const allDecksResponse = decks ?? [];
      setAllDecks(allDecksResponse);
      setUserDecks(
        allDecksResponse.filter(
          (deck) => deck.deckOwnerId === authenticatedUser?.userId,
        ),
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

  const fetchDeckCategories = async () => {
    try {
      const deckCategories = await getAllDecksCategoriesFn();
      const allDeckCategoriesResponse = deckCategories ?? [];
      setAllDeckCategories(allDeckCategoriesResponse);
    } catch (error) {
      addAppMessage({
        title: "failed to fetch deck category list",
        content: "check console for more details",
        severity: "error",
      });
      setAllDeckCategories([]);
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
      if (deck.deckOwnerId === authenticatedUser?.userId) {
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
      // Update the state with the updated deck
      setAllDecks((prevDecks) =>
        prevDecks.map((d) =>
          d.id === updatedDeck.id ? updateDeckResponse : d,
        ),
      );
      if (updatedDeck.deckOwnerId === authenticatedUser?.userId) {
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

  const getDeckUserColor = useMemo(
    () => (deckId: string) => {
      const deckUser = deckToUserMap.get(deckId);
      if (!deckUser) {
        return "inherit";
      }
      return mode === "light"
        ? deckUser.lightThemeColor ?? "inherit"
        : deckUser.darkThemeColor ?? "inherit";
    },
    [deckToUserMap, mode],
  );

  const value = useMemo(
    () => ({
      allDecks,
      allDeckCategories,
      getDeckUserColor,
      userDecks,
      deckToUserMap,
      decksLoading,
      createNewDeck,
      updateExistingDeck,
      deleteDeckById,
    }),
    [
      allDecks,
      allDeckCategories,
      userDecks,
      decksLoading,
      deckToUserMap,
      getDeckUserColor,
    ],
  );

  return (
    <DecksContext.Provider value={value}>{children}</DecksContext.Provider>
  );
};

export const useDeck = () => {
  const context = useContext(DecksContext);
  if (!context) {
    throw new Error("useDeck must be used within a DeckProvider");
  }
  return context;
};
