import { Stack, Typography } from "@mui/material";

export const HomePage = (): JSX.Element => {
  return (
    <Stack
      sx={{ height: "100%", width: "100%" }}
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <Typography variant="h2">home page</Typography>
      <Typography variant="caption">(coming soon)</Typography>
    </Stack>
  );
};
