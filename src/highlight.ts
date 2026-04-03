import hljsCore from "highlight.js/lib/core";
import matlab from "highlight.js/lib/languages/matlab";
import yaml from "highlight.js/lib/languages/yaml";
import bash from "highlight.js/lib/languages/bash";
import c from "highlight.js/lib/languages/c";
import javascript from "highlight.js/lib/languages/javascript";

hljsCore.registerLanguage("matlab", matlab);
hljsCore.registerLanguage("yaml", yaml);
hljsCore.registerLanguage("bash", bash);
hljsCore.registerLanguage("c", c);
hljsCore.registerLanguage("javascript", javascript);

export const hljs = hljsCore;

// MATLAB default editor colors
const darkTokenColors: Record<string, string> = {
  "hljs-comment": "#4CBB17",
  "hljs-keyword": "#5B9BD5",
  "hljs-string": "#CC6FF8",
  "hljs-number": "#B5CEA8",
  "hljs-title": "#5B9BD5",
  "hljs-variable": "#D4D4D4",
  "hljs-operator": "#D4D4D4",
  "hljs-meta": "#5B9BD5",
};

const lightTokenColors: Record<string, string> = {
  "hljs-comment": "#228B22",
  "hljs-keyword": "#0000FF",
  "hljs-string": "#A020F0",
  "hljs-number": "#000000",
  "hljs-title": "#0000FF",
  "hljs-variable": "#000000",
  "hljs-operator": "#000000",
  "hljs-meta": "#0000FF",
};

export function buildHighlightStyles(isDark: boolean) {
  const colors = isDark ? darkTokenColors : lightTokenColors;
  const rules: Record<string, Record<string, string>> = {};
  for (const [cls, color] of Object.entries(colors)) {
    const selector = `.mip-code .${cls}`;
    rules[selector] = { color };
    if (cls === "hljs-comment") {
      rules[selector].fontStyle = "italic";
    }
  }
  return rules;
}
