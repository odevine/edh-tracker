import { User, UserWithStats } from "@/types";

interface UserStatOptions {
  includeUnranked: boolean;
  formatId?: string;
}

export function computeUserStats(
  users: User[],
  options: UserStatOptions,
): UserWithStats[] {
  const { includeUnranked, formatId } = options;

  return users.map((user): UserWithStats => {
    const statsMap = user.formatStats ?? {};

    if (formatId) {
      const ranked = statsMap[formatId] ?? { gamesPlayed: 0, gamesWon: 0 };
      const winRate =
        ranked.gamesPlayed > 0 ? ranked.gamesWon / ranked.gamesPlayed : 0;

      return {
        ...user,
        totalMatches: ranked.gamesPlayed,
        totalWins: ranked.gamesWon,
        winRate,
      };
    } else {
      const rankedStats = Object.entries(statsMap)
        .filter(([key]) => key !== "unranked")
        .map(([, stat]) => stat);

      const ranked = rankedStats.reduce(
        (acc, stat) => {
          acc.gamesPlayed += stat.gamesPlayed ?? 0;
          acc.gamesWon += stat.gamesWon ?? 0;
          return acc;
        },
        { gamesPlayed: 0, gamesWon: 0 },
      );

      const unranked = statsMap.unranked ?? { gamesPlayed: 0, gamesWon: 0 };

      const combined = includeUnranked
        ? {
            gamesPlayed: ranked.gamesPlayed + unranked.gamesPlayed,
            gamesWon: ranked.gamesWon + unranked.gamesWon,
          }
        : ranked;

      const winRate =
        combined.gamesPlayed > 0 ? combined.gamesWon / combined.gamesPlayed : 0;

      return {
        ...user,
        totalMatches: combined.gamesPlayed,
        totalWins: combined.gamesWon,
        winRate,
      };
    }
  });
}
