import {
  Theme as AmpTheme,
  ThemeProvider as AmpThemeProvider,
} from "@aws-amplify/ui-react";
import "@fontsource-variable/noto-sans-mono";
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

export const ThemeProvider = (props: PropsWithChildren) => {
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

  const ampTheme = useMemo(
    (): AmpTheme => ({
      name: "heheTheme",
      tokens: {
        colors: {
          ...(mode === "light"
            ? {
                font: {
                  primary: "#2c292d",
                  secondary: "#514b53",
                  focus: "#fc8d57",
                  active: "#fc8d57",
                },
                background: {
                  primary: "#fffcf4",
                },
                border: {
                  primary: "#514b53",
                  focus: "#2c292d",
                },
                primary: {
                  10: "#2c292d",
                  20: "#514b53",
                  80: "#fc8d57",
                  90: "#ff9958",
                },
              }
            : {
                font: {
                  primary: "#fafbfb",
                  secondary: "#c7c7c7",
                  focus: "#ab9df2",
                },
                background: {
                  primary: "#2d2a2e",
                },
                border: {
                  primary: "#c7c7c7",
                  focus: "#fafbfb",
                },
                primary: {
                  10: "#fafbfb",
                  20: "#c7c7c7",
                  80: "#ab9df2",
                  90: "#746ba5",
                },
              }),
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
    [mode],
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
