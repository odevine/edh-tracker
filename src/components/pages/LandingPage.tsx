import { HistoryEdu, LibraryBooks, RocketLaunch } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Link,
  Modal,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";

import { navigate } from "raviger";
import { useState } from "react";

import { useAuth, useTheme } from "@/hooks";

const features = [
  {
    icon: <LibraryBooks fontSize="large" color="primary" />,
    title: "deck management",
    description: "organize, edit, and manage your decks with ease",
  },
  {
    icon: <HistoryEdu fontSize="large" color="primary" />,
    title: "match history",
    description: "log and edit match results for detailed statistics",
  },
  {
    icon: <RocketLaunch fontSize="large" color="primary" />,
    title: "easy setup",
    description: "get started quickly with a user-friendly interface",
  },
];

const FeatureCards = (): JSX.Element => {
  const { muiTheme } = useTheme();
  const isSm = useMediaQuery(muiTheme.breakpoints.down("sm"));

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      justifyContent="center"
      gap={4}
      sx={{ mt: 4 }}
    >
      {features.map((feature) => (
        <Paper
          key={feature.title}
          elevation={0}
          sx={{
            flex: `1 1 ${isSm ? "100%" : "250px"}`,
            padding: 3,
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "background.default",
            borderRadius: 2,
            minWidth: "250px",
            maxWidth: "300px",
            textAlign: "center",
          }}
        >
          <Stack spacing={1} alignItems="center">
            {feature.icon}
            <Typography variant="subtitle1" fontWeight={600}>
              {feature.title}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {feature.description}
            </Typography>
          </Stack>
        </Paper>
      ))}
    </Box>
  );
};

export const LandingPage = (): JSX.Element => {
  const [accessRequestOpen, setAccessRequestOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <Box height="100%" display="flex" flexDirection="column">
      <Box sx={{ py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h3" gutterBottom align="center">
            edh tracker
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="textSecondary"
            paragraph
          >
            manage your commander decks and track your match history
            effortlessly
          </Typography>
          {!isAuthenticated && (
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={2}
              sx={{ mt: 4 }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/login")}
                sx={{ width: 200 }}
              >
                login
              </Button>
              <Typography color="textSecondary">or</Typography>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setAccessRequestOpen(true)}
                sx={{ width: 200 }}
              >
                request access
              </Button>
            </Stack>
          )}
        </Container>
      </Box>

      <Modal
        open={accessRequestOpen}
        onClose={() => setAccessRequestOpen(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: "8px",
            boxShadow: 24,
            p: 4,
            outline: "none",
          }}
        >
          <Typography variant="h6" component="h2" align="center">
            requesting access
          </Typography>
          <Typography sx={{ mt: 2 }} align="center" variant="body2">
            the application is not currently open to the public, if you would
            like to request access, please email:
          </Typography>
          <Link
            href="mailto:edh@devine.dev?subject=Access&Request&body=Message%20Here"
            sx={{ textDecoration: "none" }}
          >
            <Typography align="center" color="textSecondary" sx={{ mt: 2 }}>
              edh@devine.dev
            </Typography>
          </Link>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setAccessRequestOpen(false)}
            sx={{ display: "block", margin: "20px auto 0" }}
          >
            close
          </Button>
        </Box>
      </Modal>

      <Container sx={{ py: 8, flexGrow: 1 }} maxWidth="md">
        <FeatureCards />
      </Container>
    </Box>
  );
};
