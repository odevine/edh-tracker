import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  Modal,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { navigate } from "raviger";
import { useState } from "react";

import { useUser } from "@/context";

export const LandingPage = (): JSX.Element => {
  const [accessRequestOpen, setAccessRequestOpen] = useState(false);
  const { authenticatedUser } = useUser();
   
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
          {!authenticatedUser && <Stack
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
          </Stack>}
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
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h5" gutterBottom>
                deck management
              </Typography>
              <Typography>
                organize, edit, and manage your decks with ease
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h5" gutterBottom>
                match history
              </Typography>
              <Typography>
                log and edit match results for detailed statistics
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h5" gutterBottom>
                easy setup
              </Typography>
              <Typography>
                get started quickly with a user-friendly interface
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Box sx={{ bgcolor: "background.paper", py: 1 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} odevine | licensed under the{" "}
            <Link
              href="https://opensource.org/licenses/MIT"
              target="_blank"
              rel="noopener"
            >
              MIT License
            </Link>
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};
