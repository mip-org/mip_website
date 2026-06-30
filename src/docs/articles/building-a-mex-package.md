---
title: Building a MEX Package
slug: building-a-mex-package
summary: Create a mip package that compiles C code into MEX binaries for MATLAB.
order: 5
---

MEX files let you call compiled C, C++, or Fortran code directly from MATLAB. mip handles compilation automatically: you provide your source code and a compile script, and the channel's CI builds architecture-specific MEX binaries for Linux, macOS, and Windows.

## How it works

A MEX package has two parts beyond the normal MATLAB source:

- A **C (or C++/Fortran) source file** that implements the `mexFunction` entry point
- A **compile script** (`compile.m`) that calls MATLAB's `mex` command to build the binary

When hosted on a channel, the CI runs the compile script on each target platform, producing architecture-specific `.mex*` binaries (`.mexa64` on Linux, `.mexmaca64` on macOS ARM, etc.). These get bundled into the package so that users don't need a compiler installed.

## A minimal example

[hello_mip_mex](https://github.com/mip-org/hello_mip_mex) is a minimal example package. The repo has three files:

```
hello_mip_mex/
├── mex_dot.c       # C MEX implementation
├── compile.m       # Compilation script
└── mip.yaml        # Package definition
```

### The C source

The C file implements the standard MEX interface:

```c
#include "mex.h"

void mexFunction(int nlhs, mxArray *plhs[],
                 int nrhs, const mxArray *prhs[])
{
    /* read inputs from prhs, write outputs to plhs */
}
```

This is a standard MEX function — see the [MathWorks MEX documentation](https://www.mathworks.com/help/matlab/mex-file-creation.html) for the API.

### The compile script

The compile script is a MATLAB `.m` file that calls the `mex` command on each source file:

```matlab
fprintf('Compiling hello_mip_mex MEX files...\n');

src_dir = fileparts(mfilename('fullpath'));
original_dir = pwd;
cd(src_dir);

try
    mex('mex_dot.c');
    fprintf('MEX compilation completed successfully.\n');
catch ME
    cd(original_dir);
    rethrow(ME);
end

cd(original_dir);
```

You can pass any `mex` flags you'd use on the command line — compiler flags, include paths, libraries — directly as additional arguments to the `mex(...)` call.

### The mip.yaml

The `mip.yaml` for a MEX package looks like this:

```yaml
name: hello_mip_mex
description: "A simple test package demonstrating MEX compilation"
version: ""
license: MIT
homepage: "https://github.com/mip-org/hello_mip_mex"
repository: "https://github.com/mip-org/hello_mip_mex"
dependencies: []

paths:
  - path: "."

builds:
  - architectures: [linux_x86_64, macos_arm64, windows_x86_64]
    compile_script: compile.m
```

Compared to a pure-MATLAB package:

- `architectures` lists the specific platforms to build for, instead of `[any]`. Each architecture gets its own build with the appropriate MEX binary.
- `compile_script` points to the MATLAB script that compiles the MEX files. The channel's CI runs this automatically on each target platform.
- The `paths` entry points to the directory containing both the `.c` source and the compiled `.mex*` binary. MATLAB resolves the MEX function by name, just like a `.m` file.

mip strips any pre-compiled MEX binaries from the source before building. This ensures every binary is built from source in CI, so users get consistent, trustworthy builds for their platform.

## Using the package

Install and load the package in MATLAB:

```matlab
mip install hello_mip_mex
mip load hello_mip_mex
```

Then use it like any other MATLAB function:

```matlab
a = [1, 2, 3, 4, 5];
b = [2, 3, 4, 5, 6];
mex_dot(a, b)   % Returns 70
```

## When does compilation happen?

Where the compile script runs depends on how the package is installed:

- **From a channel** (`mip install hello_mip_mex`) — nothing is compiled on
  your machine. The channel's CI already compiled the package for each
  architecture and published the binaries inside the `.mhl` archive. Installing
  downloads the archive for your platform and unpacks it, so you don't need a
  compiler.
- **From a local directory** (`mip install ./hello_mip_mex`) — mip strips any
  pre-built binaries from the source and runs the compile script on your machine
  for the current architecture. This path *does* require a working compiler. The
  resulting binaries are tied to your local toolchain, so they aren't guaranteed
  to be portable the way a channel's CI build is.

## Editable installs and `mip compile`

An editable install is for developing a package — mip points at your source
directory instead of copying it, so edits to `.m` files take effect immediately
without reinstalling:

```matlab
mip install -e .
```

For a MEX package, an editable install also runs the compile script once, in
your source directory, so the binaries are ready to use. C/C++/Fortran changes
aren't picked up automatically, though — after editing source that needs
recompiling, rebuild in place with:

```matlab
mip compile hello_mip_mex
```

If you want to set up the editable install without compiling yet (for example,
on a machine without a compiler, or before you've written the source), skip it
with `--no-compile` and run `mip compile` later:

```matlab
mip install -e . --no-compile
```

`mip compile <package>` works on any installed package that defines a
`compile_script` — for editable installs it compiles in your source directory,
and for local copy installs it compiles in the installed package directory.

## What's next

This example covers the basics, but the same pattern handles more complex builds. For packages that need external libraries, CMake builds, or Fortran compilation, see how [finufft](https://github.com/mip-org/mip-core/tree/main/packages/finufft) and [fmm2d](https://github.com/mip-org/mip-core/tree/main/packages/fmm2d) are packaged in mip-core.
