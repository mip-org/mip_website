export interface Package {
  name: string;
  description: string;
  version: string;
  dependencies: string[];
  homepage: string;
  repository: string;
  license: string;
  architecture: string;
  build_on?: string;
  usage_examples: string[];
  exposed_symbols: string[];
  source_hash?: string;
  timestamp: string;
  prepare_duration: number;
  compile_duration: number;
  mhl_url: string;
  mip_json_url: string;
}

export interface PackageIndex {
  packages: Package[];
  total_packages: number;
  last_updated: string;
}

export interface DownloadStatAsset {
  lifetime: number;
  base: number;
  last_raw: number;
  asset_id: number;
  created_at?: string;
  first_seen: string;
  updated: string;
}

export interface DownloadStats {
  generated: string;
  repo: string;
  total_lifetime_downloads: number;
  // Keyed by "<name>-<version>/<name>-<version>-<arch>.mhl".
  assets: Record<string, DownloadStatAsset>;
}
