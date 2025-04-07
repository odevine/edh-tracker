import { Login, Menu as MenuIcon } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Button,
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
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { navigate, usePath } from "raviger";
import { useState } from "react";

import { ThemeToggle } from "@/components";
import { useAuth, useTheme, useUser } from "@/hooks";

export const NavToolbar = () => {
  const { userId, isAuthenticated, signOut } = useAuth();
  const { currentUserProfile } = useUser();
  const { mode, muiTheme } = useTheme();

  const [userMenuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const appVersion = import.meta.env.APP_VERSION;
  const currentPath = usePath() ?? "";

  const navItems = [
    {
      label: "home",
      action: () => navigate("/"),
      pathMatch: /^\/$/,
      disabled: false,
    },
    {
      label: "formats",
      action: () => navigate("/formats"),
      pathMatch: /^\/formats$/,
      disabled: !isAuthenticated,
    },
    {
      label: "users",
      action: () => navigate("/users"),
      pathMatch: /\/users/,
      disabled: !isAuthenticated,
    },
    {
      label: "decks",
      action: () => navigate("/decks"),
      pathMatch: /\/decks/,
      disabled: !isAuthenticated,
    },
    {
      label: "matches",
      action: () => navigate("/matches"),
      pathMatch: /\/matches/,
      disabled: !isAuthenticated,
    },
  ];

  const isUserMenuOpen = Boolean(userMenuAnchor);
  const handleUserMenuOpen = (e: React.MouseEvent<HTMLElement>) =>
    setMenuAnchor(e.currentTarget);
  const handleUserMenuClose = () => setMenuAnchor(null);
  const handleNavigate = (path: string) => {
    navigate(path);
    handleUserMenuClose();
  };

  const handleSignOut = async () => {
    handleUserMenuClose();
    signOut();
  };

  const CustomNavItem = ({
    label,
    highlight,
    onClick,
    disabled,
  }: {
    label: string;
    highlight: boolean;
    onClick: () => void;
    disabled?: boolean;
  }) => {
    const isLightMode = mode === "light";
    const highlightBg = isLightMode
      ? muiTheme.palette.grey[200]
      : muiTheme.palette.action.selected;

    const itemText = isLightMode
      ? muiTheme.palette.primary.contrastText
      : muiTheme.palette.text.primary;

    const hoverBg = isLightMode
      ? muiTheme.palette.primary.light
      : muiTheme.palette.action.hover;

    return (
      <Button
        onClick={onClick}
        disabled={disabled}
        sx={{
          borderRadius: 10,
          textTransform: "none",
          fontWeight: highlight ? 600 : 400,
          color: highlight ? muiTheme.palette.text.primary : itemText,
          outline:
            highlight && !isLightMode
              ? `2px solid ${muiTheme.palette.primary.main}`
              : undefined,
          backgroundColor: highlight ? highlightBg : "transparent",
          "&:hover": {
            backgroundColor: highlight ? highlightBg : hoverBg,
          },
          px: 2,
          py: 0.5,
          minWidth: "auto",
        }}
      >
        {label}
      </Button>
    );
  };

  const renderUserMenu = (
    <Menu
      anchorEl={userMenuAnchor}
      open={isUserMenuOpen}
      onClose={handleUserMenuClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      sx={{ top: 6 }}
    >
      {isAuthenticated && (
        <MenuItem onClick={() => handleNavigate(`/users/${userId}`)}>
          view profile
        </MenuItem>
      )}
      {isAuthenticated && <MenuItem onClick={handleSignOut}>log out</MenuItem>}
      {!isAuthenticated && (
        <MenuItem onClick={() => handleNavigate("/login")}>log in</MenuItem>
      )}
    </Menu>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        component="nav"
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          {/* mobile menu icon */}
          <IconButton
            edge="start"
            sx={{ mr: 2, display: { sm: "none" } }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          {/* desktop nav items */}
          <Stack
            direction="row"
            spacing={1}
            sx={{ display: { xs: "none", sm: "flex" } }}
          >
            {navItems.map((item) => (
              <CustomNavItem
                key={item.label}
                label={item.label}
                onClick={item.action}
                highlight={item.pathMatch.test(currentPath)}
                disabled={item.disabled}
              />
            ))}
          </Stack>

          <Box flexGrow={1} />

          {/* version, theme toggle, avatar */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Tooltip arrow title="view changelog" placement="left">
              <Link
                href="https://github.com/odevine/edh-tracker/blob/master/CHANGELOG.md"
                target="_blank"
                sx={{ textDecoration: "none" }}
                color="inherit"
              >
                <Typography
                  variant="caption"
                  color={
                    mode === "light" ? "primary.contrastText" : "text.secondary"
                  }
                >
                  v{appVersion}
                </Typography>
              </Link>
            </Tooltip>
            <ThemeToggle />
            <Avatar
              onClick={handleUserMenuOpen}
              src={currentUserProfile?.profilePictureURL ?? ""}
              sx={{
                backgroundColor: isAuthenticated ? "primary.main" : "background.paper",
                color: "primary.main",
                cursor: "pointer",
                width: 42,
                height: 42,
                border: (theme) => `2px solid ${theme.palette.primary.main}`,
              }}
            >
              {!isAuthenticated && <Login fontSize="small" />}
            </Avatar>
          </Stack>
        </Toolbar>
        {renderUserMenu}
      </AppBar>

      {/* mobile drawer */}
      <nav>
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              width: 240,
              boxSizing: "border-box",
              backgroundColor: "background.default",
              color: "text.primary",
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
                <ListItemButton
                  sx={{ textAlign: "center" }}
                  disabled={item.disabled}
                >
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
