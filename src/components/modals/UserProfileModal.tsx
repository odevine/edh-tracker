import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { MuiColorInput } from "mui-color-input";
import { useEffect, useState } from "react";

import { useAuth, useUser } from "@/hooks";
import { UpdateUserInput } from "@/types";

const convertToColor = (input: string) => {
  const validHexColor = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
  if (validHexColor.test(input)) {
    if (input[0] !== "#") input = "#" + input;
    if (input.length === 4) {
      input =
        "#" + input[1] + input[1] + input[2] + input[2] + input[3] + input[3];
    }
    return input;
  }
  return null;
};

export const UserProfileModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { isAuthenticated } = useAuth();
  const { currentUserProfile, updateUserProfile } = useUser();

  const [displayName, setDisplayName] = useState("");
  const [lightThemeColor, setLightThemeColor] = useState("");
  const [darkThemeColor, setDarkThemeColor] = useState("");
  const [profilePictureURL, setProfilePictureURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (currentUserProfile) {
      setDisplayName(currentUserProfile.displayName ?? "");
      setLightThemeColor(currentUserProfile.lightThemeColor ?? "");
      setDarkThemeColor(currentUserProfile.darkThemeColor ?? "");
      setProfilePictureURL(currentUserProfile.profilePictureURL ?? "");
    }
  }, [currentUserProfile, open]);

  const validateForm = (): boolean => {
    const localErrors: string[] = [];

    if (displayName.length > 16) {
      localErrors.push("16 character limit on display names");
    }

    if (lightThemeColor && !convertToColor(lightThemeColor)) {
      localErrors.push("Invalid light theme color");
    }
    if (darkThemeColor && !convertToColor(darkThemeColor)) {
      localErrors.push("Invalid dark theme color");
    }

    setErrors(localErrors);
    return localErrors.length === 0;
  };

  const handleSubmit = async () => {
    if (!isAuthenticated || !validateForm()) {
      return;
    }

    const updateData: UpdateUserInput = {
      displayName,
      lightThemeColor: convertToColor(lightThemeColor) ?? undefined,
      darkThemeColor: convertToColor(darkThemeColor) ?? undefined,
      profilePictureURL: profilePictureURL || undefined,
    };

    setLoading(true);
    try {
      await updateUserProfile(updateData);
      onClose();
    } catch (e) {
      console.error("Update failed", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          minWidth: { xs: 310, sm: 420 },
          maxWidth: "90vw",
          outline: "none",
        }}
      >
        <Typography variant="h6" gutterBottom>
          edit profile
        </Typography>
        <Stack spacing={3}>
          <TextField
            label="display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <MuiColorInput
            isAlphaHidden
            label="light theme color"
            format="hex"
            value={lightThemeColor}
            onChange={setLightThemeColor}
          />
          <MuiColorInput
            isAlphaHidden
            label="dark theme color"
            format="hex"
            value={darkThemeColor}
            onChange={setDarkThemeColor}
          />
          <TextField
            label="profile picture url"
            value={profilePictureURL}
            onChange={(e) => setProfilePictureURL(e.target.value)}
          />
          {errors.map((err) => (
            <Typography key={err} color="error" variant="caption">
              {err}
            </Typography>
          ))}
          <Stack direction="row" justifyContent="flex-end">
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={loading}
              sx={{ width: 150, height: 40 }}
            >
              {loading ? <CircularProgress size={24} /> : "update profile"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};
