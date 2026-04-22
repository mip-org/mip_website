---
title: Installing Packages
slug: installing-packages
summary: Install and load MATLAB packages from the MIP package index.
order: 1
---

## Installing MIP

To install MIP, run this in the MATLAB command window:

```matlab
eval(webread('https://mip.sh/install.txt'))
```

This adds the `mip` command to your MATLAB path. It works on Linux, macOS, and Windows, and requires no external tools.

## Installing a package

Install a package from the default channel (`mip-org/core`):

```matlab
mip install chebfun
```

Install multiple packages at once:

```matlab
mip install chebfun finufft
```

MIP resolves dependencies automatically. If a package depends on other packages, they'll be installed too.

## Loading a package

Installing a package downloads it but doesn't add it to your MATLAB path. To use it, load it:

```matlab
mip load chebfun
```

This adds the package (and its dependencies) to your path for the current session. Dependencies are loaded automatically too.

### Adding or removing extra paths at load time

Sometimes a package's default `addpaths` aren't quite what you want — you may need an extra subdirectory on the path, or want to drop one that shadows something else. Pass `--addpath <relpath>` or `--rmpath <relpath>` to `mip load`:

```matlab
mip load my_package --addpath examples
mip load my_package --addpath examples --rmpath src/legacy
```

`<relpath>` is resolved relative to the package's source directory. Both flags can be repeated to specify multiple paths in one call, and they apply only to the single package you're loading — transitively-loaded dependencies are unaffected.

These adjustments are **transient**: they apply for this load only. The next `mip load` without the flags reverts to the package's default paths.

## Unloading

```matlab
mip unload chebfun        % Unload one package
mip unload --all          % Unload all non-sticky packages in this session
mip unload --all --force  % Unload everything except mip itself
```

`mip-org/core/mip` is never unloaded — it's the package manager, and stays available for the duration of the MATLAB session.

When you unload a package, any dependencies it pulled in are pruned too, unless another loaded package still needs them.

## Sticky packages

Pass `--sticky` to keep a package loaded across `mip unload --all`:

```matlab
mip load chebfun --sticky
```

Sticky state lives in the current MATLAB session only — it does **not** persist across MATLAB restarts. To load a package in every new session, add a `mip load` call to your MATLAB startup file (`startup.m`).

## Using other channels

The default channel is `mip-org/core`, but packages can be hosted on any channel. To install from a different channel:

```matlab
mip install --channel youruser/mylab my_package
```

Here `youruser/mylab` refers to the GitHub repo `youruser/mip-mylab`. Channel names must be in `org/channel` form — a bare name like `mylab` is rejected.

You can also use fully qualified package names, which include the channel:

```matlab
mip install youruser/mylab/my_package
mip load youruser/mylab/my_package
```

## Requesting a specific version

Append `@<version>` to request a specific version:

```matlab
mip install chebfun@1.0.0
mip install mip-org/core/chebfun@main
```

This is a request, not a pin — MIP installs that version if it exists in the channel, and fails with `mip:versionNotFound` otherwise. There is no lock file and no version-constraint grammar.

If you install a non-numeric version like `main`, `mip update` will keep you on that track rather than silently switching you to a numeric release that later appears alongside it. To switch tracks, run `mip install` again with an explicit `@version`.

## Installing from a zip URL

You can install any MATLAB code that's published as a zip archive, even if it's not in a MIP channel:

```matlab
mip install my_package --url https://github.com/someone/repo/archive/refs/heads/main.zip
```

MIP downloads and extracts the archive, generates a `mip.yaml` via `mip init` if one isn't included, and installs it into MIP's package store. The positional name (`my_package` above) becomes the package name.

URL-installed packages cannot be updated automatically — `mip update` skips them, since the original archive is not preserved. To pull a newer version, run `mip install --url` again (uninstalling first if needed).

## Installing from MATLAB File Exchange

`--url` also accepts a File Exchange landing page URL directly — just copy it from your browser:

```matlab
mip install some_package --url https://www.mathworks.com/matlabcentral/fileexchange/12345-some-package
```

Since File Exchange entries don't come with a `mip.yaml`, MIP makes a best guess at which subdirectories to add to the MATLAB path on load. You may need to tweak the generated `mip.yaml` (or use `--addpath` / `--rmpath` on `mip load`) if the defaults aren't quite right.

This only works for File Exchange entries distributed as a zip file. MATLAB Toolbox (`.mltbx`) entries are not supported.

## Architectures

Each package declares which architectures it supports. MIP prefers an exact match for your platform; if the package declares `any`, that's used as a fallback. If the requested version has no compatible build, installation fails — MIP does **not** silently fall back to an older version. To install an older version that does support your platform, use `@version` explicitly.

Run `mip arch` to see your platform's architecture string.
