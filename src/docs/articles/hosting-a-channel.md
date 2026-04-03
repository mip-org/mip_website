---
title: Hosting a Channel
slug: hosting-a-channel
summary: Set up a GitHub-based MIP channel to distribute packages to others.
order: 5
---

MIP packages are distributed through **channels**, which are GitHub repos that build packages and publish an index via GitHub Pages. The official channel is `mip-org/core`, but you can create your own to distribute packages for your lab, team, or project.

## Setting up your channel

Create a new GitHub repo from the [mip-channel-template](https://github.com/mip-org/mip-channel-template). Click "Use this template" and name your repo `mip-<channel_name>`, for example `mip-mylab`. The name matters: when someone runs `mip install --channel youruser/mylab`, MIP looks for a repo called `mip-mylab` under your GitHub account.

The template includes GitHub Actions workflows that handle the entire build pipeline. When you push to `main`, CI automatically prepares your packages, bundles them into `.mhl` files, uploads them as GitHub release assets, and publishes a package index to GitHub Pages.

To enable this, go to your repo's **Settings > Pages** and set the source to **GitHub Actions**. That's it, your channel is ready to accept packages.

## Adding a package

Each package needs a `recipe.yaml` that tells the channel where to get the source. The package metadata (`mip.yaml`) can come from the source repo or be provided by the channel.

### Directory structure

```
packages/<name>/releases/<version>/
├── recipe.yaml       # Required: where to get the source
├── mip.yaml          # Optional: overrides mip.yaml from source repo
└── compile.m         # Optional: channel-provided compilation script
```

### Pointing to a source repo (recommended)

The recommended approach is to keep your source code in its own repo with a `mip.yaml` at the root. The channel's `recipe.yaml` just points to it:

```yaml
source:
  git: "https://github.com/youruser/my_package"
  branch: "main"
```

That's it. The channel clones the source, finds the `mip.yaml` in it, and builds the package. This keeps things simple: the source repo is self-contained and can be used with any channel.

For an example, see [hello_mip](https://github.com/mip-org/hello_mip), which has its own `mip.yaml` and is referenced by a minimal `recipe.yaml` in the [mip-hello](https://github.com/mip-org/mip-hello) channel.

### Providing mip.yaml in the channel

If the source repo doesn't include a `mip.yaml`, or if you want to override it, you can provide one in the channel alongside the `recipe.yaml`:

```
packages/my_package/releases/main/
├── recipe.yaml
└── mip.yaml          # channel-provided metadata
```

This is useful when packaging third-party code that you don't control, or when different channels need different build configurations for the same source.

### recipe.yaml options

The `recipe.yaml` supports several options for fetching source code:

```yaml
source:
  git: "https://github.com/someone/some-matlab-repo.git"
  branch: "main"              # Optional: branch or tag
  subdirectory: "matlab"      # Optional: extract only this subdirectory
  remove_dirs: [tests, docs]  # Optional: remove directories after clone
```

### Including source in the channel

You can also include source files directly in the channel directory alongside the `recipe.yaml` and `mip.yaml`. This is useful for very small packages but not recommended for anything substantial, since it mixes package source with channel configuration.

For an example, see [hello_inline](https://github.com/mip-org/mip-hello/tree/main/packages/hello_inline) in the mip-hello channel.

### Channel-provided compile scripts

For packages that need compilation (MEX or WASM), you can include compile scripts in the channel directory. These overlay onto the prepared source before building. This is useful when the source repo doesn't include the right compile script for your channel's build targets.

## Versioning

The version is determined by the directory name under `releases/`. You can use:

- `main`: always builds from the latest commit on the main branch
- `1.0.0`: a fixed version, typically pointing to a tag or commit

You can have multiple versions side by side:

```
packages/my_package/releases/
├── main/
│   └── recipe.yaml
└── 1.0.0/
    └── recipe.yaml
```

## How CI works

On every push to `main`, the channel's GitHub Actions workflow:

1. **Prepares** packages: clones source per `recipe.yaml`, overlays any channel-provided files
2. **Bundles** packages: runs `mip bundle` to compile (if needed) and create `.mhl` files
3. **Uploads** packages: stores `.mhl` files as GitHub release assets
4. **Assembles index**: collects metadata into `index.json`
5. **Deploys**: publishes `index.json` and `packages.html` to GitHub Pages

Builds run in parallel across architectures (Linux x86_64, macOS x86_64, macOS ARM64, numbl WASM, etc.). Packages with `architectures: [any]` only build once to avoid duplication.

The workflow includes caching: if the source hasn't changed since the last build, the package is skipped.

## Installing from your channel

Once your channel is set up and CI has run, users can install packages:

```matlab
mip install --channel youruser/mylab my_package
mip avail --channel youruser/mylab
```

Replace `youruser/mylab` with your GitHub username and channel name (the repo name minus the `mip-` prefix).
