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

type AuthMode = "signIn" | "forgotPassword" | "forgotPasswordConfirm";

export const LoginPage = () => {
  const {
    signIn,
    completeNewPasswordChallenge,
    forgotPassword,
    confirmForgotPassword,
    isAuthenticated,
    newPasswordChallenge,
  } = useAuth();

  const [authMode, setAuthMode] = useState<AuthMode>("signIn");

  // user auth inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // forgot password flow inputs
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotCode, setForgotCode] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate("/users");
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (newPasswordChallenge) {
        await completeNewPasswordChallenge(newPassword);
      } else if (authMode === "signIn") {
        await signIn(username, password);
      } else if (authMode === "forgotPassword") {
        await forgotPassword(forgotEmail);
        setAuthMode("forgotPasswordConfirm");
      } else if (authMode === "forgotPasswordConfirm") {
        await confirmForgotPassword(forgotEmail, forgotCode, forgotNewPassword);
        setAuthMode("signIn");
      }
    } catch (err: any) {
      setError(err?.message ?? "operation failed");
    } finally {
      setLoading(false);
    }
  };

  const renderModeSwitch = () => {
    if (newPasswordChallenge) {
      return null;
    }

    return (
      <Button
        onClick={() =>
          setAuthMode(authMode === "signIn" ? "forgotPassword" : "signIn")
        }
      >
        {authMode === "signIn" ? "forgot password?" : "back to sign-in"}
      </Button>
    );
  };

  const renderFormFields = () => {
    if (newPasswordChallenge) {
      return (
        <TextField
          fullWidth
          required
          label="new password"
          type="password"
          margin="normal"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      );
    }

    if (authMode === "forgotPassword") {
      return (
        <TextField
          fullWidth
          required
          label="email"
          margin="normal"
          value={forgotEmail}
          onChange={(e) => setForgotEmail(e.target.value)}
        />
      );
    }

    if (authMode === "forgotPasswordConfirm") {
      return (
        <>
          <TextField
            fullWidth
            required
            label="verification code"
            margin="normal"
            value={forgotCode}
            onChange={(e) => setForgotCode(e.target.value)}
          />
          <TextField
            fullWidth
            required
            label="new password"
            type="password"
            margin="normal"
            value={forgotNewPassword}
            onChange={(e) => setForgotNewPassword(e.target.value)}
          />
        </>
      );
    }

    return (
      <>
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
      </>
    );
  };

  const getHeading = () => {
    if (newPasswordChallenge) {
      return "set new password";
    }

    if (authMode === "forgotPassword") {
      return "forgot password";
    }

    if (authMode === "forgotPasswordConfirm") {
      return "reset your password";
    }

    return "sign in";
  };

  const getButtonText = () => {
    if (loading) {
      return <CircularProgress size={24} />;
    }

    if (newPasswordChallenge) {
      return "set password";
    }

    if (authMode === "forgotPassword") {
      return "send verification code";
    }

    if (authMode === "forgotPasswordConfirm") {
      return "reset password";
    }

    return "sign in";
  };

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
            {getHeading()}
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
            {renderFormFields()}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {getButtonText()}
            </Button>
          </Box>
          {renderModeSwitch()}
        </Stack>
      </Paper>
    </Stack>
  );
};
