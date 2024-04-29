import { navigate } from "raviger";
import { Button, Typography } from "@mui/material";

export const Home = (): JSX.Element => {
  return (
    <>
      <Typography>Home Page</Typography>
      <Button variant="outlined" onClick={() => navigate("/protected")}>
        Protected Page
      </Button>
    </>
  );
};
