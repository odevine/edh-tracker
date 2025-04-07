import { Circle } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts";

import { useTheme } from "@/hooks";
import { Deck } from "@/types";
import { percentFormatter } from "@/utils";

interface UserDecksByFormatProps {
  userDecks: Deck[];
  selectedFormatId: string;
}

export const UserDecksByFormatChart = ({
  userDecks,
  selectedFormatId,
}: UserDecksByFormatProps) => {
  const { muiTheme, chartPalette } = useTheme();
  const palette = chartPalette(muiTheme.palette.mode);

  const decksWithStats = userDecks
    .map((deck) => {
      const stats = deck.formatStats?.[selectedFormatId];
      if (!stats || stats.gamesPlayed === 0) {
        return null;
      }
      return {
        label: deck.displayName,
        played: stats.gamesPlayed,
        wins: stats.gamesWon ?? 0,
      };
    })
    .filter(Boolean) as { label: string; played: number; wins: number }[];

  const totalPlayed = decksWithStats.reduce((sum, d) => sum + d.played, 0);
  const totalWins = decksWithStats.reduce((sum, d) => sum + d.wins, 0);

  const playedData = decksWithStats.map((deck, idx) => ({
    id: deck.label,
    label: deck.label,
    value: deck.played,
    color: palette[idx % palette.length],
  }));

  const winsData = decksWithStats.map((deck, idx) => ({
    id: deck.label,
    label: deck.label,
    value: deck.wins,
    color: palette[idx % palette.length],
  }));

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems="center"
        sx={{ height: "100%" }}
      >
        {/* Manual Legend */}
        <Stack
          direction={{ xs: "row", sm: "column" }}
          spacing={1}
          sx={{ width: 160 }}
        >
          {playedData.map((entry) => (
            <Stack
              key={entry.label}
              direction="row"
              alignItems="center"
              spacing={1}
            >
              <Circle sx={{ color: entry.color, height: 12, width: 12 }} />
              <Typography variant="body2" noWrap>
                {entry.label}
              </Typography>
            </Stack>
          ))}
        </Stack>

        {/* Nested Chart */}
        <PieChart
          height={300}
          width={300}
          series={[
            {
              outerRadius: 100,
              innerRadius: 55,
              data: playedData,
              valueFormatter: (section) =>
                `${section.value} match${section.value !== 1 ? "es" : ""} - (${percentFormatter.format(
                  section.value / totalPlayed,
                )})`,
            },
            {
              outerRadius: 50,
              innerRadius: 0,
              data: winsData,
              valueFormatter: (section) =>
                `${section.value} win${section.value !== 1 ? "s" : ""} - (${percentFormatter.format(
                  section.value / totalWins,
                )})`,
            },
          ]}
          margin={{ right: 0, top: 0 }}
          slotProps={{ legend: { hidden: true } }}
        />
      </Stack>
    </Box>
  );
};
