---
title: Hosting a Channel
slug: hosting-a-channel
summary: Set up a GitHub-based MIP channel to distribute packages to others.
order: 6
---

MIP packages are distributed through **channels**, which are GitHub repos that build packages and publish an index via GitHub Pages. The official channel is `mip-org/core`, but you can create your own to distribute packages for your lab, team, or project.

## Setting up your channel

A channel is just a GitHub repo with a `packages/` folder and a small set of GitHub Actions workflows. The workflows are thin wrappers that delegate the whole build pipeline to the shared engine in [mip-org/mip_channel_tools](https://github.com/mip-org/mip_channel_tools), so the easiest way to start is to copy an existing channel and swap in your own packages.

[mip-example](https://github.com/mip-org/mip-example) (a single package) and [mip-hello](https://github.com/mip-org/mip-hello) (a handful of packages showing different source layouts) are both kept current with the build system and make good starting points.

1. Create an empty GitHub repo named `mip-<channel_name>` — for example `mip-mylab`. The name matters: when someone runs `mip install --channel youruser/mylab ...`, MIP looks for a repo called `mip-mylab` under your account.

2. Copy an example channel into it and point it at your repo:

   ```bash
   git clone https://github.com/mip-org/mip-hello mip-mylab
   cd mip-mylab
   git remote set-url origin https://github.com/youruser/mip-mylab
   ```

3. Replace the example packages with your own (see [Adding a package](#adding-a-package) below), update `README.md` to describe your channel, then commit and push:

   ```bash
   rm -rf packages/*
   # ... add your packages under packages/<name>/<version>/ ...
   git add -A
   git commit -m "Initial packages"
   git push -u origin main
   ```

4. In your repo's **Settings → Pages**, set the source to **GitHub Actions**. That's it — your channel is ready.

Keep the `.github/workflows/`, `.gitattributes`, and `.gitignore` files from the example as they are; they wire your channel to the build engine. You don't write or maintain any build scripts yourself.

## Adding a package

Each package release lives at `packages/<name>/<version>/` and is described by a `source.yaml` that tells the channel where to get the source. The package metadata (`mip.yaml`) can come from the source repo or be provided by the channel.

For real-world examples of how packages are defined, browse the [`packages/` folder of mip-core](https://github.com/mip-org/mip-core/tree/main/packages) — it covers the full range, from one-line `source.yaml` files to packages that overlay channel-provided metadata and compile scripts.

### Directory structure

```
packages/<name>/<version>/
├── source.yaml        # Required: where to get the source
├── mip.yaml           # Optional: provides or overrides the package metadata
└── compile.m          # Optional: channel-provided compilation script
```

### Pointing to a source repo (recommended)

The recommended approach is to keep your source code in its own repo with a `mip.yaml` at the root. The channel's `source.yaml` just points to it:

```yaml
source:
  git: "https://github.com/youruser/my_package"
  branch: "main"
```

The channel clones the source, finds the `mip.yaml` in it, and builds the package. This keeps the source repo self-contained and usable with any channel.

For an example, see [hello_mip](https://github.com/mip-org/hello_mip), which has its own `mip.yaml` and is referenced by a minimal `source.yaml` in the [mip-hello](https://github.com/mip-org/mip-hello) channel.

### Providing mip.yaml in the channel

If the source repo doesn't include a `mip.yaml`, or you want to override it, provide one in the channel alongside the `source.yaml`:

```
packages/my_package/main/
├── source.yaml
└── mip.yaml           # channel-provided metadata
```

This is useful when packaging third-party code you don't control, or when different channels need different build configurations for the same source.

### source.yaml options

`source.yaml` supports several ways to fetch source code:

```yaml
source:
  git: "https://github.com/someone/some-matlab-repo.git"
  branch: "main"              # Optional: branch or tag
  subdirectory: "matlab"      # Optional: use only this subdirectory
  submodules: true            # Optional: also clone git submodules
  remove_dirs: [tests, docs]  # Optional: delete directories after fetch
```

Instead of `git`, you can fetch a `zip` or `tarball` by URL:

```yaml
source:
  zip: "https://example.com/my_package-1.0.0.zip"
```

Do not put a `version` field in `source.yaml` — the version comes from the release directory name (see [Versioning](#versioning)).

### Including source in the channel

For very small packages you can place the source files directly in the channel directory alongside `mip.yaml`, with a `source.yaml` that has no `source:` block (an empty file or a comment is fine). This isn't recommended for anything substantial, since it mixes package source with channel configuration.

For an example, see [hello_inline](https://github.com/mip-org/mip-hello/tree/main/packages/hello_inline) in the mip-hello channel.

### Channel-provided compile scripts

For packages that need compilation (for example, MEX), you can include compile scripts in the channel directory. These overlay onto the prepared source before building, which is useful when the source repo doesn't ship the right compile script for your channel's build targets. See [Building a MEX Package](/docs/building-a-mex-package).

## Versioning

The version is determined by the directory name under the package directory:

- `main`: always builds from the latest commit on the named branch
- `1.0.0`: a fixed version, typically pointing to a tag

You can have multiple versions side by side:

```
packages/my_package/
├── main/
│   └── source.yaml
└── 1.0.0/
    └── source.yaml
```

## How CI works

Builds run one `(package, architecture)` pair at a time. The workflows in your channel are thin callers; all the logic lives in [mip-org/mip_channel_tools](https://github.com/mip-org/mip_channel_tools), so every channel shares the same, centrally maintained build engine.

- **On push to `main`**, the channel dispatches a build for every `(package, architecture)` pair affected by the change.
- **Daily**, a scheduled probe rebuilds any pair whose `.mhl` is missing or whose source has changed upstream (for example, a tracked branch advanced).
- **On demand**, you can request builds by opening an issue whose title starts with `Build`. See your channel's `README.md` for the exact format.

Each build prepares the source per `source.yaml`, overlays any channel-provided files, bundles (and compiles, if needed) a single `.mhl`, tests it, uploads it as a GitHub release asset, and republishes the channel index to GitHub Pages.

CI builds `any` (pure MATLAB, built once), `linux_x86_64`, `macos_arm64`, and `windows_x86_64`. A package declares which it supports in its `mip.yaml`. If the source hasn't changed since the last build, the build is skipped.

A package may also declare `macos_x86_64` (Intel Mac), but CI can't build it — MathWorks no longer supports MATLAB on Intel-Mac CI runners — so that architecture has to be built and published from an actual Intel Mac by a maintainer.

## Installing from your channel

Once your channel is set up and CI has run, users can install packages:

```matlab
mip install --channel youruser/mylab my_package
mip avail --channel youruser/mylab
```

Replace `youruser/mylab` with your GitHub username and channel name (the repo name minus the `mip-` prefix).
