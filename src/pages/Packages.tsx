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
import { OpenInNew } from "@mui/icons-material";
import CodeBlock from "../components/CodeBlock";
import type { Package, PackageIndex } from "../types";

const INDEX_URL =
  "https://mip-org.github.io/mip-core/index.json";

function deduplicatePackages(packages: Package[]): Package[] {
  // Group by name, keeping all architectures
  const grouped = new Map<string, Package[]>();
  for (const pkg of packages) {
    const existing = grouped.get(pkg.name) || [];
    existing.push(pkg);
    grouped.set(pkg.name, existing);
  }
  // Return one entry per unique name, merging architecture info
  return Array.from(grouped.values()).map((variants) => ({
    ...variants[0],
    architecture: [...new Set(variants.map((v) => v.architecture))].join(", "),
  }));
}

export default function Packages() {
  const theme = useTheme();
  const [data, setData] = useState<PackageIndex | null>(null);
  const [error, setError] = useState<string | null>(null);
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

  const packages = useMemo(
    () => (data ? deduplicatePackages(data.packages) : []),
    [data]
  );

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
        <Button
          variant="outlined"
          size="small"
          href="https://github.com/mip-org/mip-core/issues/new?template=request-package.yml"
          target="_blank"
          rel="noopener noreferrer"
          endIcon={<OpenInNew sx={{ fontSize: 14 }} />}
          sx={{ flexShrink: 0 }}
        >
          Request a package
        </Button>
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
          {filtered.map((pkg) => (
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
          ))}
        </Box>
      )}
    </Container>
  );
}
