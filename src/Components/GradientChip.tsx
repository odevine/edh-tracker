import { Chip, ChipProps } from "@mui/material";

import { useTheme } from "@/Context";

type mtgColors = "W" | "B" | "U" | "R" | "G";

interface GradientChipProps extends ChipProps {
  colors: mtgColors[];
}

export const GradientChip = (props: GradientChipProps): JSX.Element => {
  const { mode } = useTheme();

  const { colors, ...otherProps } = props;
  const mtgHexes = {
    W: "#f9faf4",
    U: "#0e68ab",
    B: "#150b00",
    R: "#d3202a",
    G: "#00733e",
    C: "#c6c5c5",
  };
  const multiColored = colors.length >= 2;
  const multiGold = "#f3db6f";

  let monoColor = mtgHexes.C;
  if (colors.length === 1) {
    monoColor = mtgHexes[colors[0]];
  }

  let outerContrastBorder = false;
  let innerContrastBorder = false;
  if (mode === "dark") {
    if (colors.includes("B")) {
      innerContrastBorder = true;
      if (colors.length === 1) {
        outerContrastBorder = true;
      }
    }
  } else if (mode === "light") {
    if (colors.includes("W")) {
      innerContrastBorder = true;
      if (colors.length === 1) {
        outerContrastBorder = true;
      }
    }
  }

  let borderGradient = `linear-gradient(90deg, ${mtgHexes.C} 0%, ${mtgHexes.C} 100%)`;
  switch (colors.length) {
    case 1:
      borderGradient = `linear-gradient(90deg, ${mtgHexes[colors[0]]} 0%, ${mtgHexes[colors[0]]} 100%)`;
      break;
    case 2:
      borderGradient = `linear-gradient(90deg, ${mtgHexes[colors[0]]} 33%, ${mtgHexes[colors[1]]} 67%)`;
      break;
    case 3:
      borderGradient = `linear-gradient(90deg,
        ${mtgHexes[colors[0]]} 20%,
        ${mtgHexes[colors[1]]} 40%,
        ${mtgHexes[colors[1]]} 60%,
        ${mtgHexes[colors[2]]} 80%
      )`;
      break;
    case 4:
      borderGradient = `linear-gradient(90deg,
        ${mtgHexes[colors[0]]} 8%,
        ${mtgHexes[colors[1]]} 33%,
        ${mtgHexes[colors[2]]} 67%,
        ${mtgHexes[colors[3]]} 92%
      )`;
      break;
    case 5:
      borderGradient = `linear-gradient(90deg,
        ${mtgHexes[colors[0]]} 8%,
        ${mtgHexes[colors[1]]} 29%,
        ${mtgHexes[colors[2]]} 50%,
        ${mtgHexes[colors[3]]} 71%,
        ${mtgHexes[colors[4]]} 92%
      )`;
      break;
  }

  const BORDER_WIDTH = 5;
  const OUTLINE_BORDER = 2;
  const BORDER_RADIUS = 99;

  return (
    <Chip
      {...otherProps}
      sx={{
        border: `double ${BORDER_WIDTH}px transparent`,
        borderRadius: BORDER_RADIUS,
        backgroundImage: (theme): string =>
          `linear-gradient(90deg,
            ${theme.palette.background.paper},
            ${theme.palette.background.paper}
          ), ${borderGradient}`,
        backgroundOrigin: "border-box",
        backgroundClip: "content-box, border-box",
        outline: (): string => {
          const outlineWidth = outerContrastBorder
            ? OUTLINE_BORDER
            : OUTLINE_BORDER + 1;
          return `${outlineWidth}px solid ${multiColored ? multiGold : monoColor}`;
        },
        boxShadow: (theme): string => {
          let boxShadowArr = [];
          if (innerContrastBorder) {
            boxShadowArr.push(`inset 0 0 0 1px ${theme.palette.text.primary}`);
          }
          if (outerContrastBorder) {
            boxShadowArr.push(
              `0 0 0 ${OUTLINE_BORDER + 1}px ${theme.palette.text.primary}`,
            );
          }
          return boxShadowArr.join(", ");
        },
      }}
    />
  );
};
