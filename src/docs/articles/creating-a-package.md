---
title: Creating a Package
slug: creating-a-package
summary: Create a MIP package from local MATLAB code and install it.
order: 2
---

A MIP package is a directory of MATLAB code with a `mip.yaml` file that describes it. You can create, install, and use packages locally without publishing them to a channel.

## A minimal package

Start with a directory containing your MATLAB code and a `mip.yaml`:

```
my_package/
├── my_function.m
└── mip.yaml
```

The `mip.yaml` defines the package metadata:

```yaml
name: my_package
description: "My first MIP package"
version: "0.1.0"
license: MIT
dependencies: []

addpaths:
  - path: "."

builds:
  - architectures: [any]
```

The `addpaths` entries tell MIP which directories to add to the MATLAB path when the package is loaded. `architectures: [any]` means this is pure MATLAB with no compiled code.

## Installing locally

From MATLAB, install the package by pointing to its directory:

```matlab
mip install /path/to/my_package
```

This bundles and installs the package into MIP's package store. You can then load and use it:

```matlab
mip load my_package
my_function()
```

## Editable installs

During development, you don't want to reinstall every time you change a file. Use an editable install instead:

```matlab
mip install -e /path/to/my_package
```

Instead of copying your source files, this registers the original directory path so that changes are reflected immediately without reinstalling. It works like `pip install -e` in Python.

## Organizing your code

Your package can have any directory structure. Use `addpaths` to specify which directories should be on the MATLAB path:

```yaml
addpaths:
  - path: "."
  - path: "utils"
  - path: "plotting"
```

Only the listed directories are added to the path. Subdirectories are not added automatically.

## Dependencies

If your package depends on other MIP packages, list them:

```yaml
dependencies: ["chebfun", "finufft"]
```

When someone installs your package, MIP will install the dependencies too. When they load your package, the dependencies are loaded first.

## What's next

For packages that include compiled C/MEX code, see [Building a MEX Package](/docs/building-a-mex-package). For packages targeting numbl with WebAssembly, see [Building a WASM Package](/docs/building-a-wasm-package). To distribute your package to others, see [Hosting a Channel](/docs/hosting-a-channel).
