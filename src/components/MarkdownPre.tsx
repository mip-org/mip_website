import { IconButton, useTheme } from "@mui/material";
import { ContentCopy, Check } from "@mui/icons-material";
import { useState } from "react";

export default function MarkdownPre({ children, node, ...props }: any) {
  const theme = useTheme();
  const [copied, setCopied] = useState(false);

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
    <pre {...props}>{lang && (<span style={{ position: "absolute", top: 12, right: 42, fontSize: "0.7rem", color: theme.palette.text.secondary, textTransform: "uppercase", letterSpacing: "0.05em", userSelect: "none" }}>{lang}</span>)}<IconButton
      onClick={handleCopy}
      size="small"
      sx={{
        position: "absolute",
        top: 7,
        right: 8,
        color: theme.palette.text.secondary,
        "&:hover": { color: theme.palette.primary.main },
      }}
    >{copied ? <Check fontSize="small" /> : <ContentCopy fontSize="small" />}</IconButton>{children}</pre>
  );
}
