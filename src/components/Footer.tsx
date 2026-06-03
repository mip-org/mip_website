import { Box, Container, Typography, Link as MuiLink, useTheme } from "@mui/material";

export default function Footer() {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        mt: 8,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "center", sm: "flex-start" },
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="body2"
              sx={{
                fontFamily: '"Meslo LG", monospace',
                fontWeight: 700,
                color: theme.palette.primary.main,
                mb: 0.5,
              }}
            >
              mip
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Created at the{" "}
              <MuiLink
                href="https://www.simonsfoundation.org/flatiron/"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                sx={{ textDecoration: "underline" }}
              >
                Center for Computational Mathematics, Flatiron Institute
              </MuiLink>
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 3 }}>
            <MuiLink
              href="https://github.com/mip-org/mip-package-manager"
              target="_blank"
              rel="noopener noreferrer"
              variant="body2"
              color="text.secondary"
            >
              GitHub
            </MuiLink>
            <MuiLink
              href="https://github.com/mip-org/mip-package-manager/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              variant="body2"
              color="text.secondary"
            >
              Apache 2.0
            </MuiLink>
          </Box>
        </Box>
        <Typography
          variant="caption"
          component="p"
          color="text.secondary"
          sx={{ mt: 3, textAlign: { xs: "center", sm: "left" }, opacity: 0.8 }}
        >
          mip is not affiliated with, endorsed by, or supported by MathWorks,
          Inc. MATLAB is a registered trademark of MathWorks, Inc.
        </Typography>
      </Container>
    </Box>
  );
}
