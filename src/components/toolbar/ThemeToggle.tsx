import { DarkMode, LightMode } from "@mui/icons-material";
import { IconButton } from "@mui/material";

import { useTheme } from "@/hooks";

export const ThemeToggle = () => {
  const { muiTheme, toggleTheme, mode } = useTheme();
  const isLightMode = mode === "light";
  return (
    <IconButton
      onClick={toggleTheme}
      sx={{
        color: isLightMode
          ? muiTheme.palette.primary.contrastText
          : muiTheme.palette.text.primary,
      }}
    >
      {isLightMode ? (
        <LightMode fontSize="small" />
      ) : (
        <DarkMode fontSize="small" />
      )}
    </IconButton>
  );
};
