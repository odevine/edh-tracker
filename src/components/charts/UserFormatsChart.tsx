import { Circle } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts";

import { useTheme } from "@/hooks";
import { Deck, Format } from "@/types";
import { percentFormatter } from "@/utils";

interface UserFormatsChartProps {
  userDecks: Deck[];
  allFormats: Format[];
}

export const UserFormatsChart = ({
  userDecks,
  allFormats,
}: UserFormatsChartProps) => {
  const { muiTheme, chartPalette } = useTheme();
  const palette = chartPalette(muiTheme.palette.mode);

  const formatTotals = userDecks.reduce(
    (acc, deck) => {
      for (const [formatId, stats] of Object.entries(deck.formatStats ?? {})) {
        if (!acc[formatId]) acc[formatId] = { wins: 0, played: 0 };
        acc[formatId].played += stats.gamesPlayed ?? 0;
        acc[formatId].wins += stats.gamesWon ?? 0;
      }
      return acc;
    },
    {} as Record<string, { wins: number; played: number }>,
  );

  const entries = Object.entries(formatTotals).filter(
    ([, data]) => data.played > 0,
  );
  const totalPlayed = entries.reduce((sum, [, d]) => sum + d.played, 0);
  const totalWins = entries.reduce((sum, [, d]) => sum + d.wins, 0);

  const playedData = entries.map(([id, data], idx) => ({
    id,
    value: data.played,
    label: allFormats.find((f) => f.id === id)?.displayName ?? id,
    color: palette[idx % palette.length],
  }));

  const winsData = entries.map(([id, data], idx) => ({
    id,
    value: data.wins,
    label: allFormats.find((f) => f.id === id)?.displayName ?? id,
    color: palette[idx % palette.length],
  }));

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems="center"
        sx={{ height: "100%" }}
      >
        <Stack
          direction={{ xs: "row", sm: "column" }}
          spacing={1}
          flexWrap="wrap"
        >
          {playedData.map((entry) => (
            <Stack
              key={entry.id}
              alignItems="center"
              direction="row"
              spacing={1}
            >
              <Circle sx={{ color: entry.color, height: 12, width: 12 }} />
              <Typography variant="body2">{entry.label}</Typography>
            </Stack>
          ))}
        </Stack>
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
