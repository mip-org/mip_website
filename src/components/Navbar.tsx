import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { DarkMode, LightMode, GitHub, Menu as MenuIcon } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useThemeContext } from "../ThemeContext";

export default function Navbar() {
  const { setThemeName } = useThemeContext();
  const theme = useTheme();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isDark = theme.palette.mode === "dark";

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Packages", path: "/packages" },
    { label: "Docs", path: "/docs" },
    { label: "Blog", path: "/blog" },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backdropFilter: "blur(12px)",
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(11, 17, 32, 0.85)"
            : "rgba(255, 255, 255, 0.85)",
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ maxWidth: 1200, width: "100%", mx: "auto" }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            fontWeight: 700,
            fontFamily: '"Meslo LG", monospace',
            color: theme.palette.primary.main,
            textDecoration: "none",
            mr: 4,
          }}
        >
          mip
        </Typography>

        <Box sx={{ flexGrow: 1, display: { xs: "none", sm: "flex" }, gap: 1 }}>
          {navItems.map((item) => {
            const isActive =
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path);
            return (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  color: isActive
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
                  fontSize: "1rem",
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </Box>

        <Box sx={{ flexGrow: 1, display: { xs: "flex", sm: "none" } }} />

        <IconButton
          onClick={() => setThemeName(isDark ? "Light Blue" : "Dark Navy")}
          size="small"
          sx={{ color: theme.palette.text.secondary }}
        >
          {isDark ? <LightMode /> : <DarkMode />}
        </IconButton>
        <Box sx={{ width: 8 }} />
        <IconButton
          href="https://github.com/mip-org/mip-package-manager"
          target="_blank"
          rel="noopener noreferrer"
          size="small"
          sx={{ color: theme.palette.text.secondary }}
        >
          <GitHub />
        </IconButton>

        <IconButton
          sx={{ display: { sm: "none" }, color: theme.palette.text.secondary }}
          onClick={() => setDrawerOpen(true)}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <List sx={{ width: 200, pt: 2 }}>
            {navItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}
