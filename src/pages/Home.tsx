import { useState, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  IconButton,
  Divider,
  GlobalStyles,
  useTheme,
} from "@mui/material";
import {
  Download,
  AccountTree,
  Route,
  TextFields,
  Terminal,
  Memory,
  ContentCopy,
  Check,
} from "@mui/icons-material";
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
        backgroundColor: isDark ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0.06)",
        borderRadius: 2,
        px: 1.5,
        py: 1,
        border: `1px solid ${theme.palette.divider}`,
        fontFamily: '"Meslo LG", monospace',
        fontSize: { xs: "1rem", md: "1.1rem" },
        lineHeight: 1,
        whiteSpace: "nowrap",
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
    title: "Simple installation",
    description:
      "Install any MATLAB package from the package index with a single command.",
  },
  {
    icon: <Route />,
    title: "Path management",
    description: "Your MATLAB path is managed automatically. No more manually adding paths or running startup scripts.",
  },
  {
    icon: <AccountTree />,
    title: "Dependency resolution",
    description:
      "Resolve package dependencies automatically. Install, uninstall, load, and unload them in the correct order.",
  },
  {
    icon: <Memory />,
    title: "Pre-compiled MEX binaries",
    description:
      "Packages using MEX include pre-compiled binaries for your architecture. No local compilation required.",
  },
  {
    icon: <TextFields />,
    title: "Name collision detection",
    description:
      "Detect overlapping symbol names across installed packages to avoid namespace conflicts before they happen.",
  },
  {
    icon: <Terminal />,
    title: "Pure MATLAB",
    description:
      "No external tools or system dependencies required. Works anywhere MATLAB runs.",
  },
];

const commands = [
  { cmd: "mip avail", desc: "List available packages in the package index" },
  { cmd: "mip info <package>", desc: "Display information about a package" },
  { cmd: "mip install <package> ...", desc: "Install one or more packages" },
  { cmd: "mip uninstall <package> ...", desc: "Uninstall one or more packages" },
  { cmd: "mip load <package>", desc: "Load a package into the MATLAB path" },
  { cmd: "mip load <package> --sticky", desc: "Load a package and mark it as sticky" },
  { cmd: "mip unload <package>", desc: "Unload a package from the MATLAB path" },
  { cmd: "mip unload --all", desc: "Unload all non-sticky packages" },
  { cmd: "mip unload --all --force", desc: "Unload all packages (including sticky ones)" },
  { cmd: "mip list", desc: "List which packages are installed and/or loaded" },
  { cmd: "mip arch", desc: "Display the MEX architecture for the current system" },
  { cmd: "mip version", desc: "Display the current version of mip" },
  { cmd: "mip help [command]", desc: "Show the help text for a command" }
];

export default function Home() {
  const theme = useTheme();

  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          py: { xs: 11, md: 18 },
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
          </Typography>
          <HeroCommand />
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
                elevation={0}
                sx={{
                  p: 3,
                  height: "100%",
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
      <Box sx={{ pb: 8 }} />
    </Box>
  );
}
