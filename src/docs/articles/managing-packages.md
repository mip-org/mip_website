---
title: Managing Packages
slug: managing-packages
summary: Update, uninstall, compile, and inspect packages after they are installed.
order: 2
---

Once packages are installed, MIP provides commands for keeping them current, inspecting their state, and removing them. This article covers the day-to-day lifecycle.

## Listing and inspecting

```matlab
mip list                  % All installed packages (most recently loaded first)
mip list --sort-by-name   % Alphabetical
mip info chebfun          % Local installation details + available versions in the channel
mip avail                 % Packages available in mip-org/core
mip avail --channel youruser/mylab
```

`mip info` with a bare name shows details for every installation with that name. Pass a fully qualified name (`org/channel/name`) to narrow to one.

`mip list` annotates each package with any of `[sticky]`, `[pinned]`, or `[editable: <source>]` as applicable. An asterisk (`*`) marks packages you loaded directly (as opposed to those pulled in as dependencies).

## Updating

Update one package:

```matlab
mip update chebfun
```

Update everything installed:

```matlab
mip update --all
```

By default, `mip update` only touches the packages you name. Their dependencies are **not** updated, even if newer versions exist. To update a package and all of its installed dependencies:

```matlab
mip update --deps chebfun
```

If a package is already at the latest version, `mip update` does nothing. Use `--force` to reinstall anyway:

```matlab
mip update --force chebfun
mip update --all --force
```

If the new version of a package has new dependencies, they are installed automatically. If it drops a dependency that no other directly-installed package needs, that dependency is pruned.

### Pinning a package

To protect a package from `mip update --all` — for example, because a newer release broke something you depend on — pin it:

```matlab
mip pin chebfun
mip unpin chebfun
```

Pinned packages are skipped by `mip update --all` (a "Skipping pinned package" message is printed for each). They are **not** protected from an explicit `mip update chebfun` — naming the package updates it. Passing `--force` also overrides the pin and automatically unpins the package after a successful update.

Pinned packages show up with a `[pinned]` marker in `mip list`. The pin is cleared automatically if you uninstall the package.

### Updating MIP itself

```matlab
mip update mip
```

This fetches the latest MIP from `mip-org/core` and replaces it in place.

### Skipping compilation

For editable local packages with a `compile_script`, `mip update` re-runs the compile step by default. To skip it for one update:

```matlab
mip update --no-compile my_dev_package
```

`--no-compile` only applies to editable local installs.

## Uninstalling

```matlab
mip uninstall chebfun
```

This unloads the package (if loaded), removes its files, and then prunes any orphaned dependency packages that nothing else needs.

If a bare name matches installations on multiple channels, `mip uninstall` refuses and asks you to specify the fully qualified name:

```matlab
mip uninstall mip-org/core/chebfun
```

### Uninstalling MIP itself

```matlab
mip uninstall mip
```

This triggers a full uninstall: MIP unloads every package, deletes the entire root directory, and removes itself from your saved MATLAB path. You'll be asked to confirm before anything is deleted. To reinstall later, run the install command from the [Installing Packages](/docs/installing-packages) article.

## Compiling a package

If a package's install failed mid-compile, or you want to recompile an editable install after changing source:

```matlab
mip compile my_package
```

For non-editable installs, this rebuilds in the installed package directory. For editable installs, it runs the compile script in your source directory. A package must have `compile_script` in its `mip.json` for this to work.

## Running a package's tests

```matlab
mip test my_package
```

Loads the package (if not already loaded) and runs its `test_script` as declared in `mip.yaml`.

## Resetting MIP state

To unload everything and clear MIP's in-memory load state:

```matlab
mip reset
```

This is equivalent to `mip unload --all --force` plus clearing in-memory tracking. Installed packages on disk are untouched.

## Where packages live

MIP stores installed packages under a single root directory. To relocate the root, set the `MIP_ROOT` environment variable before starting MATLAB:

```bash
export MIP_ROOT=/path/to/mip-root
```

The directory must already exist and contain a `packages/` subdirectory. To see the current root:

```matlab
mip root
```

And to see the URL of a channel's index file:

```matlab
mip index
mip index youruser/mylab
```
