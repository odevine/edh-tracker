import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren, createContext, useMemo } from "react";

import { useApp, useAuth } from "@/hooks";
import { CreateMatchInput, Match, UpdateMatchInput } from "@/types";
import { fetchWithAuth } from "@/utils";

interface MatchContextType {
  allMatches: Match[];
  matchesLoading: boolean;
  createNewMatch: (input: CreateMatchInput) => Promise<void>;
  updateMatchWithParticipants: (args: {
    matchId: string;
    updates: UpdateMatchInput;
  }) => Promise<void>;
  deleteMatch: (matchId: string) => Promise<void>;
  getFilteredMatches: (filters: {
    formatId?: string;
    deckIds?: string[];
    userIds?: string[];
  }) => Match[];
  // non-match helper functions
  hasDeckBeenUsed: (deckId: string | undefined) => boolean;
  getUsersActiveInLast60Days: () => string[];
}

const QUERIES_TO_INVALIDATE = ["matches", "decks", "users"];

export const MatchContext = createContext<MatchContextType | undefined>(
  undefined,
);

export const MatchProvider = ({ children }: PropsWithChildren<{}>) => {
  const { accessToken, isAdmin, isInitializing } = useAuth();
  const { addAppMessage } = useApp();
  const queryClient = useQueryClient();

  // fetch all matches
  const { data: allMatches = [], isLoading: matchesLoading } = useQuery<
    Match[]
  >({
    queryKey: ["matches"],
    queryFn: async () => {
      const res = await fetchWithAuth("/matches", accessToken);
      if (!res.ok) {
        throw new Error("failed to fetch matches");
      }
      return res.json();
    },
    enabled: !!accessToken && !isInitializing,
  });

  // create a new match
  const { mutateAsync: createNewMatch } = useMutation({
    mutationFn: async (input: CreateMatchInput) => {
      const res = await fetchWithAuth("/matches", accessToken, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        throw new Error("failed to create match");
      }
      return res.json();
    },
    onSuccess: () => {
      QUERIES_TO_INVALIDATE.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: [key] }),
      );
      addAppMessage({ content: "match created", severity: "success" });
    },
    onError: () => {
      addAppMessage({
        title: "failed to create match",
        content: "check console for more details",
        severity: "error",
      });
    },
  });

  // update match and its participants
  const { mutateAsync: updateMatchWithParticipants } = useMutation({
    mutationFn: async ({
      matchId,
      updates,
    }: {
      matchId: string;
      updates: UpdateMatchInput;
    }) => {
      if (!isAdmin) {
        throw new Error("unauthorized");
      }
      const res = await fetchWithAuth(`/matches/${matchId}`, accessToken, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        throw new Error("failed to update match");
      }
      return res.json();
    },
    onSuccess: () => {
      QUERIES_TO_INVALIDATE.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: [key] }),
      );
      addAppMessage({
        content: "match and participants updated",
        severity: "success",
      });
    },
    onError: () => {
      addAppMessage({
        title: "failed to update match",
        content: "check console for more details",
        severity: "error",
      });
    },
  });

  // delete match
  const { mutateAsync: deleteMatch } = useMutation({
    mutationFn: async (matchId: string) => {
      if (!isAdmin) {
        throw new Error("unauthorized");
      }
      const res = await fetchWithAuth(`/matches/${matchId}`, accessToken, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("failed to delete match");
      }
    },
    onSuccess: () => {
      QUERIES_TO_INVALIDATE.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: [key] }),
      );
      addAppMessage({ content: "match deleted", severity: "info" });
    },
    onError: () => {
      addAppMessage({
        title: "failed to delete match",
        content: "check console for more details",
        severity: "error",
      });
    },
  });

  // checks to see if a deck has been used in a match before
  const hasDeckBeenUsed = useMemo(() => {
    const usedDecks = new Set<string>();
    allMatches.forEach((match) => {
      match.matchParticipants?.forEach((p) => {
        if (p.deckId) {
          usedDecks.add(p.deckId);
        }
      });
    });
    return (deckId: string | undefined) =>
      deckId ? usedDecks.has(deckId) : false;
  }, [allMatches]);

  const getFilteredMatches = ({
    formatId,
    deckIds,
    userIds,
  }: {
    formatId?: string;
    deckIds?: string[];
    userIds?: string[];
  }): Match[] => {
    return allMatches.filter((match) => {
      if (formatId && match.formatId !== formatId) {
        return false;
      }

      if (deckIds && deckIds.length > 0) {
        const usedDeckIds = match.matchParticipants?.map((p) => p.deckId);
        if (!usedDeckIds?.some((id) => id && deckIds.includes(id))) {
          return false;
        }
      }

      if (userIds && userIds.length > 0) {
        const usedUserIds = match.matchParticipants?.map((p) => p.userId);
        if (!usedUserIds?.some((id) => id && userIds.includes(id))) {
          return false;
        }
      }

      return true;
    });
  };

  const getUsersActiveInLast60Days = useMemo(() => {
    const SIXTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
    const now = new Date().getTime();

    const recentUserIds = new Set<string>();

    allMatches.forEach((match) => {
      const matchDate = new Date(match.datePlayed).getTime();
      if (now - matchDate <= SIXTY_DAYS_MS) {
        match.matchParticipants?.forEach((p) => {
          if (p.userId) {
            recentUserIds.add(p.userId);
          }
        });
      }
    });

    return () => Array.from(recentUserIds);
  }, [allMatches]);

  return (
    <MatchContext.Provider
      value={{
        allMatches,
        matchesLoading,
        createNewMatch,
        updateMatchWithParticipants,
        deleteMatch,
        getFilteredMatches,
        hasDeckBeenUsed,
        getUsersActiveInLast60Days,
      }}
    >
      {children}
    </MatchContext.Provider>
  );
};
