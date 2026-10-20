---
title: Publishing from Your Repository
slug: publishing-from-your-repository
summary: Build and publish a package from its own GitHub repository, without a channel.
order: 5
---

If you maintain a MATLAB package in its own GitHub repository, you can publish it from that repository directly. Each release you tag is built and tested for every architecture by GitHub Actions, and users install the package by naming the repository:

```matlab
mip install youruser/my_package
```

This needs one workflow file in your repository and no other setup. A [channel](/docs/hosting-a-channel) remains the better choice for a collection of packages, for packaging code you don't control, or for adding a `mip.yaml` or compile script on top of someone else's source.

## Requirements

- The repository is on GitHub and is **public**. The build runs MATLAB on GitHub's CI runners, which is only licensed for public repositories, and users download the built packages anonymously.
- `mip.yaml` is at the root of the repository (see [Creating a Package](/docs/creating-a-package)).
- The package `name` in `mip.yaml` matches the repository name. The comparison ignores case and treats `-` and `_` as the same, so the repository `My-Package` can publish `my_package`. A repository whose name contains a dot cannot publish this way.

## Setting up

Run `mip init -g` in a clone of the repository:

```matlab
cd /path/to/my_package
mip init -g
```

This writes `.github/workflows/repo-build.yml` (and a `mip.yaml`, if there isn't one yet):

```yaml
name: mip
on:
  push:
    tags: ['v*']
    branches: [main]      # optional: publish a rolling "main" build
  workflow_dispatch:
permissions:
  contents: write
jobs:
  mip:
    uses: mip-org/mip_channel_tools/.github/workflows/repo-build.yml@main
```

The file only sets the triggers; the build itself is the shared pipeline in [mip-org/mip_channel_tools](https://github.com/mip-org/mip_channel_tools), the same one channels use. Commit and push it. Running `mip init -g` again later replaces the file with the current version.

## Publishing a release

Push a tag whose name is the version, with or without a leading `v`:

```bash
git tag v1.0.0
git push origin v1.0.0
```

The workflow builds version `1.0.0` for each architecture listed under `builds` in `mip.yaml`, runs your `test_script` on each build in a clean environment, and attaches the resulting `.mhl` files to the GitHub release for the tag, creating the release if it does not exist. It then updates the package index that `mip install` reads.

If `mip.yaml` declares a `version`, it must equal the tag's version, or the workflow fails before building. You can also leave `version` blank and let the tag decide. A tag that is not a plain version after removing the `v`, such as `v1.1.0-beta`, is published under its full name; users get it only by asking for it with `@v1.1.0-beta`.

Each push to `main` publishes a build named `main`, which replaces the previous one. Remove the `branches: [main]` line if you don't want this. These builds, and the index, are attached to a prerelease named `mip-index`; leave that release in place.

To rebuild without pushing, open the repository's **Actions** tab, select the **mip** workflow, and choose **Run workflow**. Run from a tag, it rebuilds that tag; run from a branch, it rebuilds that branch. If you delete a release, the next run drops it from the index.

## Installing

Users install by naming the repository, in any of these forms:

```matlab
mip install youruser/my_package
mip install youruser/my_package@1.0.0
mip install youruser/my_package@main
mip install github.com/youruser/my_package
mip install https://github.com/youruser/my_package
```

The package is installed as `youruser/my_package`, and can be loaded by its bare name (`mip load my_package`) like any other package. `mip update my_package` picks up new releases; an installed `main` build stays on `main` and picks up newer builds of it. `mip avail youruser/my_package` lists the published versions and architectures.

## Dependencies

Bare names in `dependencies` resolve to `mip-org/core` only. To depend on a package published from another repository, write it as `<owner>/<repo>`; for a package on another channel, use its fully qualified name:

```yaml
dependencies:
  - chebfun                             # mip-org/core
  - github.com/otheruser/other_package  # another package repository
  - youruser/mylab/some_package         # a channel
```

The short form `otheruser/other_package` is not accepted in `dependencies`.

## If you also have a personal channel

`mip install youruser/my_package` looks for the repository `github.com/youruser/my_package` first. If that repository does not publish a mip package, mip says so and installs `my_package` from your personal channel `youruser/youruser` instead. To reach the personal channel directly, write `youruser/youruser/my_package`.
