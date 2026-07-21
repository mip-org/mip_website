import { Box, IconButton, useTheme } from "@mui/material";
import { ContentCopy, Check } from "@mui/icons-material";
import { useLayoutEffect, useRef, useState } from "react";

export default function MarkdownPre({ children, node, ...props }: any) {
  const theme = useTheme();
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLSpanElement>(null);
  const [scrollbarHeight, setScrollbarHeight] = useState(0);

  // measure the horizontal scrollbar (0 when absent or overlay) so it can be
  // absorbed into the pre's bottom padding rather than adding to the box height
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => setScrollbarHeight(el.offsetHeight - el.clientHeight);
    update();
    const observer = new ResizeObserver(update);
    try {
      // border-box includes the scrollbar, so thickness changes re-measure
      observer.observe(el, { box: "border-box" });
    } catch {
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  const codeNode = node?.children?.find((c: any) => c.tagName === "code");
  const cls = codeNode?.properties?.className ?? [];
  const langMatch = cls.find((c: string) => c.startsWith("language-"));
  const lang = langMatch?.replace("language-", "");

  const textContent = codeNode?.children
    ?.map((c: any) => (c.type === "text" ? c.value : c.children?.map((cc: any) => cc.value).join("") ?? ""))
    .join("") ?? "";

  const handleCopy = () => {
    navigator.clipboard.writeText(textContent.trimEnd());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <pre {...props} style={{ display: "flex", alignItems: "flex-start", overflow: "hidden" }}>
      {/* the code scrolls in its own column so it can't slide under the controls */}
      <Box
        component="span"
        ref={scrollRef}
        sx={{
          display: "block",
          flex: 1,
          minWidth: 0,
          overflowX: "auto",
          overflowY: "hidden",
          mb: `${-scrollbarHeight}px`,
          "&::-webkit-scrollbar": { height: 6, backgroundColor: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
            borderRadius: 3,
          },
          // Firefox fallback only: setting these in browsers that support
          // ::-webkit-scrollbar would disable the custom styling above
          "@supports not selector(::-webkit-scrollbar)": {
            scrollbarWidth: "thin",
            scrollbarColor: `${theme.palette.mode === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"} transparent`,
          },
        }}
      >{children}</Box>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 10, marginLeft: 16, flexShrink: 0, userSelect: "none" }}>
        {lang && (<span style={{ fontSize: "0.7rem", color: theme.palette.text.secondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>{lang}</span>)}
        <IconButton
          onClick={handleCopy}
          size="small"
          sx={{
            my: -0.5,
            mr: -1,
            color: theme.palette.text.secondary,
            "&:hover": { color: theme.palette.primary.main },
          }}
        >{copied ? <Check fontSize="small" /> : <ContentCopy fontSize="small" />}</IconButton>
      </span>
    </pre>
  );
}
