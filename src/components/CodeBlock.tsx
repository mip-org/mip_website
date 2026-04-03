import { Box, IconButton, useTheme, GlobalStyles } from "@mui/material";
import { ContentCopy, Check } from "@mui/icons-material";
import { useState, useMemo } from "react";
import { hljs, buildHighlightStyles } from "../highlight";

interface CodeBlockProps {
  children: string;
  language?: string;
  showCopy?: boolean;
  inline?: boolean;
  highlight?: boolean;
}

export default function CodeBlock({
  children,
  language = "matlab",
  showCopy = true,
  inline = false,
  highlight = true,
}: CodeBlockProps) {
  const theme = useTheme();
  const [copied, setCopied] = useState(false);
  const trimmed = children.trim();

  const highlighted = useMemo(
    () => highlight ? hljs.highlight(trimmed, { language }).value : trimmed,
    [trimmed, language, highlight]
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(trimmed);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDark = theme.palette.mode === "dark";

  return (
    <>
      <GlobalStyles styles={buildHighlightStyles(isDark)} />
      <Box
        className="mip-code"
        sx={{
          position: "relative",
          backgroundColor: isDark ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0.06)",
          borderRadius: 2,
          p: inline ? 0.5 : 2,
          ...(inline && { pl: 1.5 }),
          textAlign: "left",
          fontFamily: '"Meslo LG", monospace',
          fontSize: "0.875rem",
          lineHeight: 1.6,
          overflowX: "auto",
          border: `1px solid ${theme.palette.divider}`,
          ...(inline && { display: "inline-flex", alignItems: "center", gap: 1 }),
        }}
      >
        {!inline && (
          <Box
            component="span"
            sx={{
              position: "absolute",
              top: 12,
              right: 40,
              fontSize: "0.7rem",
              color: theme.palette.text.secondary,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              userSelect: "none",
            }}
          >
            {language}
          </Box>
        )}
        <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
          <code style={{ fontFamily: "inherit" }} dangerouslySetInnerHTML={{ __html: highlighted }} />
        </pre>
        {showCopy && (
          <IconButton
            onClick={handleCopy}
            size="small"
            sx={{
              ...(!inline && { position: "absolute", top: 8, right: 8 }),
              flexShrink: 0,
              color: theme.palette.text.secondary,
              "&:hover": { color: theme.palette.primary.main },
            }}
          >
            {copied ? <Check fontSize="small" /> : <ContentCopy fontSize="small" />}
          </IconButton>
        )}
      </Box>
    </>
  );
}
