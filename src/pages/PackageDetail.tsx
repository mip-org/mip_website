import { useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Link as MuiLink,
  useTheme,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { ArrowBack, OpenInNew, FileDownloadOutlined } from "@mui/icons-material";
import { Link as RouterLink, useParams } from "react-router-dom";
import CodeBlock from "../components/CodeBlock";
import type { Package } from "../types";
import {
  usePackageIndex,
  useDownloadStats,
  aggregateDownloadsByTag,
  pickDisplayVersion,
  releaseTag,
  isNumericVersion,
  compareNumericVersions,
  SITE_URL,
} from "../packageIndex";

const BADGE_URL = "https://img.shields.io/badge/install_with-mip-1565C0";

// Newest version first; numeric versions before branch-name versions; same
// version sorted by architecture.
function compareBuilds(a: Package, b: Package): number {
  if (a.version !== b.version) {
    const an = isNumericVersion(a.version);
    const bn = isNumericVersion(b.version);
    if (an && bn) return compareNumericVersions(b.version, a.version);
    if (an !== bn) return an ? -1 : 1;
    return a.version.localeCompare(b.version);
  }
  return a.architecture.localeCompare(b.architecture);
}

function mhlFilename(pkg: Package): string {
  const parts = pkg.mhl_url.split("/");
  return parts[parts.length - 1];
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "baseline" }}>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ width: 130, flexShrink: 0 }}
      >
        {label}
      </Typography>
      <Typography variant="body2" component="div">
        {children}
      </Typography>
    </Box>
  );
}

export default function PackageDetail() {
  const theme = useTheme();
  const { name } = useParams<{ name: string }>();
  const { data, error } = usePackageIndex();
  const stats = useDownloadStats();

  const variants = useMemo(
    () => (data ? data.packages.filter((p) => p.name === name) : []),
    [data, name]
  );

  const downloadsByTag = useMemo(
    () => aggregateDownloadsByTag(stats),
    [stats]
  );

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Alert severity="error">Failed to load package index: {error}</Alert>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Box sx={{ textAlign: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (variants.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          No package named <code>{name}</code> in the package index.
        </Alert>
        <Button
          component={RouterLink}
          to="/packages"
          startIcon={<ArrowBack />}
          size="small"
        >
          All packages
        </Button>
      </Container>
    );
  }

  const version = pickDisplayVersion(variants);
  const pkg = variants.find((v) => v.version === version) ?? variants[0];
  const architectures = [...new Set(variants.map((v) => v.architecture))];
  const downloads = downloadsByTag.get(releaseTag(pkg));
  const builds = [...variants].sort(compareBuilds);

  const pageUrl = `${SITE_URL}/packages/${pkg.name}`;
  const badgeSnippet = `[![Install with mip](${BADGE_URL})](${pageUrl})`;
  const linkSnippet = `[Install with mip](${pageUrl})`;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Button
        component={RouterLink}
        to="/packages"
        startIcon={<ArrowBack />}
        size="small"
        sx={{ mb: 2 }}
      >
        All packages
      </Button>

      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}
      >
        <Typography
          variant="h2"
          sx={{
            fontFamily: '"Meslo LG", monospace',
            color: theme.palette.primary.main,
          }}
        >
          {pkg.name}
        </Typography>
        {pkg.version !== "unspecified" && (
          <Chip label={pkg.version} size="small" variant="outlined" />
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

      <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5, mb: 4 }}>
        {pkg.description}
      </Typography>

      <Typography variant="h3" sx={{ mb: 2 }}>
        Installation
      </Typography>
      <Typography variant="body1" sx={{ mb: 1.5 }}>
        If you don't have mip yet, install it first by running this in the
        MATLAB Command Window (see{" "}
        <MuiLink component={RouterLink} to="/docs/installing-mip">
          Installing mip
        </MuiLink>
        ):
      </Typography>
      <CodeBlock>{`eval(webread('${SITE_URL}/install.txt'))`}</CodeBlock>
      <Typography variant="body1" sx={{ mt: 2.5, mb: 1.5 }}>
        Then install and load <code>{pkg.name}</code>:
      </Typography>
      <CodeBlock>{`mip install ${pkg.name}\nmip load ${pkg.name}`}</CodeBlock>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, mb: 4 }}>
        More on loading, versions, and channels in{" "}
        <MuiLink component={RouterLink} to="/docs/installing-packages">
          Installing Packages
        </MuiLink>
        .
      </Typography>

      <Typography variant="h3" sx={{ mb: 2 }}>
        Details
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 4 }}>
        {pkg.version !== "unspecified" && (
          <DetailRow label="Version">{pkg.version}</DetailRow>
        )}
        {pkg.license && pkg.license !== "unspecified" && (
          <DetailRow label="License">{pkg.license}</DetailRow>
        )}
        <DetailRow label="Architectures">
          <Box component="span" sx={{ display: "inline-flex", gap: 0.5, flexWrap: "wrap" }}>
            {architectures.map((arch) => (
              <Chip
                key={arch}
                label={arch}
                size="small"
                color={arch === "any" ? "primary" : "default"}
                variant="outlined"
              />
            ))}
          </Box>
        </DetailRow>
        {pkg.dependencies.length > 0 && (
          <DetailRow label="Dependencies">
            {pkg.dependencies.map((dep, i) => (
              <span key={dep}>
                {i > 0 && ", "}
                {dep.includes("/") ? (
                  dep
                ) : (
                  <MuiLink component={RouterLink} to={`/packages/${dep}`}>
                    {dep}
                  </MuiLink>
                )}
              </span>
            ))}
          </DetailRow>
        )}
        {pkg.homepage && (
          <DetailRow label="Homepage">
            <MuiLink
              href={pkg.homepage}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ display: "inline-flex", alignItems: "center", gap: 0.3 }}
            >
              {pkg.homepage} <OpenInNew sx={{ fontSize: 12 }} />
            </MuiLink>
          </DetailRow>
        )}
        {pkg.repository && pkg.repository !== pkg.homepage && (
          <DetailRow label="Repository">
            <MuiLink
              href={pkg.repository}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ display: "inline-flex", alignItems: "center", gap: 0.3 }}
            >
              {pkg.repository} <OpenInNew sx={{ fontSize: 12 }} />
            </MuiLink>
          </DetailRow>
        )}
        {pkg.timestamp && (
          <DetailRow label="Published">
            {new Date(pkg.timestamp).toLocaleDateString()}
          </DetailRow>
        )}
      </Box>

      <Typography variant="h3" sx={{ mb: 2 }}>
        Builds
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        <code>mip install {pkg.name}</code> picks the right build for your
        platform automatically. Direct downloads, for reference:
      </Typography>
      <Paper
        elevation={0}
        sx={{ border: `1px solid ${theme.palette.divider}`, mb: 4, overflowX: "auto" }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Version</TableCell>
              <TableCell>Architecture</TableCell>
              <TableCell>File</TableCell>
              {stats && <TableCell align="right">Downloads</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {builds.map((b) => {
              const assetDownloads =
                stats?.assets[`${releaseTag(b)}/${mhlFilename(b)}`]?.lifetime;
              return (
                <TableRow key={`${b.version}-${b.architecture}`}>
                  <TableCell>{b.version}</TableCell>
                  <TableCell>{b.architecture}</TableCell>
                  <TableCell>
                    <MuiLink
                      href={b.mhl_url}
                      sx={{ fontFamily: '"Meslo LG", monospace', fontSize: "0.8rem" }}
                    >
                      {mhlFilename(b)}
                    </MuiLink>
                  </TableCell>
                  {stats && (
                    <TableCell align="right">
                      {assetDownloads !== undefined
                        ? assetDownloads.toLocaleString()
                        : "—"}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>

      <Typography variant="h3" sx={{ mb: 2 }}>
        Link to this page
      </Typography>
      <Typography variant="body1" sx={{ mb: 1.5 }}>
        Maintainers: link here from your project's README so users know how to
        install <code>{pkg.name}</code> with mip. Badge:
      </Typography>
      <Box sx={{ mb: 1.5 }}>
        <a href={pageUrl}>
          <img src={BADGE_URL} alt="Install with mip" height={20} />
        </a>
      </Box>
      <CodeBlock language="markdown" highlight={false}>
        {badgeSnippet}
      </CodeBlock>
      <Typography variant="body1" sx={{ mt: 2.5, mb: 1.5 }}>
        Or a plain link:
      </Typography>
      <CodeBlock language="markdown" highlight={false}>
        {linkSnippet}
      </CodeBlock>
    </Container>
  );
}
