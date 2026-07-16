import { useEffect, useState } from "react";
import type { Package, PackageIndex, DownloadStats } from "./types";

export const INDEX_URL = "https://mip-org.github.io/mip-core/index.json";

// Lifetime download counts, published to the channel repo's `stats` branch by
// the daily download-stats workflow. Absent until that branch exists, so a
// failed fetch is non-fatal — pages just render without counts.
export const STATS_URL =
  "https://raw.githubusercontent.com/mip-org/mip-core/stats/download-stats.json";

export const SITE_URL = "https://mip.sh";

// A version is "numeric" if it's a dot-separated sequence of integers (e.g.
// "1.0.0", "0.7"). Branch-name versions like "main" or "numbl" are not.
export function isNumericVersion(version: string): boolean {
  return /^\d+(\.\d+)*$/.test(version);
}

// Compare two numeric versions component-wise, missing components treated as 0
// (so "1.2" == "1.2.0"). Returns >0 when a is higher than b.
export function compareNumericVersions(a: string, b: string): number {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

// Of a package's variants, pick the version to display: the highest numeric
// version if any exist, otherwise fall back to the first variant's version
// (which may be a branch name like "main" or "unspecified").
export function pickDisplayVersion(variants: Package[]): string {
  const numeric = variants
    .map((v) => v.version)
    .filter(isNumericVersion)
    .sort(compareNumericVersions);
  return numeric.length > 0 ? numeric[numeric.length - 1] : variants[0].version;
}

// The GitHub release tag a variant's assets are published under — the path
// segment after /download/ in its mhl_url. Not always `${name}-${version}`:
// hyphens in package names appear as underscores in the tag.
export function releaseTag(pkg: Package): string {
  const m = pkg.mhl_url.match(/\/download\/([^/]+)\//);
  return m ? m[1] : `${pkg.name}-${pkg.version}`;
}

export function groupPackagesByName(
  packages: Package[]
): Map<string, Package[]> {
  const grouped = new Map<string, Package[]>();
  for (const pkg of packages) {
    const existing = grouped.get(pkg.name) || [];
    existing.push(pkg);
    grouped.set(pkg.name, existing);
  }
  return grouped;
}

// One entry per unique name, merging architecture info. The entry's fields
// come from a variant of the highest numeric version (not whichever variant
// happens to be first), so version-derived values like the release tag match
// the displayed version.
export function deduplicatePackages(packages: Package[]): Package[] {
  return Array.from(groupPackagesByName(packages).values()).map((variants) => {
    const version = pickDisplayVersion(variants);
    const representative =
      variants.find((v) => v.version === version) ?? variants[0];
    return {
      ...representative,
      version,
      architecture: [...new Set(variants.map((v) => v.architecture))].join(
        ", "
      ),
    };
  });
}

// Aggregate lifetime downloads over all architectures of each (package,
// release), keyed by release tag.
export function aggregateDownloadsByTag(
  stats: DownloadStats | null
): Map<string, number> {
  const totals = new Map<string, number>();
  if (!stats) return totals;
  for (const [key, asset] of Object.entries(stats.assets)) {
    const tag = key.split("/")[0];
    totals.set(tag, (totals.get(tag) ?? 0) + asset.lifetime);
  }
  return totals;
}

export function usePackageIndex() {
  const [data, setData] = useState<PackageIndex | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(INDEX_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  return { data, error };
}

export function useDownloadStats(): DownloadStats | null {
  const [stats, setStats] = useState<DownloadStats | null>(null);

  useEffect(() => {
    fetch(STATS_URL)
      .then((r) => (r.ok ? r.json() : null))
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  return stats;
}
