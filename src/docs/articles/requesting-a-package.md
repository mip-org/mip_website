---
title: Requesting a Package
slug: requesting-a-package
summary: Ask for a MATLAB package to be added to the mip catalog.
order: 3
---

## Overview

If a package is not in the [catalog](/packages), you can request that it be
added. Any MATLAB package with publicly available source code — typically a
GitHub repository — is eligible. Packages distributed only as pre-built
binaries cannot be added.

## How to request

Submit one of the following:

- [A package request on GitHub](https://github.com/mip-org/mip-core/issues/new?template=request-package.yml) — you'll be notified on the issue as it progresses.
- [The request form](https://docs.google.com/forms/d/e/1FAIpQLSc3m9qjzRycb7geCR-OVZLvWnDBlCqdOeuf_FHWnxSmjRcVWQ/viewform) — if you don't have a GitHub account. Include an email address if you want to be notified.

Both ask for:

- **Package name** — what you'd type after `mip install`.
- **Repository URL** — where the source is.

Use the optional notes field for anything else that would help: a specific
version or tag, or whether the package includes compiled (MEX) code.

## What happens next

A maintainer writes the packaging recipe and runs it through the build. Once
it builds successfully, the package can be installed:

```matlab
mip install <name>
mip load <name>
```

Each package in the catalog gets a page at `https://mip.sh/packages/<name>`
with install instructions and a copyable README badge.

## Packaging it yourself

Alternatively, you can package it yourself and distribute it from your own
[custom channel](/docs/hosting-a-channel), then request that it be added to
the core channel.
