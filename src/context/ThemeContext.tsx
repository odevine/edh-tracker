import "@fontsource-variable/noto-sans-mono";
import {
  CssBaseline,
  GlobalStyles,
  ThemeProvider as MuiThemeProvider,
  PaletteMode,
  Theme,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import {
  ChartsColorPaletteCallback,
  cheerfulFiestaPalette,
} from "@mui/x-charts";
import type {} from "@mui/x-data-grid/themeAugmentation";
import {
  PropsWithChildren,
  MouseEvent as ReactMouseEvent,
  createContext,
  useCallback,
  useEffect,
  useMemo,
} from "react";

import { useDynamicFavicon, useUser } from "@/hooks";
import { usePersistentState } from "@/hooks/usePersistentState";

interface ThemeContextType {
  mode: PaletteMode;
  muiTheme: Theme;
  chartPalette: ChartsColorPaletteCallback;
  toggleTheme: (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void;
  setLightColor: (color: string) => void;
  setDarkColor: (color: string) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const { currentUserProfile } = useUser();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const defaultLightPrimary = "#1976d2";
  const defaultDarkPrimary = "#90caf9";

  const [mode, setMode] = usePersistentState<PaletteMode>(
    "theme",
    prefersDarkMode ? "dark" : "light",
  );

  const [lightColor, setLightColor] = usePersistentState<string>(
    "lightThemeColor",
    currentUserProfile?.lightThemeColor ?? defaultLightPrimary,
  );

  const [darkColor, setDarkColor] = usePersistentState<string>(
    "darkThemeColor",
    currentUserProfile?.darkThemeColor ?? defaultDarkPrimary,
  );

  useEffect(() => {
    if (currentUserProfile?.lightThemeColor) {
      setLightColor(currentUserProfile.lightThemeColor);
    }
    if (currentUserProfile?.darkThemeColor) {
      setDarkColor(currentUserProfile.darkThemeColor);
    }
  }, [currentUserProfile]);

  // Consolidated theme colors based on mode
  const themeColors = useMemo(() => {
    return {
      primary: mode === "light" ? lightColor : darkColor,
      secondary: mode === "light" ? lightColor : darkColor,
      backgroundDefault: mode === "light" ? "#fdf9f3" : "#221f22",
      backgroundPaper: mode === "light" ? "#fffcf4" : "#2d2a2e",
      textPrimary: mode === "light" ? "#2c292d" : "#fafbfb",
      textSecondary: mode === "light" ? "#514b53" : "#c7c7c7",
      scrollbarColor: mode === "light" ? "#656461" : "#776e7a",
      trackColor: mode === "light" ? "#ccc9c3" : "#2d2a2e",
      thumbColor: mode === "light" ? "#999692" : "#524c54",
    };
  }, [mode, lightColor, darkColor]);

  useDynamicFavicon(themeColors.primary);

  const muiTheme = useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: "Noto Sans Mono Variable, monospace, sans-serif",
          button: {
            textTransform: "none",
          },
        },
        palette: {
          mode,
          primary: { main: themeColors.primary },
          secondary: { main: themeColors.secondary },
          background: {
            default: themeColors.backgroundDefault,
            paper: themeColors.backgroundPaper,
          },
          text: {
            primary: themeColors.textPrimary,
            secondary: themeColors.textSecondary,
          },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              html: {
                "*::-webkit-scrollbar": {
                  width: 8,
                  height: 8,
                },
                "*::-webkit-scrollbar-track": {
                  backgroundColor: themeColors.trackColor,
                },
                "*::-webkit-scrollbar-thumb": {
                  backgroundColor: themeColors.thumbColor,
                  minHeight: 24,
                  minWidth: 24,
                },
                "*::-webkit-scrollbar-thumb:focus": {
                  backgroundColor: themeColors.scrollbarColor,
                },
                "*::-webkit-scrollbar-thumb:active": {
                  backgroundColor: themeColors.scrollbarColor,
                },
                "*::-webkit-scrollbar-thumb:hover": {
                  backgroundColor: themeColors.scrollbarColor,
                },
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "lowercase",
              },
            },
          },
          MuiDataGrid: {
            styleOverrides: {
              root: {
                border: "none",
                "& .MuiDataGrid-cell": {
                  whiteSpace: "nowrap",
                  border: "none",
                },
                "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
                  outline: "none",
                },
                "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": {
                  paddingTop: 8,
                  paddingBottom: 8,
                },
                "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
                  paddingTop: 15,
                  paddingBottom: 15,
                },
                "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell": {
                  paddingTop: 22,
                  paddingBottom: 22,
                },
                "& .MuiDataGrid-row": {
                  alignItems: "center",
                },
              },
            },
          },
        },
      }),
    [mode, themeColors],
  );

  const toggleTheme = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
      const xPos = event.clientX ?? 0;
      const yPos = event.clientY ?? 0;
      const nextThemeMode: PaletteMode = mode === "light" ? "dark" : "light";

      document.documentElement.style.setProperty("--x", `${xPos}px`);
      document.documentElement.style.setProperty("--y", `${yPos}px`);

      if ("startViewTransition" in document) {
        (document as any).startViewTransition(() => {
          setMode(nextThemeMode); // trigger theme change right here
        });
      } else {
        setMode(nextThemeMode);
      }

      localStorage.setItem("theme", nextThemeMode);
    },
    [mode, setMode],
  );

  const colorMode: ThemeContextType = useMemo(
    () => ({
      mode,
      muiTheme,
      chartPalette: cheerfulFiestaPalette,
      toggleTheme,
      setLightColor,
      setDarkColor,
    }),
    [mode, setLightColor, setDarkColor, muiTheme],
  );

  return (
    <ThemeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            html: { height: "100%" },
            body: {
              height: "100%",
              "#root": { height: "100%" },
            },
            "::view-transition-old(root)": {
              animation: "none",
            },
            "::view-transition-new(root)": {
              animation: "rippleReveal 600ms cubic-bezier(0.4, 0, 0.2, 1)",
              clipPath: "circle(0% at var(--x, 50%) var(--y, 50%))",
            },
            "@keyframes rippleReveal": {
              "0%": {
                clipPath: "circle(0% at var(--x, 50%) var(--y, 50%))",
              },
              "100%": {
                clipPath: "circle(150% at var(--x, 50%) var(--y, 50%))",
              },
            },
          }}
        />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
