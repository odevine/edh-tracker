import { Login, Menu as MenuIcon } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  MenuItemProps,
  Toolbar as MuiToolbar,
  Stack,
  Typography,
} from "@mui/material";
import { navigate } from "raviger";
import { useState } from "react";

import { ThemeToggle } from "@/Components";
import { useUser } from "@/Context";

export const Toolbar = () => {
  const { authenticatedUser, currentUserProfile, signOutUser } = useUser();

  const [userMenuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems = [
    { label: "overview", action: () => navigate("/"), disabled: false },
    {
      label: "decks",
      action: () => navigate("/decks"),
      disabled: !authenticatedUser,
    },
    {
      label: "matches",
      action: () => navigate("/matches"),
      disabled: !authenticatedUser,
    },
  ];

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
    <>
      <AppBar position="static" component="nav">
        <MuiToolbar>
          <IconButton
            edge="start"
            sx={{ mr: 2, display: { sm: "none" } }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Stack
            direction="row"
            spacing={1}
            sx={{ display: { xs: "none", sm: "flex" } }}
          >
            {navItems.map((item) => (
              <CustomMenuItem
                onClick={item.action}
                disabled={item.disabled}
                key={item.label}
              >
                {item.label}
              </CustomMenuItem>
            ))}
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
      <nav>
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 240,
            },
          }}
        >
          <Typography variant="h6" sx={{ mx: "auto", my: 2 }}>
            hehEDH
          </Typography>
          <Divider />
          <List>
            {navItems.map((item) => (
              <ListItem
                key={item.label}
                disablePadding
                onClick={() => {
                  item.action();
                  setDrawerOpen(false);
                }}
              >
                <ListItemButton sx={{ textAlign: "center" }}>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
      </nav>
    </>
  );
};
