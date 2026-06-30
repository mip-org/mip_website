---
title: Requesting a Package
slug: requesting-a-package
summary: Ask for a MATLAB package to be added to the mip catalog.
order: 3
---

## Can't find a package?

If a package you want isn't in the [catalog](/packages), you can ask for it to
be added. You don't need to know anything about how packages are built — just
point us at the source.

## What you can request

Any MATLAB package whose source is publicly available — typically a GitHub
repository. The source needs to be there to build from; packages distributed
only as pre-built binaries can't be added.

## How to request

[Open a package request](https://github.com/mip-org/mip-core/issues/new?template=request-package.yml)
and fill in two things:

- **Package name** — what you'd type after `mip install`.
- **Repository URL** — where the source lives.

That's all that's required. If you know more, the optional notes field is the
place for it — a specific version or tag to package, whether it needs compiled
(MEX) code, or who uses it and why it'd help.

## Package it yourself

You can also package it yourself and distribute it from your own
[custom channel](/docs/hosting-a-channel), then request that it be added to the
core channel once it's working.

## What happens next

A maintainer reviews the request, writes the packaging recipe, and runs it
through the build. Once it builds successfully you'll be able to:

```matlab
mip install <name>
mip load <name>
```

The request issue is the place to follow along — you'll be notified there as it
progresses.
