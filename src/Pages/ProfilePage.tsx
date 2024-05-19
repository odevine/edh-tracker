import {
  Avatar,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import { LoadingBackdrop, UserDecksCard, UserProfileForm } from "@/Components";
import { useTheme, useUser } from "@/Context";

export const Profile = (props: { profileId: string }): JSX.Element => {
  const { profileId } = props;
  const { allUserProfiles, usersLoading, authenticatedUser } = useUser();
  const { mode } = useTheme();

  const currentProfile = allUserProfiles.filter(
    (profile) => profile.id === profileId,
  )[0];
  const ownUser = profileId === authenticatedUser?.userId;
  const userColor =
    mode === "light"
      ? currentProfile?.lightThemeColor
      : currentProfile?.darkThemeColor;

  if (!currentProfile) {
    return <LoadingBackdrop />;
  } else {
    return (
      <>
        {usersLoading && <LoadingBackdrop />}
        <Container sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={ownUser ? 4 : 12}>
              <Card sx={{ height: "100%" }}>
                <CardContent sx={{ height: "100%" }}>
                  <Stack
                    spacing={2}
                    alignItems="center"
                    justifyContent="center"
                    sx={{ height: "100%" }}
                  >
                    <Avatar
                      sx={{
                        height: 120,
                        width: 120,
                        backgroundColor: "primary",
                      }}
                      src={currentProfile?.profilePictureURL ?? ""}
                    />
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography
                        sx={{ color: userColor ?? "inherit" }}
                        variant="h5"
                      >
                        {currentProfile.displayName}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            {ownUser && (
              <Grid item xs={12} sm={8}>
                <UserProfileForm />
              </Grid>
            )}
            <Grid item xs={12}>
              <UserDecksCard ownUser={ownUser} userProfile={currentProfile} />
            </Grid>
          </Grid>
        </Container>
      </>
    );
  }
};
