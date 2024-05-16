import { useApp } from "@/Context";
import { Button, Stack, Typography } from "@mui/material";

export const HomePage = (): JSX.Element => {
  const { addAppMessage } = useApp();
  return (
    <Stack
      sx={{ height: "100%", width: "100%", textAlign: "center" }}
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <Typography variant="h2">home page</Typography>
      <Typography variant="caption">(coming soon)</Typography>
      <Button
        color="success"
        onClick={() =>
          addAppMessage({
            content: "test words",
            severity: "success",
          })
        }
      >
        success
      </Button>
      <Button
        color="info"
        onClick={() =>
          addAppMessage({
            content: "test words",
            severity: "info",
          })
        }
      >
        info
      </Button>
      <Button
        color="warning"
        onClick={() =>
          addAppMessage({
            content: "test words",
            severity: "warning",
          })
        }
      >
        warning
      </Button>
      <Button
        color="error"
        onClick={() =>
          addAppMessage({
            content: "test words",
            severity: "error",
          })
        }
      >
        error
      </Button>
    </Stack>
  );
};
