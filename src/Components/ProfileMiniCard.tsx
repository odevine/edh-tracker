import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
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
      <Grid container spacing={2} alignItems="center" sx={{ p: 2 }}>
        <Grid item>
          <Avatar
            src={profile?.profilePictureURL ?? ""}
            alt={profile.displayName}
          />
        </Grid>
        <Grid item>
          <Stack direction="row" alignItems="center" spacing={1}>
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
          <Typography variant="body2" color="textSecondary">
            joined: {new Date(profile.createdAt).toLocaleDateString()}
          </Typography>
        </Grid>
      </Grid>
      <Divider />
      <CardContent>
        <Typography variant="body2" color="textSecondary">matches: no idea</Typography>
        <Typography variant="body2" color="textSecondary">wins: no idea</Typography>
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
