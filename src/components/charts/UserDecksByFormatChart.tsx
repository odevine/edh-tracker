import { Circle } from "@mui/icons-material";
import { Box, MenuItem, Select, Stack, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts";
import { useMemo, useState } from "react";

import { useFormat, useTheme } from "@/hooks";
import { Deck } from "@/types";
import { percentFormatter } from "@/utils";

interface UserDecksByFormatProps {
  userDecks: Deck[];
}

export const UserDecksByFormatChart = ({
  userDecks,
}: UserDecksByFormatProps) => {
  const { muiTheme, chartPalette } = useTheme();
  const { allFormats } = useFormat();
  const palette = chartPalette(muiTheme.palette.mode);

  const formatIdsWithDecks = useMemo(() => {
    const formatIds = new Set<string>();
    for (const deck of userDecks) {
      for (const formatId of Object.keys(deck.formatStats ?? {})) {
        if ((deck.formatStats?.[formatId]?.gamesPlayed ?? 0) > 0) {
          formatIds.add(formatId);
        }
      }
    }
    return [...formatIds];
  }, [userDecks]);

  const [selectedFormatId, setSelectedFormatId] = useState(
    formatIdsWithDecks[0] ?? "",
  );

  const decksWithStats = userDecks
    .map((deck) => {
      const stats = deck.formatStats?.[selectedFormatId];
      if (!stats || stats.gamesPlayed === 0) return null;
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
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6">decks by format</Typography>
        <Box>
          <Select
            value={selectedFormatId}
            onChange={(e) => setSelectedFormatId(e.target.value)}
            size="small"
          >
            {formatIdsWithDecks.map((id) => {
              const formatName =
                allFormats.find((f) => f.id === id)?.displayName ?? id;
              return (
                <MenuItem key={id} value={id}>
                  {formatName}
                </MenuItem>
              );
            })}
          </Select>
        </Box>
      </Stack>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems="center"
        sx={{ height: "calc(100% - 32px)" }}
      >
        {/* Manual Legend */}
        <Stack
          direction={{ xs: "row", sm: "column" }}
          spacing={1}
          mt={2}
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
