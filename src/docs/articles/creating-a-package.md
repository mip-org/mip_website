---
title: Creating a Package
slug: creating-a-package
summary: Create a MIP package from local MATLAB code and install it.
order: 4
---

A MIP package is a directory of MATLAB code with a `mip.yaml` file that describes it. You can create, install, and use packages locally without publishing them to a channel.

## Scaffolding with `mip init`

The quickest way to turn a directory of MATLAB code into a package is `mip init`, which generates a `mip.yaml` for you:

```matlab
cd /path/to/my_package
mip init
```

This walks the directory, adds any folders that contain MATLAB code to `paths`, creates a blank `test_my_package.m` placeholder, and writes a `mip.yaml` ready for you to fill in. The package name defaults to the directory's basename; override it with `--name` if needed:

```matlab
mip init /path/to/my_package --name my_package
mip init . --repository https://github.com/youruser/my_package
```

If a `mip.yaml` already exists, `mip init` leaves it alone.

## A minimal package

A filled-in `mip.yaml` for a pure-MATLAB package looks like this:

```yaml
name: my_package
description: "My first MIP package"
version: "0.1.0"
license: MIT
dependencies: []

paths:
  - path: "."

test_script: test_my_package.m

builds:
  - architectures: [any]
```

`mip init` generates this shape with the string fields (`description`, `version`, `license`, `homepage`, and `repository`) left blank, ready for you to fill in.

The `paths` entries tell MIP which directories to add to the MATLAB path when the package is loaded. Only the listed directories are added — subdirectories are not added automatically. `architectures: [any]` means the package is pure MATLAB with no compiled code.

### Optional path groups

Directories that shouldn't be on the path by default — examples, tests, benchmarks — can be declared under `extra_paths`, grouped by name:

```yaml
extra_paths:
  examples:
    - path: "examples"
  tests:
    - path: "tests"
```

Users opt into a group at load time with `mip load my_package --with examples`. `mip init` recognizes common `examples/`, `tests/`, and `benchmarks/` folders and fills in `extra_paths` for you automatically, keeping them off the default path.

## Installing locally

Install the package by pointing to its directory. The path must start with `.`, `..`, `/`, `~`, or a drive letter — a bare name is always treated as a channel install, even if a local directory of that name exists:

```matlab
mip install ./my_package
mip install /abs/path/to/my_package
```

If the directory has no `mip.yaml`, `mip install` offers to run `mip init` for you before continuing.

This bundles and installs the package into MIP's package store. You can then load and use it:

```matlab
mip load my_package
my_function()
```

Local install does **not** auto-install dependencies. They must already be installed (either from a channel or as other local packages) before the local install succeeds.

## Editable installs

During development, you don't want to reinstall every time you change a file. Use an editable install:

```matlab
mip install -e ./my_package
```

An editable install registers the source directory path rather than copying files. MATLAB sees your original files directly, so edits take effect on the next `mip load` — no reinstall needed. It's like `pip install -e` in Python.

A non-editable install, by contrast, copies your source into the package store, strips any pre-existing MEX binaries, and runs your `compile_script` once. Future edits to your original directory have no effect until you run `mip install` again.

Editable installs re-run `compile_script` on every `mip update`. Pass `--no-compile` to skip it for one update, or at install time to skip the initial compile.

## Testing your package

`mip init` creates a blank `test_<name>.m` script and points the `test_script` field of your `mip.yaml` at it. Fill that script with whatever checks your package needs — by convention it should error if something is wrong and print `SUCCESS` when everything passes:

```matlab
% test_my_package.m
assert(isequal(my_function(2), 4), 'my_function(2) should return 4');
disp('SUCCESS');
```

Run it any time with:

```matlab
mip test my_package
```

`mip test` loads the package first (if it isn't already), then runs its `test_script`; a run that doesn't error counts as a pass. This is the same script a channel runs in CI to verify each build, so keeping it green keeps your package installable everywhere.

## Dependencies

If your package depends on other MIP packages, list them:

```yaml
dependencies: ["chebfun", "finufft"]
```

**Bare names in `dependencies` always resolve to the `mip-org/core` channel.** If your package needs a dependency from a different channel, use the fully qualified name:

```yaml
dependencies:
  - chebfun                       # mip-org/core/chebfun
  - youruser/mylab/some_package   # explicit channel
```

`mip.yaml` dependencies are plain package names only — there is no `@version` suffix and no version-constraint grammar.

When someone installs your package from a channel, MIP installs the dependencies too. When they load it, dependencies are loaded first.

## Sharing a package as a single file

To hand a package to someone without setting up a channel, bundle it into a single `.mhl` file:

```matlab
mip bundle ./my_package
mip bundle ./my_package --output ~/dist
```

This produces `my_package-<version>-<arch>.mhl`, which anyone can install directly with `mip install path/to/my_package-<version>-<arch>.mhl` (see [Installing Packages](/docs/installing-packages)). For ongoing distribution with automatic updates, host a channel instead.

## What's next

For packages that include compiled C/MEX code, see [Building a MEX Package](/docs/building-a-mex-package). To distribute your package to others, see [Hosting a Channel](/docs/hosting-a-channel).
