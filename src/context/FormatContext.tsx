import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren, createContext, useMemo } from "react";

import { useApp, useAuth, useMatch } from "@/hooks";
import {
  CreateFormatInput,
  Format,
  FormatStatsResult,
  UpdateFormatInput,
} from "@/types";
import { fetchWithAuth } from "@/utils";

interface FormatContextType {
  allFormats: Format[];
  formatsLoading: boolean;
  getFormatById: (id: string) => Format | undefined;
  createNewFormat: (input: CreateFormatInput) => Promise<void>;
  updateExistingFormat: (args: {
    formatId: string;
    input: UpdateFormatInput;
  }) => Promise<void>;
  getFormatStats: (id: string) => FormatStatsResult;
}

export const FormatContext = createContext<FormatContextType | undefined>(
  undefined,
);

export const FormatProvider = ({ children }: PropsWithChildren<{}>) => {
  const { accessToken, isInitializing } = useAuth();
  const { addAppMessage } = useApp();
  const { allMatches } = useMatch();
  const queryClient = useQueryClient();

  // fetch all formats
  const { data: allFormats = [], isLoading: formatsLoading } = useQuery<
    Format[]
  >({
    queryKey: ["formats"],
    queryFn: async () => {
      const res = await fetchWithAuth("/formats", accessToken);
      if (!res.ok) {
        throw new Error("failed to fetch formats");
      }
      const data: Format[] = await res.json();
      return data.sort((a, b) => a.displayName.localeCompare(b.displayName));
    },
    enabled: !!accessToken && !isInitializing,
  });

  // get format by id
  const getFormatById = useMemo(() => {
    const formatMap = new Map(allFormats.map((f) => [f.id, f]));
    return (id: string) => formatMap.get(id);
  }, [allFormats]);

  // create new format
  const { mutateAsync: createNewFormat } = useMutation({
    mutationFn: async (input: CreateFormatInput) => {
      const res = await fetchWithAuth("/formats", accessToken, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        throw new Error("failed to create format");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["formats"] });
      addAppMessage({ content: "format created", severity: "success" });
    },
    onError: () => {
      addAppMessage({
        title: "failed to create format",
        content: "check console for more details",
        severity: "error",
      });
    },
  });

  // update existing format
  const { mutateAsync: updateExistingFormat } = useMutation({
    mutationFn: async ({
      formatId,
      input,
    }: {
      formatId: string;
      input: UpdateFormatInput;
    }) => {
      const res = await fetchWithAuth(`/formats/${formatId}`, accessToken, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        throw new Error("failed to update format");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["formats"] });
      addAppMessage({ content: "format updated", severity: "success" });
    },
    onError: () => {
      addAppMessage({
        title: "failed to update format",
        content: "check console for more details",
        severity: "error",
      });
    },
  });

  const getFormatStats = (formatId: string): FormatStatsResult => {
    const filteredMatches = allMatches.filter(
      (match) => match.formatId === formatId,
    );
    const totalMatches = filteredMatches.length;

    const userWins: Record<string, number> = {};
    const deckWins: Record<string, number> = {};
    const uniqueUserSet = new Set<string>();
    const uniqueDeckSet = new Set<string>();

    for (const match of filteredMatches) {
      const participants = match.matchParticipants ?? [];

      // Build quick lookup for winning deck's owner
      const winningDeckId = match.winningDeckId;
      const winner = participants.find((p) => p.deckId === winningDeckId);

      if (winner?.userId) {
        userWins[winner.userId] = (userWins[winner.userId] ?? 0) + 1;
      }

      if (winningDeckId) {
        deckWins[winningDeckId] = (deckWins[winningDeckId] ?? 0) + 1;
      }

      participants.forEach((p) => {
        if (p.userId) {
          uniqueUserSet.add(p.userId);
        }
        if (p.deckId) {
          uniqueDeckSet.add(p.deckId);
        }
      });
    }

    return {
      totalMatches,
      uniqueUsers: uniqueUserSet.size,
      uniqueDecks: uniqueDeckSet.size,
      userWins,
      deckWins,
    };
  };

  return (
    <FormatContext.Provider
      value={{
        allFormats,
        formatsLoading,
        getFormatById,
        createNewFormat,
        updateExistingFormat,
        getFormatStats,
      }}
    >
      {children}
    </FormatContext.Provider>
  );
};
