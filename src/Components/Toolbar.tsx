import { Login } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Menu,
  MenuItem,
  MenuItemProps,
  Toolbar as MuiToolbar,
  Stack,
} from "@mui/material";
import { navigate } from "raviger";
import { useState } from "react";

import { ThemeToggle } from "@/Components";
import { useUser } from "@/Context";

export const Toolbar = () => {
  const { authenticatedUser, currentUserProfile, signOutUser } = useUser();

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
    handleUserMenuClose();
    signOutUser();
  };

  const loggedInOptions = [
    <MenuItem
      key="profile"
      onClick={() => handleNavigate(`/profile/${authenticatedUser?.userId}`)}
    >
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
      {authenticatedUser ? loggedInOptions : loggedOutOptions}
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
          <CustomMenuItem
            onClick={() => navigate("/decks")}
            disabled={!authenticatedUser}
          >
            decks
          </CustomMenuItem>
          <CustomMenuItem
            onClick={() => navigate("/matches")}
            disabled={!authenticatedUser}
          >
            matches
          </CustomMenuItem>
        </Stack>

        <Box flexGrow={1} />
        <Stack direction="row" spacing={1}>
          <ThemeToggle />
          <Avatar
            onClick={handleUserMenuOpen}
            src={currentUserProfile?.profilePictureURL ?? ""}
            sx={{
              backgroundColor: (theme) => theme.palette.primary.main,
              cursor: "pointer",
            }}
          >
            {!authenticatedUser && (
              <Login
                sx={{
                  color: (theme) => theme.palette.text.primary,
                }}
              />
            )}
          </Avatar>
        </Stack>
      </MuiToolbar>
      {renderUserMenu}
    </AppBar>
  );
};
