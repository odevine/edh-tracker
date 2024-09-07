import { Button, Container, Paper, Stack, Typography } from "@mui/material";
import { navigate } from "raviger";

import { useUser } from "@/Context";

export const HomePage = (): JSX.Element => {
  const { authenticatedUser } = useUser();

  if (!authenticatedUser) {
    return (
      <Container sx={{ p: 3 }}>
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{ height: "calc(100vh - 64px)" }}
        >
          <Paper
            sx={{
              width: 340,
              height: 200,
              p: 2,
            }}
          >
            <Stack
              direction="column"
              alignItems="center"
              justifyContent="center"
              spacing={2}
              sx={{ height: "100%", textAlign: "center" }}
            >
              <Typography variant="h4">login to access edh tracker</Typography>
              <Button variant="contained" onClick={() => navigate("/login")}>
                log in
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    );
  }

  return (
    <Stack
      sx={{ height: "100%", width: "100%", textAlign: "center" }}
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <Typography variant="h2">home page</Typography>
      <Typography variant="caption">(coming soon?)</Typography>
    </Stack>
  );
};
