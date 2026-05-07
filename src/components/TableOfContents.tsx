import { Box, Collapse, IconButton, Typography, useTheme } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Doc } from "../docs/types";

export type TocHeading = { level: number; text: string; slug: string };

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function extractHeadings(markdown: string): TocHeading[] {
  const lines = markdown.split("\n");
  const headings: TocHeading[] = [];
  let inCodeBlock = false;
  for (const line of lines) {
    if (/^```/.test(line)) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;
    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      headings.push({ level, text, slug: slugifyHeading(text) });
    }
  }
  return headings;
}

export default function TableOfContents({
  docs,
  currentSlug,
}: {
  docs: Doc[];
  currentSlug: string | undefined;
}) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(currentSlug ? [currentSlug] : []),
  );
  const [activeHeading, setActiveHeading] = useState<string | null>(null);

  const docHeadings = useMemo(
    () =>
      docs.map((d) => ({
        slug: d.slug,
        title: d.title,
        headings: extractHeadings(d.content),
      })),
    [docs],
  );

  useEffect(() => {
    if (currentSlug) {
      setExpanded((prev) => {
        if (prev.has(currentSlug)) return prev;
        const next = new Set(prev);
        next.add(currentSlug);
        return next;
      });
    }
  }, [currentSlug]);

  useEffect(() => {
    if (!currentSlug) return;
    const entry = docHeadings.find((d) => d.slug === currentSlug);
    if (!entry || entry.headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveHeading(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );
    for (const h of entry.headings) {
      const el = document.getElementById(h.slug);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [currentSlug, docHeadings]);

  const toggleExpand = (slug: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const handleHeadingClick = (
    e: React.MouseEvent,
    docSlug: string,
    headingSlug: string,
  ) => {
    e.preventDefault();
    if (docSlug === currentSlug) {
      const el = document.getElementById(headingSlug);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: "smooth" });
        history.replaceState(null, "", `#${headingSlug}`);
      }
    } else {
      navigate(`/docs/${docSlug}#${headingSlug}`);
    }
  };

  return (
    <Box component="nav" aria-label="Documentation navigation">
      <Typography
        variant="overline"
        sx={{
          color: theme.palette.text.secondary,
          fontWeight: 600,
          letterSpacing: "0.08em",
          display: "block",
          mb: 1,
        }}
      >
        Documentation
      </Typography>
      <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
        {docHeadings.map(({ slug, title, headings }) => {
          const isCurrent = slug === currentSlug;
          const isExpanded = expanded.has(slug);
          return (
            <Box component="li" key={slug} sx={{ mb: 0.25 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Box
                  component={Link}
                  to={`/docs/${slug}`}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    display: "block",
                    py: 0.5,
                    pl: 1,
                    borderLeft: `2px solid ${
                      isCurrent ? theme.palette.primary.main : "transparent"
                    }`,
                    color: isCurrent
                      ? theme.palette.primary.main
                      : theme.palette.text.primary,
                    fontSize: "0.875rem",
                    fontWeight: isCurrent ? 600 : 500,
                    textDecoration: "none",
                    lineHeight: 1.3,
                    "&:hover": { color: theme.palette.primary.main },
                  }}
                >
                  {title}
                </Box>
                {headings.length > 0 && (
                  <IconButton
                    size="small"
                    onClick={() => toggleExpand(slug)}
                    sx={{
                      p: 0.25,
                      color: theme.palette.text.secondary,
                    }}
                    aria-label={isExpanded ? "Collapse section" : "Expand section"}
                  >
                    {isExpanded ? (
                      <ExpandLess fontSize="small" />
                    ) : (
                      <ExpandMore fontSize="small" />
                    )}
                  </IconButton>
                )}
              </Box>
              <Collapse in={isExpanded} unmountOnExit>
                <Box
                  component="ul"
                  sx={{ listStyle: "none", p: 0, m: 0, ml: 1, mt: 0.25, mb: 0.5 }}
                >
                  {headings.map((h) => {
                    const isActive = isCurrent && h.slug === activeHeading;
                    return (
                      <Box component="li" key={h.slug}>
                        <Box
                          component="a"
                          href={`/docs/${slug}#${h.slug}`}
                          onClick={(e) => handleHeadingClick(e, slug, h.slug)}
                          sx={{
                            display: "block",
                            py: 0.4,
                            pl: h.level === 3 ? 2.5 : 1.25,
                            borderLeft: `2px solid ${
                              isActive
                                ? theme.palette.primary.main
                                : "transparent"
                            }`,
                            color: isActive
                              ? theme.palette.primary.main
                              : theme.palette.text.secondary,
                            fontSize: h.level === 3 ? "0.8rem" : "0.85rem",
                            fontWeight: isActive ? 600 : 400,
                            textDecoration: "none",
                            lineHeight: 1.35,
                            "&:hover": { color: theme.palette.primary.main },
                          }}
                        >
                          {h.text}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Collapse>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
