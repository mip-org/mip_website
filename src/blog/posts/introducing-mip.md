---
title: Introducing MIP
date: 2026-04-03
slug: introducing-mip
author: Jeremy Magland
summary: A package manager for MATLAB with automatic dependency resolution, path management, and pre-compiled MEX binaries.
---

MIP is a package manager for MATLAB. It lets you install and manage MATLAB packages from a central index, with automatic dependency resolution, path management, and pre-compiled MEX binaries.

To get started, run this in MATLAB:

```matlab
eval(webread('https://mip.sh/install.txt'))
```

Then install a package:

```matlab
mip install chebfun
mip load chebfun
```

See the [documentation](/docs/installing-packages) for more.
