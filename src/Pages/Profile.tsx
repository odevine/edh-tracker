import { useAuthenticator } from "@aws-amplify/ui-react";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export const Profile = (): JSX.Element => {
  const { user } = useAuthenticator((context) => [context.user]);
  const STACK_SPACING = 3;
  return (
    <Container sx={{ p: STACK_SPACING }}>
      <Stack spacing={STACK_SPACING}>
        <Stack direction="row" spacing={STACK_SPACING}>
          <Card sx={{ flexGrow: 1 }}>
            <CardContent sx={{ height: "100%" }}>
              <Stack
                spacing={2}
                alignItems="center"
                justifyContent="center"
                sx={{ height: "100%" }}
              >
                <Avatar sx={{ height: 120, width: 120 }} />
                <Typography>{user.username}</Typography>
              </Stack>
            </CardContent>
          </Card>
          <Card sx={{ flexGrow: 3 }}>
            <CardHeader title="profile" />
            <Divider />
            <CardContent>
              <Stack spacing={STACK_SPACING}>
                <TextField label="display name" />
                <TextField label="theme color" />
              </Stack>
            </CardContent>
            <CardActions sx={{ justifyContent: "flex-end" }}>
              <Button variant="contained">update profile</Button>
            </CardActions>
          </Card>
        </Stack>
        <Card>
          <CardHeader title="change password" />
          <Divider />
          <CardContent>
            <Stack spacing={STACK_SPACING}>
              <TextField label="password" />
              <TextField label="confirm password" />
            </Stack>
          </CardContent>
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Button variant="contained">update password</Button>
          </CardActions>
        </Card>
      </Stack>
    </Container>
  );
};
