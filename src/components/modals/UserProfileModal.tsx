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
  const { currentUserProfile, updateUserProfile, usersLoading } = useUser();

  const [displayName, setDisplayName] = useState("");
  const [status, setStatus] = useState("");
  const [lightThemeColor, setLightThemeColor] = useState("");
  const [darkThemeColor, setDarkThemeColor] = useState("");
  const [profilePictureURL, setProfilePictureURL] = useState("");
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

    if (displayName.trim().length > 16 || displayName.trim().length < 3) {
      localErrors.push("display names should be 3-16 characters");
    }

    if (status.trim().length > 40) {
      localErrors.push("statuses should be less than 40 characters");
    }

    if (lightThemeColor && !convertToColor(lightThemeColor)) {
      localErrors.push("invalid light theme color");
    }
    if (darkThemeColor && !convertToColor(darkThemeColor)) {
      localErrors.push("invalid dark theme color");
    }

    setErrors(localErrors);
    return localErrors.length === 0;
  };

  const handleSubmit = async () => {
    if (!isAuthenticated || !validateForm()) {
      return;
    }

    const updateData: UpdateUserInput = {
      displayName: displayName.trim(),
      status: status.trim(),
      lightThemeColor: convertToColor(lightThemeColor) ?? undefined,
      darkThemeColor: convertToColor(darkThemeColor) ?? undefined,
      profilePictureURL: profilePictureURL || undefined,
    };

    await updateUserProfile(updateData);
    onClose();
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
          pt: 2,
          px: 4,
          pb: 3,
          minWidth: { xs: 310, sm: 420 },
          outline: "none",
          "&:focus": {
            outline: "none",
          },
        }}
      >
        <Typography variant="h6" gutterBottom>
          edit profile
        </Typography>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            required
            label="display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <TextField
            label="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
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
              disabled={usersLoading}
              sx={{ width: 150, height: 40 }}
            >
              {usersLoading ? <CircularProgress size={24} /> : "update profile"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};
