import { useAuthenticator } from "@aws-amplify/ui-react";
import { AccountCircle, Login } from "@mui/icons-material";
import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  MenuItemProps,
  Toolbar as MuiToolbar,
  Stack,
} from "@mui/material";
import { navigate } from "raviger";
import { useState } from "react";

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

  const handleNavigate = (path: string) => {
    navigate(path);
    handleUserMenuClose();
  };

  const handleSignOut = async () => {
    signOut();
    handleUserMenuClose();
  };

  const loggedInOptions = [
    <MenuItem key="profile" onClick={() => handleNavigate("/profile")}>
      View Profile
    </MenuItem>,
    <MenuItem key="logout" onClick={handleSignOut}>
      Log Out
    </MenuItem>,
  ];

  const loggedOutOptions = [
    <MenuItem key="login" onClick={() => handleNavigate("/login")}>
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

  const CustomMenuItem = (props: MenuItemProps) => (
    <MenuItem sx={{ borderRadius: 2 }} {...props} />
  );

  return (
    <AppBar position="static">
      <MuiToolbar>
        <Stack direction="row" spacing={1}>
          <CustomMenuItem onClick={() => navigate("/")}>
            overview
          </CustomMenuItem>
          <CustomMenuItem onClick={() => navigate("/decks")}>
            decks
          </CustomMenuItem>
          <CustomMenuItem onClick={() => navigate("/matches")}>
            matches
          </CustomMenuItem>
        </Stack>

        <Box flexGrow={1} />
        <Stack direction="row" spacing={1}>
          <ThemeToggle />
          <IconButton onClick={handleUserMenuOpen}>
            {user ? <AccountCircle /> : <Login />}
          </IconButton>
        </Stack>
      </MuiToolbar>
      {renderUserMenu}
    </AppBar>
  );
};
