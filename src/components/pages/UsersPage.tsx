import { Paper } from "@mui/material";

import { UsersTable } from "@/components";

export const UsersPage = (): JSX.Element => (
  <Paper sx={{ height: "100%", minWidth: 740 }}>
    <UsersTable customButtons={[]} />
  </Paper>
);
