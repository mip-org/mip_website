---
title: Building a MEX Package
slug: building-a-mex-package
summary: Create a MIP package that compiles C code into MEX binaries for MATLAB.
order: 3
---

MEX files let you call compiled C, C++, or Fortran code directly from MATLAB. MIP handles compilation automatically: you provide your source code and a compile script, and the channel's CI builds architecture-specific MEX binaries for Linux and macOS.

In this guide we'll create a MIP package that includes a C MEX function. We'll use a simple dot product as the example, but the same pattern applies to wrapping larger C/C++ libraries.

## How it works

A MEX package has two parts beyond the normal MATLAB source:

- A **C (or C++/Fortran) source file** that implements the `mexFunction` entry point
- A **compile script** (`compile.m`) that calls MATLAB's `mex` command to build the binary

When hosted on a channel, the CI runs the compile script on each target platform, producing architecture-specific `.mex*` binaries (`.mexa64` on Linux, `.mexmaca64` on macOS ARM, etc.). These get bundled into the package so that users don't need a compiler installed.

## The C implementation

Here's [hello_mip_mex](https://github.com/mip-org/hello_mip_mex), a minimal example. The repo has three files:

```
hello_mip_mex/
├── mex_dot.c       # C MEX implementation
├── compile.m       # Compilation script
└── mip.yaml        # Package definition
```

The C file implements the standard MEX interface. MATLAB calls `mexFunction` with input and output arrays, and you read the data, do your computation, and write the result back.

```c
#include "mex.h"

void mexFunction(int nlhs, mxArray *plhs[],
                 int nrhs, const mxArray *prhs[])
{
    double *a, *b;
    mwSize n, i;
    double sum;

    /* Check inputs */
    if (nrhs != 2)
        mexErrMsgIdAndTxt("mex_dot:nrhs", "Two inputs required.");
    if (!mxIsDouble(prhs[0]) || mxIsComplex(prhs[0]) ||
        !mxIsDouble(prhs[1]) || mxIsComplex(prhs[1]))
        mexErrMsgIdAndTxt("mex_dot:notDouble",
                          "Inputs must be real double arrays.");

    n = mxGetNumberOfElements(prhs[0]);
    if (mxGetNumberOfElements(prhs[1]) != n)
        mexErrMsgIdAndTxt("mex_dot:dimMismatch",
                          "Inputs must have the same number of elements.");

    a = mxGetPr(prhs[0]);
    b = mxGetPr(prhs[1]);

    sum = 0.0;
    for (i = 0; i < n; i++) {
        sum += a[i] * b[i];
    }

    plhs[0] = mxCreateDoubleScalar(sum);
}
```

## The compile script

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

For packages with C++ source files, you can pass compiler flags to `mex`:

```matlab
mex('CXXFLAGS=$CXXFLAGS -std=c++14', 'my_function.cpp');
```

For packages that link against external libraries, you can pass include paths and library flags the same way you would on the command line:

```matlab
mex('-I/path/to/include', '-L/path/to/lib', '-lmylib', 'my_function.c');
```

## The mip.yaml

The `mip.yaml` lives in the source repo alongside the code:

```yaml
name: hello_mip_mex
description: "A simple test package demonstrating MEX compilation"
version: "main"
license: MIT
homepage: "https://github.com/mip-org/hello_mip_mex"
repository: "https://github.com/mip-org/hello_mip_mex"
dependencies: []

addpaths:
  - path: "."

builds:
  - architectures: [linux_x86_64, macos_x86_64, macos_arm64]
    compile_script: compile.m
```

A few things to note compared to a pure-MATLAB package:

- `architectures` lists the specific platforms to build for, instead of `[any]`. Each architecture gets its own build with the appropriate MEX binary.
- `compile_script` points to the MATLAB script that compiles the MEX files. The channel's CI runs this automatically on each target platform.
- The `addpaths` entry points to the directory containing both the `.c` source and the compiled `.mex*` binary. MATLAB resolves the MEX function by name, just like a `.m` file.

Note that MIP strips any pre-compiled MEX binaries from the source before building. This ensures every binary is built from source in CI, so users get consistent, trustworthy builds for their platform.

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
mex_dot(a, b) % Returns 70
```

## What's next

This example covers the basics, but the same pattern handles more complex builds. For packages that need external libraries, CMake builds, or Fortran compilation, see how [finufft](https://github.com/mip-org/mip-core/tree/main/packages/finufft) and [fmm2d](https://github.com/mip-org/mip-core/tree/main/packages/fmm2d) are packaged in mip-core.
