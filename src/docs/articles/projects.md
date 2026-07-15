---
title: Projects
slug: projects
summary: Declare your dependencies in mip.yaml, lock them in mip.lock, and rebuild the same environment on any machine.
order: 8
section: coming-soon
---

> **Coming soon.** Projects are not yet available in the released version of mip. You can try them today via the preview build from the labs channel — see [Trying it out](#trying-it-out) below. The design is specified in [MEP 9](https://github.com/mip-org/meps/blob/main/meps/mep-0009.md).

With [environments](/docs/environments), you manage a package set by hand: whatever you `mip install` is what's there. A **project** flips that around — you *declare* the packages you want in `mip.yaml`, and mip makes the environment match, recording the exact resolved versions in a lockfile (`mip.lock`) so any machine rebuilds the identical environment: your collaborator's, a CI runner's, or yours next year. If you know `uv` from the Python world, this is that workflow for MATLAB.

## Quick start

```matlab
cd ~/work/myproject
mip project init          % create a mip.yaml project spec
mip project add chebfun   % declare it, lock it, install it
mip activate              % work inside the project's environment
```

Then, from a fresh clone on any machine:

```matlab
mip project sync          % rebuild the environment exactly from mip.lock
```

And from the shell or CI, one command locks, syncs, and runs:

```sh
matlab -batch "mip project run analysis.m"
```

## Three files

| File | What it is | Commit it? |
|---|---|---|
| `mip.yaml` | Your spec: the packages you want. You edit it (or `mip project add/remove` does). | yes |
| `mip.lock` | The lock: exact resolved versions and archive digests. mip writes it. | yes |
| `.mip/` | The project's environment, rebuilt from the lock by `mip project sync`. | no — gitignore it |

`mip.yaml` is the same file that already serves as a package manifest. For a project it doesn't need a `name:` — a nameless `mip.yaml` is a plain project spec:

```yaml
dependencies:
  - findtria
  - chebfun@1.0.0               # pin a version
  - mip-org/labs/treeweave      # fully qualified: pin the channel

dependency_groups:              # development-time extras
  dev:
    - moxunit
```

If you *do* give it a `name:`, your project is simultaneously a mip package — and `mip project sync` installs it into the environment in editable mode, so its own functions are on the path alongside its dependencies.

## Declaring dependencies

```matlab
mip project add chebfun          % add, re-lock, and install
mip project add chebfun@2.0.0    % re-pin an existing entry
mip project add --dev moxunit    % add to the dev group
mip project remove chebfun       % remove and prune
```

`add` and `remove` edit `mip.yaml` in place (your comments and formatting are preserved), update `mip.lock`, and sync the environment. The `dev` group is for development-time packages — test frameworks, doc generators — and is installed by default by `sync` and `run`, so "clone, sync, run the tests" just works. It is never part of your package's published dependencies.

## Locking and syncing

```matlab
mip project lock             % resolve mip.yaml -> write mip.lock
mip project lock --upgrade   % re-resolve everything to the newest versions
mip project sync             % make .mip/ match mip.lock
mip project sync --no-dev    % skip the dev group (e.g. production CI)
```

The lock records the full dependency closure — every package's exact version, download URL, and checksum — so `sync` reinstalls without re-resolving anything, and verifies each download against the locked checksum. Re-locking after you edit the spec keeps the versions you already have; only `--upgrade` moves them.

`sync` makes the environment *match* the lock: packages you installed by hand and packages from deselected groups are removed. The first time it would remove anything from an environment it didn't build, it lists what would go and asks first.

## Running code

```matlab
mip project run analysis.m        % a script
mip project run process_data 42   % a function (arguments arrive as char)
mip project run "x = solve(3)"    % an expression
```

`run` makes sure the project is locked and synced, activates its environment *for the duration of the run only*, executes the target, and restores your session — path, loaded packages, everything. In CI, add `--locked` to fail instead of silently re-resolving when `mip.yaml` and `mip.lock` are out of step.

## Checking health

```matlab
mip project status           % spec, lock, and environment health
mip project status --check   % error on any drift (for CI)
```

`status` (or bare `mip project`) reports which mode the project is in and whether anything has drifted: the spec edited since the last lock, the lock changed since the last sync, or stray packages in the environment.

## Starting from an environment

Already have a hand-managed environment you like? Turn it into a project:

```matlab
mip activate                 % the environment to capture
mip project init --from-env  % its installed packages become the dependency list
mip project lock             % pin the versions
```

## Good to know

- **The lockfile is the switch.** A directory with a `mip.lock` is in project ("uv") mode; without one, environments stay fully hand-managed as described in [Environments](/docs/environments). `mip project lock`, `add`, and `run` each create the lock; deleting it opts back out.
- **`mip install` still works** inside a project — but its additions are not recorded in the lock, and the next `mip project sync` removes them. Use `mip project add` for anything you want to keep.
- **Project commands find the project for you.** They act on the nearest `mip.yaml`, searching upward from your current directory (like git finds `.git`), and announce which project they're using. Plain commands like `mip install` never search — they always target the active environment.
- **`mip activate`** with no argument also finds the nearest project and activates its `.mip`.
- **Extra channels** go in the spec: a `channels:` list in `mip.yaml` tells the resolver where to look beyond `mip-org/core`, so a fresh clone needs no channel setup.

## Trying it out

Until the feature ships in a release, you can preview it by installing the MEP 9 build of mip from the labs channel and loading it in place of your installed mip:

```matlab
mip install mip-org/labs/mip@mep-0009
mip load mip-org/labs/mip
```

From that point, `mip` commands in your session use the preview build, and everything described above is available (including everything from [Environments](/docs/environments), which this build contains). Your regular mip installation is untouched. To go back to your released version:

```matlab
mip unload mip-org/labs/mip
```

Feedback is welcome on the [MEP 9 discussion](https://github.com/mip-org/meps/issues/9).
