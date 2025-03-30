import { Box } from "@mui/material";

import { sortColors } from "@/utils";

export const CommanderColors = (props: { colors: Array<string | null> }) => {
  type ColorKey = "W" | "U" | "B" | "R" | "G";
  const colorClassMap: Record<ColorKey, string> = {
    W: "ms ms-w",
    U: "ms ms-u",
    B: "ms ms-b",
    R: "ms ms-r",
    G: "ms ms-g",
  };
  const colorOrder = Object.keys(colorClassMap) as ColorKey[];

  const sortedColors = Array.from(
    new Set(sortColors(props.colors.map((c) => String(c)))),
  )
    .filter((color): color is ColorKey =>
      colorOrder.includes(color as ColorKey),
    )
    .sort(
      (a, b) =>
        colorOrder.indexOf(a as ColorKey) - colorOrder.indexOf(b as ColorKey),
    );

  if (sortedColors.length === 0) {
    return <i className="ms ms-c" />;
  }

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
