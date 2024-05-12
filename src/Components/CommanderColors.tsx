import { Box } from "@mui/material";

export const CommanderColors = (props: { colors: string[] }) => {
  const { colors } = props;

  if (colors.length === 0) {
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

  return colors.map((color) => {
    const className = colorClassMap[color as ColorKey];
    return className ? (
      <Box
        component="i"
        className={className}
        key={color}
        sx={{ marginRight: "2px" }}
      />
    ) : null;
  });
};
