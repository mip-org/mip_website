import { useState, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  IconButton,
  Link as MuiLink,
  Divider,
  GlobalStyles,
  useTheme,
} from "@mui/material";
import {
  Download,
  AccountTree,
  Route,
  RssFeed,
  Terminal,
  Memory,
  ContentCopy,
  Check,
  MenuBook,
  Inventory2,
  ArrowForward,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { hljs, buildHighlightStyles } from "../highlight";

const HERO_CMD = "eval(webread('https://mip.sh/install.txt'))";

function HeroCommand() {
  const theme = useTheme();
  const [copied, setCopied] = useState(false);
  const isDark = theme.palette.mode === "dark";
  const highlighted = useMemo(
    () => hljs.highlight(HERO_CMD, { language: "matlab" }).value,
    []
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(HERO_CMD);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
    <GlobalStyles styles={buildHighlightStyles(isDark)} />
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        maxWidth: "100%",
        backgroundColor: isDark ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0.06)",
        borderRadius: 2,
        px: 1.5,
        py: 1,
        border: `1px solid ${theme.palette.divider}`,
        fontFamily: '"Meslo LG", monospace',
        fontSize: { xs: "1rem", md: "1.1rem" },
        lineHeight: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          minWidth: 0,
          overflowX: "auto",
          overflowY: "hidden",
          whiteSpace: "nowrap",
          lineHeight: 1.4,
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <Box
          component="span"
          sx={{ userSelect: "none", color: theme.palette.text.secondary, flexShrink: 0 }}
        >
          &gt;&gt;&nbsp;
        </Box>
        <code
          className="mip-code"
          style={{ fontFamily: "inherit", fontSize: "inherit" }}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </Box>
      <IconButton
        onClick={handleCopy}
        size="small"
        sx={{
          ml: 0.5,
          flexShrink: 0,
          color: theme.palette.text.secondary,
          "&:hover": { color: theme.palette.primary.main },
        }}
      >
        {copied ? <Check fontSize="small" /> : <ContentCopy fontSize="small" />}
      </IconButton>
    </Box>
    </>
  );
}

const features = [
  {
    icon: <Download />,
    title: "Simple package installation",
    description:
      "Install any MATLAB package from the package index with a single command.",
    path: "/docs/installing-packages#installing-a-package",
  },
  {
    icon: <Route />,
    title: "Path management",
    description: "Your MATLAB path is managed automatically. No more manually adding paths or running startup scripts.",
    path: "/docs/installing-packages#loading-a-package",
  },
  {
    icon: <Memory />,
    title: "Pre-compiled MEX binaries",
    description:
      "Packages using MEX include pre-compiled binaries for your architecture. No local compilation required.",
    path: "/docs/installing-packages#pre-compiled-mex-binaries",
  },
  {
    icon: <AccountTree />,
    title: "Dependency resolution",
    description:
      "Resolve package dependencies automatically. Install, uninstall, load, and unload them in the correct order.",
    path: "/docs/installing-packages#dependency-resolution",
  },
  {
    icon: <RssFeed />,
    title: "Distributed channels",
    description:
      "Install popular packages from the main channel or create custom channels to distribute your own packages.",
    path: "/docs/installing-packages#using-other-channels",
  },
  {
    icon: <Terminal />,
    title: "Pure MATLAB",
    description:
      "No external tools or system dependencies required. Works anywhere MATLAB runs.",
    path: "/docs/installing-mip",
  },
];

const explore = [
  {
    icon: <Inventory2 />,
    title: "Browse packages",
    description:
      "Explore the package index and find MATLAB packages ready to install.",
    path: "/packages",
  },
  {
    icon: <MenuBook />,
    title: "Read the docs",
    description:
      "Learn how to install, manage, create, and publish packages with mip.",
    path: "/docs",
  },
];

const commands = [
  // Everyday essentials
  { cmd: "mip install <package>", desc: "Install one or more packages" },
  { cmd: "mip load <package>", desc: "Load a package into the MATLAB path" },
  { cmd: "mip list", desc: "List installed packages and their load status" },
  { cmd: "mip unload <package>", desc: "Unload a package from the MATLAB path" },
  { cmd: "mip uninstall <package>", desc: "Uninstall one or more packages" },
  { cmd: "mip update <package>", desc: "Update installed packages to their latest version" },
  // Discovery
  { cmd: "mip info <package>", desc: "Show details about a package" },
  { cmd: "mip avail", desc: "List the packages available to install" },
  // Version pinning
  { cmd: "mip pin <package>", desc: "Pin a package to its current version" },
  { cmd: "mip unpin <package>", desc: "Remove a version pin from a package" },
  // Testing
  { cmd: "mip test <package>", desc: "Run a package's test script" },
  // Channels
  { cmd: "mip channel <subcommand>", desc: "Add, remove, or list channel subscriptions" },
  // Authoring & development
  { cmd: "mip init", desc: "Generate a starter mip.yaml for a new package" },
  { cmd: "mip compile <package>", desc: "Compile or recompile a package's MEX files" },
  { cmd: "mip bundle <directory>", desc: "Build a distributable .mhl file from a local package" },
  // Maintenance
  { cmd: "mip reset", desc: "Reset mip to a clean state" },
  { cmd: "mip version", desc: "Display the installed mip version" },
  { cmd: "mip help", desc: "Show an overview of all commands" },
  { cmd: "mip help <command>", desc: "Show the help text for a specific command" }
];

export default function Home() {
  const theme = useTheme();

  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          pt: { xs: 11, md: 18 },
          pb: { xs: 9, md: 17 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "3rem", md: "5rem" },
              fontFamily: '"Meslo LG", monospace',
              color: theme.palette.primary.main,
              mb: 1,
            }}
          >
            mip
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ mb: 5, fontWeight: 400, fontSize: { xs: "1.1rem", md: "1.5rem" } }}
          >
            The missing package manager for MATLAB
            <Box
              component="a"
              href="#mathworks-disclaimer"
              aria-label="Trademark disclaimer"
              sx={{
                color: "inherit",
                textDecoration: "none",
                fontSize: "0.6em",
                verticalAlign: "super",
                opacity: 0.7,
                "&:hover": { opacity: 1 },
              }}
            >
              &dagger;
            </Box>
          </Typography>
          <HeroCommand />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.75, fontSize: { xs: "0.85rem", md: "0.95rem" } }}
          >
            <MuiLink
              component={RouterLink}
              to="/docs/installing-mip"
              color="inherit"
              underline="none"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.25,
                verticalAlign: "bottom",
                "&:hover": {
                  color: theme.palette.primary.main,
                },
                "& svg": {
                  fontSize: "1em",
                  transition: "transform 0.2s",
                },
                "&:hover svg": {
                  transform: "translateX(2px)",
                },
              }}
            >
              To install, paste that into the MATLAB Command Window
              <ArrowForward />
            </MuiLink>
          </Typography>
        </Container>
      </Box>

      <Divider />

      {/* Features */}
      <Container maxWidth="lg" sx={{ pt: 8, pb: 10 }}>
        <Typography variant="h2" sx={{ textAlign: "center", mb: 6 }}>
          Features
        </Typography>
        <Grid container spacing={3}>
          {features.map((f) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={f.title}>
              <Paper
                component={RouterLink}
                to={f.path}
                elevation={0}
                sx={{
                  display: "block",
                  p: 3,
                  height: "100%",
                  textDecoration: "none",
                  color: "inherit",
                  border: `1px solid ${theme.palette.divider}`,
                  transition: "border-color 0.2s",
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                <Box
                  sx={{
                    color: theme.palette.primary.main,
                    mb: 1.5,
                    "& svg": { fontSize: 28 },
                  }}
                >
                  {f.icon}
                </Box>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  {f.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ "& code": { fontFamily: '"Meslo LG", monospace', fontSize: "0.875rem", backgroundColor: "rgba(128, 128, 128, 0.15)", borderRadius: "4px", px: 0.5 } }}>
                  {f.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Divider />

      {/* Command Reference */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h2" sx={{ textAlign: "center", mb: 6 }}>
            Commands
          </Typography>
          <Paper
            elevation={0}
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              overflow: "hidden",
            }}
          >
            {commands.map((c, i) => (
              <Box
                key={c.cmd}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { sm: "center" },
                  gap: { xs: 0.5, sm: 2 },
                  px: 3,
                  py: 2,
                  borderBottom:
                    i < commands.length - 1
                      ? `1px solid ${theme.palette.divider}`
                      : "none",
                }}
              >
                <Box
                  component="code"
                  sx={{
                    fontFamily: '"Meslo LG", monospace',
                    fontSize: "0.85rem",
                    color: theme.palette.primary.main,
                    flexShrink: 0,
                    minWidth: { sm: 320 },
                  }}
                >
                  {c.cmd}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {c.desc}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Container>
      </Box>

      <Divider />

      {/* Explore */}
      <Container maxWidth="md" sx={{ pt: 8, pb: 10 }}>
        <Typography variant="h2" sx={{ textAlign: "center", mb: 6 }}>
          Explore
        </Typography>
        <Grid container spacing={3}>
          {explore.map((e) => (
            <Grid size={{ xs: 12, sm: 6 }} key={e.title}>
              <Paper
                component={RouterLink}
                to={e.path}
                elevation={0}
                sx={{
                  display: "block",
                  p: 3,
                  height: "100%",
                  textDecoration: "none",
                  color: "inherit",
                  border: `1px solid ${theme.palette.divider}`,
                  transition: "border-color 0.2s",
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                <Box
                  sx={{
                    color: theme.palette.primary.main,
                    mb: 1.5,
                    "& svg": { fontSize: 28 },
                  }}
                >
                  {e.icon}
                </Box>
                <Typography
                  variant="h4"
                  sx={{ mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}
                >
                  {e.title}
                  <ArrowForward sx={{ fontSize: 18 }} />
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {e.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ pb: 8 }} />
    </Box>
  );
}
