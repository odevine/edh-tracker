import { Deck, Format, Match, User, UserStatsResult } from "@/types";

export const getVictimLabel = (wins: number, plural: boolean): string => {
  if (wins >= 15) {
    return `your favorite punching bag${plural ? "s" : ""}`;
  }
  if (wins >= 7) {
    return "a consistent conquest";
  }
  if (wins >= 3) {
    return "frequent win";
  }
  return "occasional triumph";
};

export const getNemesisLabel = (losses: number, plural: boolean): string => {
  if (losses >= 15) {
    return `unrelenting nemes${plural ? "es" : "is"}`;
  }
  if (losses >= 7) {
    return "frequent downfall";
  }
  if (losses >= 3) {
    return "occasional defeat";
  }
  return "narrow losses";
};

export const getRivalryLabel = (
  wins: number,
  losses: number,
  plural: boolean,
): string => {
  const ratio = wins / (losses || 1);

  if (ratio < 0.5) {
    return `long-standing foe${plural ? "s" : ""}`;
  }
  if (ratio < 0.8) {
    return "hard-won victories";
  }
  if (ratio <= 1.25) {
    return "close competition";
  }
  if (ratio < 2.0) {
    return "familiar prey";
  }
  return "utter domination";
};

export const getUserStats = (
  targetUserId: string,
  includeUnranked: boolean,
  data: {
    allFormats: Format[];
    allMatches: Match[];
    allDecks: Deck[];
    allUsers: User[];
  },
): UserStatsResult => {
  const userDecks = data.allDecks.filter(
    (deck) => deck.userId === targetUserId,
  );
  const user = data.allUsers.find((u) => u.id === targetUserId);

  let totalWins = 0;
  let totalMatches = 0;

  const allDeckStats = userDecks.map((deck) => {
    const stats = Object.entries(deck.formatStats ?? {})
      .filter(([formatId]) => includeUnranked || formatId !== "unranked")
      .map(([, stats]) => stats);
    const gamesPlayed = stats.reduce((sum, s) => sum + (s.gamesPlayed ?? 0), 0);
    const gamesWon = stats.reduce((sum, s) => sum + (s.gamesWon ?? 0), 0);
    const winRate = gamesPlayed > 0 ? gamesWon / gamesPlayed : 0;

    totalWins += gamesWon;
    totalMatches += gamesPlayed;

    return {
      displayName: deck.displayName,
      gamesPlayed,
      gamesWon,
      winRate,
    };
  });

  const winRate = totalMatches > 0 ? totalWins / totalMatches : 0;
  const deckCount = userDecks.length;

  const qualifyingDecks = allDeckStats.filter((d) => d.gamesPlayed >= 5);
  const maxDeckWinRate = Math.max(0, ...qualifyingDecks.map((d) => d.winRate));
  const bestDecks =
    maxDeckWinRate > 0
      ? {
          decks: qualifyingDecks.filter((d) => d.winRate === maxDeckWinRate),
          winRate: maxDeckWinRate,
        }
      : undefined;

  const maxDeckPlays = Math.max(0, ...allDeckStats.map((d) => d.gamesPlayed));
  const mostPlayedDecks =
    maxDeckPlays > 0
      ? {
          displayNames: allDeckStats
            .filter((d) => d.gamesPlayed === maxDeckPlays)
            .map((d) => d.displayName),
          gamesPlayed: maxDeckPlays,
        }
      : undefined;

  const formatStats = data.allFormats
    .filter((f) => includeUnranked || f.id !== "unranked")
    .map((format) => {
      const stats = user?.formatStats?.[format.id];
      return stats
        ? {
            formatId: format.id,
            displayName: format.displayName,
            gamesPlayed: stats.gamesPlayed,
            gamesWon: stats.gamesWon,
            winRate:
              stats.gamesPlayed > 0 ? stats.gamesWon / stats.gamesPlayed : 0,
          }
        : null;
    })
    .filter(Boolean) as {
    displayName: string;
    gamesPlayed: number;
    gamesWon: number;
    winRate: number;
  }[];

  const bestFormatsList = formatStats.filter((f) => f.gamesPlayed >= 5);
  const maxFormatWinRate = Math.max(
    0,
    ...bestFormatsList.map((f) => f.winRate),
  );
  const bestFormats =
    maxFormatWinRate > 0
      ? {
          formats: bestFormatsList
            .filter((f) => f.winRate === maxFormatWinRate)
            .map((f) => ({
              displayName: f.displayName,
              gamesPlayed: f.gamesPlayed,
            })),
          winRate: maxFormatWinRate,
        }
      : undefined;

  const maxFormatPlays = Math.max(0, ...formatStats.map((f) => f.gamesPlayed));
  const mostPlayedFormats =
    maxFormatPlays > 0
      ? {
          displayNames: formatStats
            .filter((f) => f.gamesPlayed === maxFormatPlays)
            .map((f) => f.displayName),
          gamesPlayed: maxFormatPlays,
        }
      : undefined;

  // nemesis/victim logic
  const userMatches = data.allMatches.filter(
    (match) =>
      match.matchParticipants?.some((p) => p.userId === targetUserId) &&
      (includeUnranked || match.formatId !== "unranked"),
  );

  const winCounts: Record<string, number> = {};
  const lossCounts: Record<string, number> = {};

  for (const match of userMatches) {
    const participants = match.matchParticipants ?? [];
    const winningDeckId = match.winningDeckId;
    const winningParticipant = participants.find(
      (p) => p.deckId === winningDeckId,
    );
    if (!winningParticipant) {
      continue;
    }

    const userPlayed = participants.some((p) => p.userId === targetUserId);
    const userWon = winningParticipant.userId === targetUserId;

    for (const { userId } of participants) {
      if (userId === targetUserId) {
        continue;
      }
      if (userWon) {
        winCounts[userId] = (winCounts[userId] ?? 0) + 1;
      } else if (userPlayed && winningParticipant.userId === userId) {
        lossCounts[userId] = (lossCounts[userId] ?? 0) + 1;
      }
    }
  }

  const maxLosses = Math.max(0, ...Object.values(lossCounts));
  const maxWins = Math.max(0, ...Object.values(winCounts));

  const nemesisUsers = Object.entries(lossCounts)
    .filter(([, count]) => count === maxLosses)
    .map(([userId]) => data.allUsers.find((u) => u.id === userId))
    .filter(Boolean) as User[];

  const victimUsers = Object.entries(winCounts)
    .filter(([, count]) => count === maxWins)
    .map(([userId]) => data.allUsers.find((u) => u.id === userId))
    .filter(Boolean) as User[];

  const rivalryUsers = nemesisUsers.filter((nu) =>
    victimUsers.some((vu) => vu.id === nu.id),
  );

  const nemesis =
    rivalryUsers.length === 0 && nemesisUsers.length > 0
      ? {
          displayNames: nemesisUsers.map((u) => u.displayName),
          losses: maxLosses,
        }
      : undefined;

  const victim =
    rivalryUsers.length === 0 && victimUsers.length > 0
      ? {
          displayNames: victimUsers.map((u) => u.displayName),
          wins: maxWins,
        }
      : undefined;

  const rivalry =
    rivalryUsers.length > 0
      ? {
          displayNames: rivalryUsers.map((u) => u.displayName),
          wins: maxWins,
          losses: maxLosses,
        }
      : undefined;

  return {
    totalMatches,
    totalWins,
    winRate,
    deckCount,
    bestDecks,
    mostPlayedDecks,
    bestFormats,
    mostPlayedFormats,
    nemesis,
    victim,
    rivalry,
  };
};
