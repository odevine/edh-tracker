import { Backdrop, CircularProgress } from "@mui/material";

import { useTheme } from "@/Context";

export const LoadingBackdrop = (): JSX.Element => {
  const { mode } = useTheme();
  return (
    <Backdrop
      open
      sx={{
        color:
          mode === "light"
            ? (theme) => theme.palette.background.paper
            : (theme) => theme.palette.primary.main,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};
