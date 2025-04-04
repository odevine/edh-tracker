import { Box, Stack, Typography, useMediaQuery } from "@mui/material";
import { useCallback, useState } from "react";

import { FormatDetailPanel, FormatListCard } from "@/components";
import { useFormat, useTheme } from "@/hooks";
import { Format } from "@/types";

export const FormatsPage = () => {
  const { allFormats } = useFormat();
  const { muiTheme } = useTheme();
  const showBreakoutDetails = useMediaQuery(muiTheme.breakpoints.up("lg"));

  const [selectedFormat, setSelectedFormat] = useState<Format | null>(null);

  const handleClick = useCallback(
    (format: Format) => {
      if (selectedFormat && selectedFormat.id === format.id) {
        setSelectedFormat(null);
      } else {
        setSelectedFormat(format);
      }
    },
    [selectedFormat],
  );

  return (
    <Stack flexDirection={{ xs: "column-reverse", lg: "row" }} gap={3}>
      <Box flex={{ xs: "1 1 100%", lg: "0 0 35%" }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          active formats
        </Typography>
        {allFormats
          .filter((format) => !format.inactive)
          .map((format) => (
            <FormatListCard
              key={format.id}
              format={format}
              selected={selectedFormat?.id === format.id}
              onClick={handleClick}
            />
          ))}
        <Typography variant="h5" sx={{ mt: 3, mb: 1 }}>
          retired formats
        </Typography>
        {allFormats
          .filter((format) => format.inactive)
          .map((format) => (
            <FormatListCard
              key={format.id}
              format={format}
              selected={selectedFormat?.id === format.id}
              onClick={handleClick}
            />
          ))}
      </Box>
      {showBreakoutDetails && (
        <Box flex={1}>
          <FormatDetailPanel format={selectedFormat} />
        </Box>
      )}
    </Stack>
  );
};
