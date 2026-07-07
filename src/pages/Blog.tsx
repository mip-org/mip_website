import { Box, Container, Typography, Paper, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { posts } from "../blog/posts";

export default function Blog() {
  const theme = useTheme();

  return (
    <Box sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="md">
        <Typography variant="h2" sx={{ mb: 6 }}>
          Blog
        </Typography>
        {posts.map((post) => (
          <Paper
            key={post.slug}
            component={Link}
            to={`/blog/${post.slug}`}
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
              {post.title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1.5, fontFamily: '"Meslo LG", monospace', fontSize: "0.8rem" }}
            >
              {new Date(post.date + "T00:00:00").toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {post.summary}
            </Typography>
          </Paper>
        ))}
      </Container>
    </Box>
  );
}
