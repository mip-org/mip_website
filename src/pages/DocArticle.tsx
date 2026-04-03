import { useParams, Navigate, Link, useLocation } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  useTheme,
  GlobalStyles,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useEffect } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { docs } from "../docs/articles";
import { hljs, buildHighlightStyles } from "../highlight";

export default function DocArticle() {
  const { slug } = useParams<{ slug: string }>();
  const { pathname } = useLocation();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const docIndex = docs.findIndex((d) => d.slug === slug);
  const doc = docIndex >= 0 ? docs[docIndex] : undefined;
  const prev = docIndex > 0 ? docs[docIndex - 1] : undefined;
  const next = docIndex < docs.length - 1 ? docs[docIndex + 1] : undefined;

  if (!doc) return <Navigate to="/docs" replace />;

  return (
    <>
      <GlobalStyles styles={buildHighlightStyles(isDark)} />
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="md">
          <Typography variant="h2" sx={{ mb: 4 }}>
            {doc.title}
          </Typography>
          <Box
            className="doc-content"
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
              children={doc.content}
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 6,
              pt: 3,
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            {prev ? (
              <Button
                component={Link}
                to={`/docs/${prev.slug}`}
                startIcon={<ArrowBack />}
                sx={{ textTransform: "none" }}
              >
                {prev.title}
              </Button>
            ) : (
              <span />
            )}
            {next ? (
              <Button
                component={Link}
                to={`/docs/${next.slug}`}
                endIcon={<ArrowForward />}
                sx={{ textTransform: "none" }}
              >
                {next.title}
              </Button>
            ) : (
              <span />
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
}
