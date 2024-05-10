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
import { useState } from "react";

import { useUser } from "@/Context";
import { updateUserProfile } from "@/Logic";

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
  const {
    authenticatedUser,
    currentUserProfile: userProfile,
    setCurrentUserProfile: setUserProfile,
  } = useUser();
  const [displayName, setDisplayName] = useState(
    userProfile?.displayName ?? "",
  );
  const [lightThemeColor, setLightThemeColor] = useState(
    userProfile?.lightThemeColor ?? "",
  );
  const [darkThemeColor, setDarkThemeColor] = useState(
    userProfile?.darkThemeColor ?? "",
  );
  const [profilePictureURL, setProfilePictureURL] = useState(
    userProfile?.profilePictureURL ?? "",
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
    if (!authenticatedUser) {
      console.error("User is not authenticated");
      return;
    }

    if (validateForm()) {
      const updateData = {
        id: authenticatedUser.userId,
        displayName: displayName || null,
        lightThemeColor: convertToColor(lightThemeColor) || null,
        darkThemeColor: convertToColor(darkThemeColor) || null,
        profilePictureURL: profilePictureURL !== "" ? profilePictureURL : null,
      };

      setLoading(true);
      try {
        const updatedUser = await updateUserProfile(updateData.id, updateData);
        // setUserProfile(updatedUser);
        console.log("Profile updated successfully:", updatedUser);
      } catch (error) {
        console.error("Failed to update profile:", error);
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
          <TextField
            label="light theme color"
            value={lightThemeColor}
            onChange={(event) => setLightThemeColor(event.target.value)}
          />
          <TextField
            label="dark theme color"
            value={darkThemeColor}
            onChange={(event) => setDarkThemeColor(event.target.value)}
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
