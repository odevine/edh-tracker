import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { MuiColorInput } from "mui-color-input";
import { useState } from "react";

import { useAuth, useUser } from "@/hooks";
import { UpdateUserInput } from "@/types";

const convertToColor = (input: string) => {
  const validHexColor = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;

  if (validHexColor.test(input)) {
    if (input[0] !== "#") {
      input = "#" + input;
    }

    if (input.length === 4) {
      input =
        "#" + input[1] + input[1] + input[2] + input[2] + input[3] + input[3];
    }

    return input;
  } else {
    return null;
  }
};

export const UserProfileForm: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { currentUserProfile, updateUserProfile } = useUser();

  const [displayName, setDisplayName] = useState(
    currentUserProfile?.displayName ?? "",
  );
  const [lightThemeColor, setLightThemeColor] = useState(
    currentUserProfile?.lightThemeColor ?? "",
  );
  const [darkThemeColor, setDarkThemeColor] = useState(
    currentUserProfile?.darkThemeColor ?? "",
  );
  const [profilePictureURL, setProfilePictureURL] = useState(
    currentUserProfile?.profilePictureURL ?? "",
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const validateForm = (): boolean => {
    const localErrors: string[] = [];

    if (displayName.length > 16) {
      localErrors.push("16 character limit on display names");
    }

    const validatedLightThemeColor = convertToColor(lightThemeColor);
    const validatedDarkThemeColor = convertToColor(darkThemeColor);
    if (lightThemeColor !== "" && !validatedLightThemeColor) {
      localErrors.push(
        "Invalid format for light theme color, please use '#xxx' or '#xxxxxx'",
      );
    }
    if (darkThemeColor !== "" && !validatedDarkThemeColor) {
      localErrors.push(
        "Invalid format for dark theme color, please use '#xxx' or '#xxxxxx'",
      );
    }

    setErrors(localErrors);
    return localErrors.length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isAuthenticated) {
      console.error("user is not authenticated");
      return;
    }

    if (validateForm()) {
      const updateData: UpdateUserInput = {
        displayName,
        lightThemeColor: convertToColor(lightThemeColor) ?? undefined,
        darkThemeColor: convertToColor(darkThemeColor) ?? undefined,
        profilePictureURL:
          profilePictureURL !== "" ? profilePictureURL : undefined,
      };

      setLoading(true);
      try {
        await updateUserProfile(updateData);
      } catch (error) {
        console.error("failed to update profile:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Card>
      <CardHeader title="profile" />
      <Divider />
      <CardContent>
        <Stack spacing={3}>
          <TextField
            label="display name"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
          />
          <MuiColorInput
            isAlphaHidden
            label="light theme color"
            format="hex"
            value={lightThemeColor}
            onChange={(value: string) => setLightThemeColor(value)}
          />
          <MuiColorInput
            isAlphaHidden
            label="dark theme color"
            format="hex"
            value={darkThemeColor}
            onChange={(value: string) => setDarkThemeColor(value)}
          />
          <TextField
            label="profile picture url"
            value={profilePictureURL}
            onChange={(event) => setProfilePictureURL(event.target.value)}
          />
          <Stack spacing={0}>
            {errors.length > 0 &&
              errors.map((err) => (
                <Typography key={err} color="error" variant="caption">
                  {err}
                </Typography>
              ))}
          </Stack>
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          onClick={handleSubmit}
          sx={{ width: 150, height: 40 }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: "inherit" }} />
          ) : (
            "update profile"
          )}
        </Button>
      </CardActions>
    </Card>
  );
};
