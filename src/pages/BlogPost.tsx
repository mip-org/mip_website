import { useParams, Navigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  useTheme,
  GlobalStyles,
} from "@mui/material";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { posts } from "../blog/posts";
import { hljs, buildHighlightStyles } from "../highlight";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const post = posts.find((p) => p.slug === slug);

  if (!post) return <Navigate to="/blog" replace />;

  return (
    <>
      <GlobalStyles styles={buildHighlightStyles(isDark)} />
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="md">
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1, fontFamily: '"Meslo LG", monospace', fontSize: "0.8rem" }}
          >
            {post.author && `${post.author} · `}
            {new Date(post.date + "T00:00:00").toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography>
          <Typography variant="h2" sx={{ mb: 4 }}>
            {post.title}
          </Typography>
          <Box
            className="blog-content"
            sx={{
              "& h2": { ...theme.typography.h3, mt: 5, mb: 2 },
              "& h3": { ...theme.typography.h4, mt: 4, mb: 1.5 },
              "& p": { ...theme.typography.body1, mb: 2 },
              "& ul, & ol": { pl: 3, mb: 2 },
              "& li": { ...theme.typography.body1, mb: 0.5 },
              "& a": { color: theme.palette.primary.main },
              "& code:not(.mip-code):not(.mip-code code)": {
                fontFamily: '"Meslo LG", monospace',
                fontSize: "0.875rem",
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.06)",
                borderRadius: "4px",
                px: 0.5,
                py: 0.25,
              },
              "& pre": {
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: isDark
                  ? "rgba(0, 0, 0, 0.4)"
                  : "rgba(0, 0, 0, 0.06)",
                p: 2,
                overflowX: "auto",
                mb: 2,
                "& code": {
                  fontFamily: '"Meslo LG", monospace',
                  fontSize: "0.875rem",
                  lineHeight: 1.6,
                  backgroundColor: "transparent",
                  p: 0,
                },
              },
            }}
          >
            <Markdown
              remarkPlugins={[remarkGfm]}
              children={post.content}
              components={{
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className ?? "");
                  if (match) {
                    const lang = match[1];
                    const code = String(children).trimEnd();
                    const highlighted = hljs.highlight(code, {
                      language: lang,
                    }).value;
                    return (
                      <code
                        className="mip-code"
                        dangerouslySetInnerHTML={{ __html: highlighted }}
                        {...props}
                      />
                    );
                  }
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
}
