import { Box, Container, Typography, Link as MuiLink } from "@mui/material";

export default function About() {
  return (
    <Box sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="md">
        <Typography variant="h2" sx={{ mb: 4 }}>
          About
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          mip is a package manager for MATLAB that lets you install, load, and
          manage packages with simple commands. It is open source software
          developed at the{" "}
          <MuiLink
            href="https://www.simonsfoundation.org/flatiron/center-for-computational-mathematics/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Center for Computational Mathematics, Flatiron Institute
          </MuiLink>
          . It is released under the{" "}
          <MuiLink
            href="https://github.com/mip-org/mip-package-manager/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
          >
            Apache 2.0 license
          </MuiLink>
          , and the source code is available on{" "}
          <MuiLink
            href="https://github.com/mip-org/mip-package-manager"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </MuiLink>
          .
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Bug reports, feature requests, and other feedback are welcome on the{" "}
          <MuiLink
            href="https://github.com/mip-org/mip-package-manager/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            issue tracker
          </MuiLink>
          .
        </Typography>
        <Typography variant="body2" color="text.secondary">
          mip is not affiliated with, endorsed by, or supported by The
          MathWorks, Inc. MATLAB is a registered trademark of The MathWorks,
          Inc.
        </Typography>
      </Container>
    </Box>
  );
}
