import {
  Theme as AmpTheme,
  ThemeProvider as AmpThemeProvider,
} from "@aws-amplify/ui-react";
import "@fontsource-variable/noto-sans-mono";
import {
  CssBaseline,
  GlobalStyles,
  ThemeProvider as MuiThemeProvider,
  PaletteMode,
  createTheme,
  darken,
  lighten,
  useMediaQuery,
} from "@mui/material";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useUser } from "@/Context";

export const ThemeContext = createContext({
  toggleTheme: () => {},
  mode: "dark",
});

export const ThemeProvider = (props: PropsWithChildren) => {
  const { currentUserProfile } = useUser();

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const previousThemeMode = localStorage.getItem("theme");
  let defaultTheme = "dark";

  if (!prefersDarkMode) {
    defaultTheme = "light";
  }

  if (previousThemeMode) {
    defaultTheme = previousThemeMode;
  }

  const [mode, setMode] = useState<PaletteMode>(defaultTheme as PaletteMode);

  useEffect(() => {
    // Save the current theme in localStorage
    localStorage.setItem("theme", mode);
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      toggleTheme: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
      mode,
    }),
    [mode],
  );

  // Function to generate scrollbar styles
  const scrollbarStyles = (mode: PaletteMode) => ({
    html: {
      "*::-webkit-scrollbar": {
        width: 8,
        height: 8,
      },
      "*::-webkit-scrollbar-track": {
        backgroundColor: mode === "light" ? "#ccc9c3" : "#2d2a2e",
      },
      "*::-webkit-scrollbar-thumb": {
        backgroundColor: mode === "light" ? "#999692" : "#524c54",
        minHeight: 24,
        minWidth: 24,
      },
      "*::-webkit-scrollbar-thumb:focus": {
        backgroundColor: mode === "light" ? "#656461" : "#776e7a",
      },
      "*::-webkit-scrollbar-thumb:active": {
        backgroundColor: mode === "light" ? "#656461" : "#776e7a",
      },
      "*::-webkit-scrollbar-thumb:hover": {
        backgroundColor: mode === "light" ? "#656461" : "#776e7a",
      },
    },
  });

  const defaultLightPrimary = "#1976d2";
  const defaultDarkPrimary = "#90caf9";
  const lightThemeColor =
    currentUserProfile?.lightThemeColor || defaultLightPrimary;
  const darkThemeColor =
    currentUserProfile?.darkThemeColor || defaultDarkPrimary;

  // MUI Theme configuration
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
          primary: {
            main: mode === "light" ? lightThemeColor : darkThemeColor,
          },
          secondary: {
            main: mode === "light" ? lightThemeColor : darkThemeColor,
          },
          background: {
            default: mode === "light" ? "#fdf9f3" : "#221f22",
            paper: mode === "light" ? "#fffcf4" : "#2d2a2e",
          },
          text: {
            primary: mode === "light" ? "#2c292d" : "#fafbfb",
            secondary: mode === "light" ? "#514b53" : "#c7c7c7",
          },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: scrollbarStyles(mode),
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "lowercase",
              },
            },
          },
        },
      }),
    [mode, lightThemeColor, darkThemeColor],
  );

  // Amplify UI Theme configuration
  const ampTheme = useMemo(
    (): AmpTheme => ({
      name: "customTheme",
      tokens: {
        colors: {
          font: {
            primary: mode === "light" ? "#2c292d" : "#fafbfb",
            secondary: mode === "light" ? "#514b53" : "#c7c7c7",
            focus: mode === "light" ? lightThemeColor : darkThemeColor,
            active: mode === "light" ? lightThemeColor : darkThemeColor,
            inverse: mode === "light" ? "#fffcf4" : "#2d2a2e",
          },
          background: {
            primary: mode === "light" ? "#fffcf4" : "#2d2a2e",
          },
          border: {
            primary: mode === "light" ? "#514b53" : "#c7c7c7",
            focus: mode === "light" ? "#2c292d" : "#fafbfb",
          },
          primary: {
            10: mode === "light" ? "#2c292d" : "#fafbfb",
            20: mode === "light" ? "#514b53" : "#c7c7c7",
            80:
              mode === "light"
                ? lighten(lightThemeColor, 0.2)
                : darken(darkThemeColor, 0.2),
            90:
              mode === "light"
                ? lighten(lightThemeColor, 0.1)
                : darken(darkThemeColor, 0.1),
            100: mode === "light" ? lightThemeColor : darkThemeColor,
          },
        },
        components: {
          authenticator: {
            modal: {
              height: { value: "calc(100vh - 64px)" },
            },
          },
        },
      },
    }),
    [mode, lightThemeColor, darkThemeColor],
  );

  return (
    <ThemeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            html: {
              height: "100%",
            },
            body: {
              height: "100%",
              "#root": {
                height: "100%",
              },
            },
          }}
        />
        {/* {props.children} */}
        <AmpThemeProvider theme={ampTheme}>{props.children}</AmpThemeProvider>
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
