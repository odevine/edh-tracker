import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren, createContext, useContext, useMemo } from "react";

import { useApp, useAuth, useTheme, useUser } from "@/context";
import { fetchWithAuth, matchesExactColors } from "@/logic";
import { CreateDeckInput, Deck, UpdateDeckInput, User } from "@/types";

interface DeckContextType {
  allDecks: Deck[];
  userDecks: Deck[];
  decksLoading: boolean;
  createNewDeck: (deck: CreateDeckInput) => Promise<void>;
  updateExistingDeck: (args: {
    deckId: string;
    input: UpdateDeckInput;
  }) => Promise<void>;
  deleteDeckById: (deckId: string) => Promise<void>;
  getDeckUserColor: (deckId: string) => string;
  getUserForDeck: (deckId: string) => User | undefined;
  getFilteredDecks: (filters: {
    includeInactive: boolean;
    filterUser: string;
    filterFormat: string;
    filterColor: string[];
  }) => Deck[];
}

const DeckContext = createContext<DeckContextType | undefined>(undefined);

export const DeckProvider = ({ children }: PropsWithChildren<{}>) => {
  const { userId, accessToken, isInitializing } = useAuth();
  const { addAppMessage } = useApp();
  const { allUserProfiles } = useUser();
  const { mode } = useTheme();
  const queryClient = useQueryClient();

  // fetch all decks
  const { data: allDecks = [], isLoading: decksLoading } = useQuery<Deck[]>({
    queryKey: ["decks"],
    queryFn: async () => {
      const res = await fetchWithAuth("/decks", accessToken);
      if (!res.ok) {
        throw new Error("failed to fetch decks");
      }
      return res.json();
    },
    enabled: !!accessToken && !isInitializing,
  });

  // find user's decks
  const userDecks = useMemo(() => {
    return allDecks.filter((deck) => deck.userId === userId);
  }, [allDecks, userId]);

  // create deck
  const { mutateAsync: createNewDeck } = useMutation({
    mutationFn: async (deck: CreateDeckInput) => {
      const res = await fetchWithAuth("/decks", accessToken, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deck),
      });
      if (!res.ok) {
        throw new Error("failed to create deck");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decks"] });
      addAppMessage({ content: "deck created", severity: "success" });
    },
    onError: () => {
      addAppMessage({
        title: "failed to create deck",
        content: "check console for more details",
        severity: "error",
      });
    },
  });

  // update deck
  const { mutateAsync: updateExistingDeck } = useMutation({
    mutationFn: async ({
      deckId,
      input,
    }: {
      deckId: string;
      input: UpdateDeckInput;
    }) => {
      const res = await fetchWithAuth(`/decks/${deckId}`, accessToken, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        throw new Error("failed to update deck");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decks"] });
      addAppMessage({ content: "deck updated", severity: "success" });
    },
    onError: () => {
      addAppMessage({
        title: "failed to update deck",
        content: "check console for more details",
        severity: "error",
      });
    },
  });

  // delete deck
  const { mutateAsync: deleteDeckById } = useMutation({
    mutationFn: async (deckId: string) => {
      const res = await fetchWithAuth(`/decks/${deckId}`, accessToken, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("failed to delete deck");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decks"] });
      addAppMessage({ content: "deck deleted", severity: "info" });
    },
    onError: () => {
      addAppMessage({
        title: "failed to delete deck",
        content: "check console for more details",
        severity: "error",
      });
    },
  });

  // user color map
  const getDeckUserColor = useMemo(() => {
    const map = new Map<string, string>();
    for (const deck of allDecks) {
      const user = allUserProfiles.find((u) => u.id === deck.userId);
      if (!user) {
        continue;
      }
      const color =
        mode === "light"
          ? user.lightThemeColor ?? "inherit"
          : user.darkThemeColor ?? "inherit";
      map.set(deck.id, color);
    }
    return (deckId: string) => map.get(deckId) ?? "inherit";
  }, [allDecks, allUserProfiles, mode]);

  // returns the user profile a given deck id
  const getUserForDeck = useMemo(() => {
    const map = new Map<string, User>();
    allDecks.forEach((deck) => {
      const user = allUserProfiles.find((u) => u.id === deck.userId);
      if (user) map.set(deck.id, user);
    });
    return (deckId: string) => map.get(deckId);
  }, [allDecks, allUserProfiles]);

  // returns a list of decks based on provided filters
  const getFilteredDecks = ({
    includeInactive,
    filterUser,
    filterFormat,
    filterColor,
  }: {
    includeInactive: boolean;
    filterUser: string;
    filterFormat: string;
    filterColor: string[];
  }): Deck[] =>
    allDecks.filter((deck) => {
      const commanderColors = deck.commanderColors ?? [];
      const secondCommanderColors = (deck.secondCommanderColors ??
        []) as string[];
      const combinedColors = [
        ...new Set([...commanderColors, ...secondCommanderColors]),
      ];

      return (
        (includeInactive || !deck.inactive) &&
        (filterUser === "" || deck.userId === filterUser) &&
        (!filterFormat || deck.formatId === filterFormat) &&
        matchesExactColors(combinedColors, filterColor)
      );
    });

  return (
    <DeckContext.Provider
      value={{
        allDecks,
        userDecks,
        decksLoading,
        createNewDeck,
        updateExistingDeck,
        deleteDeckById,
        getDeckUserColor,
        getUserForDeck,
        getFilteredDecks,
      }}
    >
      {children}
    </DeckContext.Provider>
  );
};

export const useDeck = () => {
  const ctx = useContext(DeckContext);
  if (!ctx) throw new Error("useDeck must be used within a DeckProvider");
  return ctx;
};
