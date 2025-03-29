import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { IconButton } from "@mui/material";

import { useTheme } from "@/context";

export const ThemeToggle = () => {
  const { toggleTheme, mode } = useTheme();
  return (
    <IconButton
      onClick={toggleTheme}
      sx={{
        color: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.background.paper
            : theme.palette.text.primary,
      }}
    >
      {mode === "light" ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
};
