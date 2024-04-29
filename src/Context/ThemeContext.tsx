import "@fontsource/noto-mono";
import {
  CssBaseline,
  GlobalStyles,
  ThemeProvider as MuiThemeProvider,
  PaletteColorOptions,
  PaletteMode,
  createTheme,
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

export const ThemeContext = createContext({
  toggleTheme: () => {},
  mode: "dark",
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = (props: PropsWithChildren) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const defaultTheme =
    localStorage.getItem("theme") ?? prefersDarkMode ? "dark" : "light";
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

  const theme = useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: "Noto Mono, monospace",
        },
        palette: {
          mode,
          ...(mode === "light"
            ? ({
                primary: {
                  main: "#fc8d57",
                },
                secondary: {
                  main: "#ff6188",
                },
                background: {
                  default: "#fdf9f3",
                  paper: "#fffcf4",
                },
                text: {
                  primary: "#2c292d",
                  secondary: "#514b53",
                },
              } as PaletteColorOptions)
            : ({
                primary: {
                  main: "#ab9df2",
                },
                secondary: {
                  main: "#78dce8",
                },
                background: {
                  default: "#221f22",
                  paper: "#2d2a2e",
                },
                text: {
                  primary: "#fafbfb",
                  secondary: "#c7c7c7",
                },
              } as PaletteColorOptions)),
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              html: {
                "*::-webkit-scrollbar": {
                  width: 8,
                },
                "*::-webkit-scrollbar-track": {
                  backgroundColor: mode === "light" ? "#ccc9c3" : "#2d2a2e",
                },
                "*::-webkit-scrollbar-thumb": {
                  backgroundColor: mode === "light" ? "#999692" : "#524c54",
                  minHeight: 24,
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
            },
          },
        },
      }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
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
        {props.children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
