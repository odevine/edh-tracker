import { Box } from "@mui/material";

import { COLOR_CLASS_MAP, ColorKey } from "@/constants";

export const DeckColorCell = ({ deckColors }: { deckColors: string[] }) => {
  const renderColors = [...deckColors] as ColorKey[];
  if (deckColors.length === 0) {
    // most decks in the db should have "C" if they are colorless by now,
    // so this is just in case there are a few legacy 'undefined' properties
    renderColors.push("C");
  }

  return (
    <Box
      sx={{
        whiteSpace: "nowrap",
        overflow: "hidden",
      }}
    >
      {renderColors.map((color) => {
        const className = COLOR_CLASS_MAP[color];
        return className ? (
          <Box
            component="i"
            className={className}
            key={color}
            sx={{ marginRight: "2px" }}
          />
        ) : null;
      })}
    </Box>
  );
};
