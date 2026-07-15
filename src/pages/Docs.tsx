import { Box, Container, Typography, Paper, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { docs } from "../docs/articles";
import type { Doc } from "../docs/types";

export default function Docs() {
  const theme = useTheme();

  const mainDocs = docs.filter((doc) => !doc.section);
  const comingSoonDocs = docs.filter((doc) => doc.section === "coming-soon");

  const renderCard = (doc: Doc) => (
    <Paper
      key={doc.slug}
      component={Link}
      to={`/docs/${doc.slug}`}
      elevation={0}
      sx={{
        display: "block",
        p: 3,
        mb: 3,
        border: `1px solid ${theme.palette.divider}`,
        textDecoration: "none",
        color: "inherit",
        transition: "border-color 0.2s",
        "&:hover": {
          borderColor: theme.palette.primary.main,
        },
      }}
    >
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        {doc.title}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {doc.summary}
      </Typography>
    </Paper>
  );

  return (
    <Box sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="md">
        <Typography variant="h2" sx={{ mb: 6 }}>
          Documentation
        </Typography>
        {mainDocs.map(renderCard)}
        {comingSoonDocs.length > 0 && (
          <>
            <Typography variant="h3" sx={{ mt: 8, mb: 3 }}>
              Coming soon
            </Typography>
            {comingSoonDocs.map(renderCard)}
          </>
        )}
      </Container>
    </Box>
  );
}
