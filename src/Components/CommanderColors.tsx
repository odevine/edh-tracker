import { Box } from "@mui/material";

import { sortColors } from "@/Logic";

export const CommanderColors = (props: { colors: Array<string | null> }) => {
  const sortedColors = Array.from(
    new Set(sortColors(props.colors.map((c) => String(c)))),
  );

  if (sortedColors.length === 0) {
    return <i className="ms ms-c" />;
  }

  type ColorKey = "W" | "U" | "B" | "R" | "G";

  const colorClassMap: Record<ColorKey, string> = {
    W: "ms ms-w",
    U: "ms ms-u",
    B: "ms ms-b",
    R: "ms ms-r",
    G: "ms ms-g",
  };

  return (
    <Box
      sx={{
        whiteSpace: "nowrap",
        overflow: "hidden",
      }}
    >
      {sortedColors.map((color) => {
        const className = colorClassMap[color as ColorKey];
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
