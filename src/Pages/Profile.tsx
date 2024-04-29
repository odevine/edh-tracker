import { useAuthenticator } from "@aws-amplify/ui-react";
import { Typography } from "@mui/material";

export const Profile = (): JSX.Element => {
  const { user } = useAuthenticator((context) => [context.user]);
  return (
    <>
      <Typography variant="h5">your username is {user.username}</Typography>
      <Typography variant="h5">your id is {user.userId}</Typography>
    </>
  );
};
