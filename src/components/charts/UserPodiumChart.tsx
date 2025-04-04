import { Box, BoxProps, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

import { useTheme, useUser } from "@/hooks";
import { FormatStatsResult } from "@/types";

interface UserPodiumChartProps extends BoxProps {
  userWins: FormatStatsResult["userWins"];
}

export const UserPodiumChart = ({
  userWins,
  ...boxProps
}: UserPodiumChartProps) => {
  const { allUsers } = useUser();
  const { muiTheme } = useTheme();

  // determine if the current theme mode is dark
  const isDarkMode = muiTheme.palette.mode === "dark";

  // sort users by win count in descending order
  const sorted = Object.entries(userWins).sort((a, b) => b[1] - a[1]);

  // determine the cutoff for the top three positions, including ties
  const topThreeCutoff = sorted[2]?.[1] ?? 0;
  const topEntries = sorted.filter(([, wins]) => wins >= topThreeCutoff);

  if (topEntries.length === 0) {
    return (
      <Box {...boxProps}>
        <Typography variant="subtitle1" mb={1}>
          top users
        </Typography>
        <Typography color="text.secondary">
          no matches have been played in this format yet
        </Typography>
      </Box>
    );
  }

  const data = topEntries.map(([userId, wins]) => {
    const user = allUsers.find((u) => u.id === userId);
    return {
      userId,
      // fallback to a substring of userId if displayName is unavailable
      label: user?.displayName ?? userId.slice(0, 6),
      wins,
      // choose color based on theme mode
      color: isDarkMode ? user?.darkThemeColor : user?.lightThemeColor,
    };
  });

  // extract labels and colors for the colorMap
  const labels = data.map((d) => d.label);
  const colors = data.map((d) => d.color ?? "gray");

  return (
    <Box {...boxProps}>
      <Typography variant="subtitle1" mb={1}>
        top users
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
          },
        ]}
        height={200}
        margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
        yAxis={[{ tickLabelStyle: { display: "none" } }]}
        grid={{ horizontal: false, vertical: false }}
        slotProps={{
          legend: { hidden: true },
        }}
      />
    </Box>
  );
};
