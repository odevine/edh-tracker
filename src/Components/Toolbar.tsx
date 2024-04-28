import { useState } from "react";
import { navigate } from "raviger";
import {
  Box,
  IconButton,
  AppBar,
  Menu,
  MenuItem,
  Toolbar as MuiToolbar,
  Typography,
} from "@mui/material";
import { AccountCircle, Login } from "@mui/icons-material";
import { useAuthenticator } from "@aws-amplify/ui-react";

import { ThemeToggle } from "@/Components";

export const Toolbar = () => {
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  const [userMenuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const isUserMenuOpen = Boolean(userMenuAnchor);

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleSignIn = () => {
    navigate("/login");
    handleUserMenuClose();
  };

  const handleSignOut = async () => {
    signOut();
    handleUserMenuClose();
  };

  const loggedInOptions = [
    <MenuItem key="logout" onClick={handleSignOut}>
      Log Out
    </MenuItem>,
  ];

  const loggedOutOptions = [
    <MenuItem key="login" onClick={handleSignIn}>
      Log In
    </MenuItem>,
  ];

  const renderUserMenu = (
    <Menu
      anchorEl={userMenuAnchor}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={"user-menu"}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isUserMenuOpen}
      onClose={handleUserMenuClose}
    >
      {user ? loggedInOptions : loggedOutOptions}
    </Menu>
  );

  return (
    <AppBar position="static">
      <MuiToolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ display: { xs: "none", sm: "block" } }}
        >
          EDH Tracker
        </Typography>
        <Box flexGrow={1} />
        <ThemeToggle />
        <IconButton onClick={handleUserMenuOpen}>
          {user ? <AccountCircle /> : <Login />}
        </IconButton>
      </MuiToolbar>
      {renderUserMenu}
    </AppBar>
  );
};
