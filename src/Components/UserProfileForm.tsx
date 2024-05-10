import {
  Button,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";

import { useUser } from "@/Context";
import { updateUserProfile } from "@/Logic";

export const UserProfileForm: React.FC = () => {
  const {
    authenticatedUser,
    currentUserProfile: userProfile,
    setCurrentUserProfile: setUserProfile,
  } = useUser();
  const [displayName, setDisplayName] = useState(
    userProfile?.displayName ?? "",
  );
  const [themeColor, setThemeColor] = useState(userProfile?.themeColor ?? "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!authenticatedUser) {
      console.error("User is not authenticated");
      return;
    }
    const updateData = {
      id: authenticatedUser.userId,
      displayName,
      themeColor,
    };
    setLoading(true);
    const updatedUser = await updateUserProfile(updateData.id, updateData);
    setUserProfile(updatedUser);
    setLoading(false);
    if (updatedUser) {
      console.log("Profile updated successfully:", updatedUser);
    } else {
      console.log("Failed to update profile.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
            label="theme color"
            value={themeColor}
            onChange={(event) => setThemeColor(event.target.value)}
          />
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{ width: 150, height: 40 }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: "inherit" }} />
          ) : (
            "update profile"
          )}
        </Button>
      </CardActions>
    </form>
  );
};
