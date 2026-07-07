import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Chip,
  Link as MuiLink,
  TextField,
  useTheme,
  CircularProgress,
  Alert,
} from "@mui/material";
import { OpenInNew, FileDownloadOutlined } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import CodeBlock from "../components/CodeBlock";
import type { Package, PackageIndex, DownloadStats } from "../types";

const INDEX_URL =
  "https://mip-org.github.io/mip-core/index.json";

// Lifetime download counts, published to the channel repo's `stats` branch by
// the daily download-stats workflow. Absent until that branch exists, so a
// failed fetch is non-fatal — the page just renders without counts.
const STATS_URL =
  "https://raw.githubusercontent.com/mip-org/mip-core/stats/download-stats.json";

// A version is "numeric" if it's a dot-separated sequence of integers (e.g.
// "1.0.0", "0.7"). Branch-name versions like "main" or "numbl" are not.
function isNumericVersion(version: string): boolean {
  return /^\d+(\.\d+)*$/.test(version);
}

// Compare two numeric versions component-wise, missing components treated as 0
// (so "1.2" == "1.2.0"). Returns >0 when a is higher than b.
function compareNumericVersions(a: string, b: string): number {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

// Of a package's variants, pick the version to display: the highest numeric
// version if any exist, otherwise fall back to the first variant's version
// (which may be a branch name like "main" or "unspecified").
function pickDisplayVersion(variants: Package[]): string {
  const numeric = variants
    .map((v) => v.version)
    .filter(isNumericVersion)
    .sort(compareNumericVersions);
  return numeric.length > 0 ? numeric[numeric.length - 1] : variants[0].version;
}

function deduplicatePackages(packages: Package[]): Package[] {
  // Group by name, keeping all architectures
  const grouped = new Map<string, Package[]>();
  for (const pkg of packages) {
    const existing = grouped.get(pkg.name) || [];
    existing.push(pkg);
    grouped.set(pkg.name, existing);
  }
  // Return one entry per unique name, merging architecture info and showing the
  // highest numeric version rather than whichever variant happens to be first.
  return Array.from(grouped.values()).map((variants) => ({
    ...variants[0],
    version: pickDisplayVersion(variants),
    architecture: [...new Set(variants.map((v) => v.architecture))].join(", "),
  }));
}

export default function Packages() {
  const theme = useTheme();
  const [data, setData] = useState<PackageIndex | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DownloadStats | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(INDEX_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    fetch(STATS_URL)
      .then((r) => (r.ok ? r.json() : null))
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  const packages = useMemo(
    () => (data ? deduplicatePackages(data.packages) : []),
    [data]
  );

  // Aggregate lifetime downloads over all architectures of each (package,
  // release), keyed by the "<name>-<version>" release tag.
  const downloadsByTag = useMemo(() => {
    const totals = new Map<string, number>();
    if (!stats) return totals;
    for (const [key, asset] of Object.entries(stats.assets)) {
      const tag = key.split("/")[0];
      totals.set(tag, (totals.get(tag) ?? 0) + asset.lifetime);
    }
    return totals;
  }, [stats]);

  const filtered = useMemo(() => {
    if (!search) return packages;
    const q = search.toLowerCase();
    return packages.filter(
      (pkg) =>
        pkg.name.toLowerCase().includes(q) ||
        pkg.description.toLowerCase().includes(q) ||
        pkg.dependencies.some((dep) => dep.toLowerCase().includes(q))
    );
  }, [packages, search]);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 1,
        }}
      >
        <Typography variant="h2">Packages</Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", flexShrink: 0 }}>
          <Button
            variant="outlined"
            size="small"
            href="https://github.com/mip-org/mip-core/issues/new?template=request-package.yml"
            target="_blank"
            rel="noopener noreferrer"
            endIcon={<OpenInNew sx={{ fontSize: 14 }} />}
          >
            Request a package
          </Button>
          <Button
            variant="outlined"
            size="small"
            component={RouterLink}
            to="/docs/hosting-a-channel"
          >
            Host your own channel
          </Button>
        </Box>
      </Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {data
          ? `${packages.length} packages available`
          : "Loading package index..."}
      </Typography>

      {packages.length > 0 && (
        <TextField
          placeholder="Search packages..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 3, maxWidth: 400 }}
          fullWidth
        />
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load package index: {error}
        </Alert>
      )}

      {!data && !error && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {filtered.length > 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {filtered.map((pkg) => {
            const downloads = downloadsByTag.get(`${pkg.name}-${pkg.version}`);
            return (
            <Paper
              key={`${pkg.name}-${pkg.architecture}`}
              elevation={0}
              sx={{
                p: 3,
                border: `1px solid ${theme.palette.divider}`,
                transition: "border-color 0.2s",
                "&:hover": { borderColor: theme.palette.primary.main },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  alignItems: { sm: "flex-start" },
                  gap: 1,
                  mb: 1,
                }}
              >
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontFamily: '"Meslo LG", monospace',
                        color: theme.palette.primary.main,
                      }}
                    >
                      {pkg.name}
                    </Typography>
                    {pkg.version !== "unspecified" && (
                      <Chip
                        label={pkg.version}
                        size="small"
                        variant="outlined"
                      />
                    )}
                    {downloads !== undefined && (
                      <Chip
                        icon={<FileDownloadOutlined sx={{ fontSize: 15 }} />}
                        label={downloads.toLocaleString()}
                        size="small"
                        variant="outlined"
                        title={`${downloads.toLocaleString()} downloads (all architectures)`}
                        sx={{ color: "text.secondary" }}
                      />
                    )}
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", flexShrink: 0 }}>
                  {pkg.architecture.split(", ").filter(Boolean).map((arch) => (
                    <Chip
                      key={arch}
                      label={arch}
                      size="small"
                      color={arch === "any" ? "primary" : "default"}
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                {pkg.description}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                {pkg.license && pkg.license !== "unspecified" && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {pkg.license}
                  </Typography>
                )}
                {pkg.homepage && (
                  <MuiLink
                    href={pkg.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="caption"
                    sx={{ display: "flex", alignItems: "center", gap: 0.3 }}
                  >
                    Homepage <OpenInNew sx={{ fontSize: 12 }} />
                  </MuiLink>
                )}
              </Box>

              {pkg.dependencies.length > 0 && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  Dependencies: {pkg.dependencies.join(", ")}
                </Typography>
              )}

              <Box sx={{ mt: 1.5 }}>
                <CodeBlock inline highlight={false}>{`mip install ${pkg.name}`}</CodeBlock>
              </Box>
            </Paper>
            );
          })}
        </Box>
      )}
    </Container>
  );
}
