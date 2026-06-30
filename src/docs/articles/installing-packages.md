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

### Installing on demand

If you're not sure a package is installed yet, `--install` installs it first (if needed) and then loads it, in one step:

```matlab
mip load chebfun --install
mip load --channel youruser/mylab my_package --install
```

### Loading extra path groups

Some packages ship optional directories — examples, tests, benchmarks — that aren't on the path by default. If the package declares them as **extra path groups** in its `mip.yaml`, pull one in at load time with `--with`:

```matlab
mip load chebfun --with examples
mip load chebfun --with examples --with tests
```

`--with` can be repeated, and applies only to the package you name — not its dependencies. Like `--addpath`, it's transient: the next plain `mip load` reverts to the package's default paths.

### Adding or removing extra paths at load time

Sometimes a package's default `paths` aren't quite what you want — you may need an extra subdirectory on the path, or want to drop one that shadows something else. Pass `--addpath <relpath>` or `--rmpath <relpath>` to `mip load`:

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

Here `youruser/mylab` names the channel `mylab` under the `youruser` account, which lives in the GitHub repo `youruser/mip-mylab`.

You can also use fully qualified package names, which include the channel:

```matlab
mip install youruser/mylab/my_package
mip load youruser/mylab/my_package
```

### Personal channels

A **personal channel** is one whose name matches the account that hosts it — the repo `youruser/mip-youruser`. As a shorthand, a bare account name expands to this personal channel, so you can drop the repeated segment:

```matlab
mip install --channel youruser my_package   % same as --channel youruser/youruser
mip install youruser/my_package             % same as youruser/youruser/my_package
```

### Subscribing to a channel

Passing `--channel youruser/mylab` on every command gets tedious if you use a channel a lot. Subscribe to it once, and bare-name installs fall back to it automatically:

```matlab
mip channel add youruser/mylab     % subscribe at highest priority
mip install my_package             % now resolves on youruser/mylab if not in core
```

When you install a bare name, MIP checks `mip-org/core` first, then each subscribed channel in priority order, and uses the first one that publishes the package. Manage your subscriptions with:

```matlab
mip channel list                   % show subscriptions in priority order
mip channel append youruser/other  % subscribe at lowest priority
mip channel remove youruser/mylab  % unsubscribe
```

`mip channel add` puts a channel at the top of the priority list (re-running it moves an existing subscription back to the top); `mip channel append` puts it at the bottom. Subscriptions are saved on disk and persist across MATLAB sessions.

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

## Installing from a `.mhl` file

A `.mhl` file is a single-file MIP package bundle — the same artifact a channel builds and publishes. If someone hands you one directly, or links to one, install it without any channel:

```matlab
mip install /path/to/chebfun-1.0.0-any.mhl
mip install https://example.com/chebfun-1.0.0-any.mhl
```

This is convenient for sharing a prebuilt package offline. To build a `.mhl` from your own package directory, see [Creating a Package](/docs/creating-a-package).

## Architectures

Each package declares which architectures it supports. MIP prefers an exact match for your platform; if the package declares `any`, that's used as a fallback. If the requested version has no compatible build, installation fails — MIP does **not** silently fall back to an older version. To install an older version that does support your platform, use `@version` explicitly.

Run `mip info` with no package name to see your platform's architecture string — it also reports the installed mip version and the root directory where packages live.
