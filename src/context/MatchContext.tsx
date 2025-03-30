import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren, createContext, useContext } from "react";

import { useApp, useAuth } from "@/context";
import { fetchWithAuth } from "@/logic";
import { CreateMatchInput, Match, UpdateMatchInput } from "@/types";

interface MatchContextType {
  allMatches: Match[];
  matchesLoading: boolean;
  createNewMatch: (input: CreateMatchInput) => Promise<void>;
  updateMatchWithParticipants: (args: {
    matchId: string;
    updates: UpdateMatchInput;
  }) => Promise<void>;
  deleteMatch: (matchId: string) => Promise<void>;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const MatchProvider = ({ children }: PropsWithChildren<{}>) => {
  const { accessToken, isAdmin } = useAuth();
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
    enabled: !!accessToken,
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
      queryClient.invalidateQueries({ queryKey: ["matches"] });
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
      queryClient.invalidateQueries({ queryKey: ["matches"] });
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
      queryClient.invalidateQueries({ queryKey: ["matches"] });
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

  return (
    <MatchContext.Provider
      value={{
        allMatches,
        matchesLoading,
        createNewMatch,
        updateMatchWithParticipants,
        deleteMatch,
      }}
    >
      {children}
    </MatchContext.Provider>
  );
};

export const useMatch = () => {
  const ctx = useContext(MatchContext);
  if (!ctx) {
    throw new Error("useMatch must be used within a MatchProvider");
  }
  return ctx;
};
