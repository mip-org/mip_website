---
title: Environments
slug: environments
summary: Give each project its own isolated set of packages with mip env and mip activate.
order: 7
section: coming-soon
---

> **Coming soon.** Environments are not yet available in the released version of mip. You can try them today via the preview build from the labs channel — see [Trying it out](#trying-it-out) below. The design is specified in [MEP 8](https://github.com/mip-org/meps/blob/main/meps/mep-0008.md).

By default, mip installs every package into one shared location — the mip root where mip itself is installed (typically `~/Documents/MATLAB/mip`) — so all of your projects see the same package set. An **environment** is a separate, self-contained package root that you can create, activate, and install into — the MATLAB analog of a Python venv or a conda environment. Each environment has its own packages, so two projects can depend on different versions of the same package without interfering.

## Creating an environment

Environments come in two flavors, and one command creates both:

```matlab
mip env create            % a local env at ./.mip, next to your project
mip env create myenv      % a named env in a central store, usable from anywhere
```

A bare word is a name; anything with a path separator (like `./.mip`) is a path. If you keep a local `.mip` inside a git repository, add it to your `.gitignore`.

## Activating and using it

```matlab
mip activate myenv        % point the session at the env (or "mip activate" for ./.mip)
mip install chebfun       % installs into the env
mip load chebfun          % loads from the env
mip deactivate            % return to your normal setup
```

While an environment is active, all mip commands (`install`, `uninstall`, `update`, `load`, `list`, ...) act on it, and commands that change it print a leading `environment:` line so you always know where packages are going. Activating an environment unloads whatever you had loaded; deactivating restores it.

By default nothing is loaded when you activate — you `mip load` what you need, as usual. To load everything the environment contains in one step:

```matlab
mip activate myenv --load
```

## Managing environments

```matlab
mip env                   % show the active environment
mip env list              % list named environments (* marks the active one)
mip env delete myenv      % delete a named environment (asks for confirmation)
```

Local path environments are yours to manage — deleting the `.mip` directory is all it takes.

## Trying it out

Until the feature ships in a release, you can preview it by installing the MEP 8 build of mip from the labs channel and loading it in place of your installed mip:

```matlab
mip install mip-org/labs/mip@mep-0008
mip load mip-org/labs/mip
```

From that point, `mip` commands in your session use the preview build, and the environment commands above are available. To go back to your released version:

```matlab
mip unload mip-org/labs/mip
```

Your regular mip installation is untouched either way. Feedback is welcome on the [MEP 8 discussion](https://github.com/mip-org/meps/issues/8).
