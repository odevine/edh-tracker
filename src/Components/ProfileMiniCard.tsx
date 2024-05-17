import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { DateTime } from "luxon";
import { navigate } from "raviger";

import { User } from "@/API";

interface ProfileMiniCardProps {
  profile?: User;
}

export const ProfileMiniCard: React.FC<ProfileMiniCardProps> = ({
  profile,
}) => {
  return profile ? (
    <Card>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ px: 2, pt: 2 }}
      >
        <Avatar
          src={profile?.profilePictureURL ?? ""}
          alt={profile.displayName}
        />
        <Typography
          variant="h6"
          sx={{
            color: (theme): string =>
              (theme.palette.mode === "light"
                ? profile.lightThemeColor
                : profile.darkThemeColor) ?? theme.palette.text.primary,
          }}
        >
          {profile.displayName}
        </Typography>
        {profile.role && (
          <Chip variant="outlined" size="small" label={profile.role} />
        )}
      </Stack>
      <Stack direction="row" justifyContent="space-between" sx={{ p: 2 }}>
        <Stack sx={{ mr: 2 }}>
          <Typography variant="caption" color="text.secondary">
            joined:
          </Typography>
          {profile.lastOnline && (
            <Typography variant="caption" color="text.secondary">
              last online:
            </Typography>
          )}
        </Stack>
        <Stack alignItems="flex-end">
          <Typography variant="caption" color="text.secondary">
            {DateTime.fromISO(profile.createdAt).toLocaleString(
              DateTime.DATETIME_SHORT,
            )}
          </Typography>
          {profile.lastOnline && (
            <Typography variant="caption" color="text.secondary">
              {DateTime.fromISO(profile.lastOnline).toLocaleString(
                DateTime.DATETIME_SHORT,
              )}
            </Typography>
          )}
        </Stack>
      </Stack>
      <Divider />
      <CardContent>
        <Typography>nothing to see here (yet)</Typography>
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button onClick={() => navigate(`/profile/${profile.id}`)}>
          view profile
        </Button>
      </CardActions>
    </Card>
  ) : null;
};
