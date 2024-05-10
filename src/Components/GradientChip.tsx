import { Chip, ChipProps } from "@mui/material";

import { useTheme } from "@/Context";

type mtgColors = "W" | "B" | "U" | "R" | "G";

interface GradientChipProps extends ChipProps {
  colors: string[];
}

export const GradientChip = (props: GradientChipProps): JSX.Element => {
  const { mode } = useTheme();

  const { colors, ...otherProps } = props;
  const castColors = colors as mtgColors[]
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
      borderGradient = `linear-gradient(90deg, ${mtgHexes[castColors[0]]} 0%, ${mtgHexes[castColors[0]]} 100%)`;
      break;
    case 2:
      borderGradient = `linear-gradient(90deg, ${mtgHexes[castColors[0]]} 33%, ${mtgHexes[castColors[1]]} 67%)`;
      break;
    case 3:
      borderGradient = `linear-gradient(90deg,
        ${mtgHexes[castColors[0]]} 20%,
        ${mtgHexes[castColors[1]]} 40%,
        ${mtgHexes[castColors[1]]} 60%,
        ${mtgHexes[castColors[2]]} 80%
      )`;
      break;
    case 4:
      borderGradient = `linear-gradient(90deg,
        ${mtgHexes[castColors[0]]} 8%,
        ${mtgHexes[castColors[1]]} 33%,
        ${mtgHexes[castColors[2]]} 67%,
        ${mtgHexes[castColors[3]]} 92%
      )`;
      break;
    case 5:
      borderGradient = `linear-gradient(90deg,
        ${mtgHexes[castColors[0]]} 8%,
        ${mtgHexes[castColors[1]]} 29%,
        ${mtgHexes[castColors[2]]} 50%,
        ${mtgHexes[castColors[3]]} 71%,
        ${mtgHexes[castColors[4]]} 92%
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
        position: "relative",
        // If multi-colored, the outline is gold, but if mono-colored, we want the border to take up that space
        border: `double ${multiColored ? BORDER_WIDTH : OUTLINE_BORDER + BORDER_WIDTH}px transparent`,
        borderRadius: BORDER_RADIUS,
        backgroundImage: (theme): string =>
          `linear-gradient(90deg,
            ${theme.palette.background.paper},
            ${theme.palette.background.paper}
          ), ${borderGradient}`,
        backgroundOrigin: "border-box",
        backgroundClip: "content-box, border-box",
        // Outline is used to add a gold border to multicolored commanders
        outline: (): string => {
          const outlineWidth = outerContrastBorder
            ? OUTLINE_BORDER
            : OUTLINE_BORDER + 1;
          return multiColored ? `${outlineWidth}px solid ${multiGold}` : "none";
        },
        boxShadow: (theme): string => {
          let boxShadowArr = [];
          if (innerContrastBorder) {
            boxShadowArr.push(`inset 0 0 0 1px ${theme.palette.text.primary}`);
          }
          if (outerContrastBorder) {
            boxShadowArr.push(
              `0 0 0 ${multiColored ? OUTLINE_BORDER + 1 : 1}px ${theme.palette.text.primary}`,
            );
          }
          return boxShadowArr.join(", ");
        },
      }}
    />
  );
};
