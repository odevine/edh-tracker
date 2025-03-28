import { Login, Menu as MenuIcon } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  MenuItemProps,
  Toolbar as MuiToolbar,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { navigate, usePath } from "raviger";
import { useState } from "react";

import { ThemeToggle } from "@/Components";
import { useTheme, useUser } from "@/Context";

export const Toolbar = () => {
  const { authenticatedUser, currentUserProfile, signOutUser } = useUser();
  const { mode } = useTheme();

  const [userMenuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const appVersion = import.meta.env.APP_VERSION;

  interface NavItem {
    label: string;
    action: () => void;
    disabled: boolean;
    pathMatch: RegExp;
  }
  const navItems: NavItem[] = [
    {
      label: "home",
      action: () => navigate("/"),
      disabled: false,
      pathMatch: /^\/$/,
    },
    {
      label: "users",
      action: () => navigate("/users"),
      disabled: !authenticatedUser,
      pathMatch: /\/users/,
    },
    {
      label: "decks",
      action: () => navigate("/decks"),
      disabled: !authenticatedUser,
      pathMatch: /\/decks/,
    },
    {
      label: "matches",
      action: () => navigate("/matches"),
      disabled: !authenticatedUser,
      pathMatch: /\/matches/,
    },
    {
      label: "tools",
      action: () => navigate("/tools"),
      disabled: !authenticatedUser,
      pathMatch: /^\/tools$/,
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
      onClick={() => handleNavigate(`/users/${authenticatedUser?.userId}`)}
    >
      view profile
    </MenuItem>,
    <MenuItem key="logout" onClick={handleSignOut}>
      log out
    </MenuItem>,
  ];

  const loggedOutOptions = [
    <MenuItem key="login" onClick={() => handleNavigate("/login")}>
      log in
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

  interface CustomMenuItemProps extends MenuItemProps {
    highlight: boolean;
  }
  const CustomMenuItem = (props: CustomMenuItemProps) => {
    const { highlight, sx, ...rest } = props;

    return (
      <MenuItem
        sx={{
          borderRadius: 2,
          backgroundColor: (theme) =>
            highlight
              ? mode === "light"
                ? theme.palette.primary.light
                : theme.palette.primary.main
              : "transparent",
          color: (theme) =>
            highlight ? theme.palette.primary.contrastText : "inherit",
          "&:hover": {
            backgroundColor: (theme) =>
              highlight
                ? theme.palette.primary.dark
                : theme.palette.action.hover,
          },
          ...sx,
        }}
        {...rest}
      />
    );
  };

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
                highlight={item.pathMatch.test(usePath() ?? "")}
              >
                {item.label}
              </CustomMenuItem>
            ))}
          </Stack>
          <Box flexGrow={1} />
          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip arrow title="view changelog" placement="bottom">
              <Link
                href="https://github.com/odevine/edh-tracker/blob/master/CHANGELOG.md"
                target="_blank"
                sx={{ textDecoration: "none" }}
                color="inherit"
              >
                <Typography>v{appVersion}</Typography>
              </Link>
            </Tooltip>

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
                    color: (theme) => theme.palette.background.paper,
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
