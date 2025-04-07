import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { navigate } from "raviger";
import { useState } from "react";

import { useAuth } from "@/hooks";

export const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { signIn, isAuthenticated } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signIn(username, password);
    } catch (err: any) {
      setError(err?.message || "login failed");
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    navigate("/users");
  }

  return (
    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
      <Paper
        elevation={3}
        sx={{ p: 4, borderRadius: 2, minWidth: 300, maxWidth: 440 }}
      >
        <Stack alignItems="center">
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            sign in
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
              {error}
            </Alert>
          )}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 3, width: "100%" }}
          >
            <TextField
              fullWidth
              required
              label="username"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
            <TextField
              fullWidth
              required
              label="password"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : "sign in"}
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
};
