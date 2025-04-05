import { Box, BoxProps, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

import { useDeck, useTheme, useUser } from "@/hooks";
import { FormatStatsResult } from "@/types";
import { getContrastText } from "@/utils";

interface DeckPodiumChartProps extends BoxProps {
  deckWins: FormatStatsResult["deckWins"];
}

export const DeckPodiumChart = ({
  deckWins,
  ...boxProps
}: DeckPodiumChartProps) => {
  const { allDecks } = useDeck();
  const { allUsers } = useUser();
  const { muiTheme } = useTheme();

  // determine if the current theme mode is dark
  const isDarkMode = muiTheme.palette.mode === "dark";

  // sort decks by win count in descending order
  const sorted = Object.entries(deckWins).sort((a, b) => b[1] - a[1]);

  // determine the cutoff for the top three positions, including ties
  const topThreeCutoff = sorted[2]?.[1] ?? 0;
  const topEntries = sorted.filter(([, wins]) => wins >= topThreeCutoff);

  if (topEntries.length === 0) {
    return (
      <Box {...boxProps}>
        <Typography variant="subtitle1" mb={1}>
          top decks
        </Typography>
        <Typography color="text.secondary">
          no matches have been played in this format yet
        </Typography>
      </Box>
    );
  }

  const data = topEntries.map(([deckId, wins]) => {
    const deck = allDecks.find((d) => d.id === deckId);
    const user = allUsers.find((u) => u.id === deck?.userId);

    const deckLabel = deck?.displayName ?? deckId.slice(0, 6);
    const userLabel = user?.displayName ? ` (${user.displayName})` : "";

    return {
      deckId,
      // display format: deck name (user name)
      label: `${deckLabel}${userLabel}`,
      wins,
      color: isDarkMode
        ? user?.darkThemeColor
        : user?.lightThemeColor ?? muiTheme.palette.grey[400],
    };
  });

  // extract labels and colors for the colorMap
  const labels = data.map((d) => d.label);
  const colors = data.map((d) => d.color ?? muiTheme.palette.grey[400]);
  const labelColors = colors.map(getContrastText);

  return (
    <Box {...boxProps}>
      <Typography variant="subtitle1" mb={1}>
        top decks
      </Typography>
      <BarChart
        xAxis={[
          {
            data: labels,
            scaleType: "band",
            colorMap: {
              type: "ordinal",
              values: labels,
              colors: colors,
            },
            tickLabelStyle: { display: "none" },
          },
        ]}
        series={[
          {
            data: data.map((d) => d.wins),
            valueFormatter: (value) =>
              `${value} win${Number(value) > 1 ? "s" : ""}`,
          },
        ]}
        barLabel={(item) => String(item.value)}
        borderRadius={10}
        height={200}
        margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
        yAxis={[{ tickLabelStyle: { display: "none" } }]}
        grid={{ horizontal: false, vertical: false }}
        slotProps={{
          legend: { hidden: true },
        }}
        sx={{
          "& .MuiBarLabel-root": {
            fontWeight: 700,
            fontSize: 20,
          },
          ...labelColors.reduce(
            (acc, color, index) => {
              acc[`& .MuiBarLabel-root:nth-of-type(${index + 1})`] = {
                fill: color,
              };
              return acc;
            },
            {} as Record<string, any>,
          ),
        }}
      />
    </Box>
  );
};
