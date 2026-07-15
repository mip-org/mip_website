---
title: Environments
slug: environments
summary: Give each project its own isolated set of packages with mip env and mip activate.
order: 7
section: coming-soon
---

> **Coming soon.** Environments are not yet available in the released version of mip. You can try them today via the preview build from the labs channel — see [Trying it out](#trying-it-out) below. The design is specified in [MEP 8](https://github.com/mip-org/meps/blob/main/meps/mep-0008.md).

By default, mip installs every package into one shared location — the mip root where mip itself is installed (typically `~/Documents/MATLAB/mip`) — so all of your projects see the same package set. An **environment** is a separate, self-contained package root that you can create, activate, and install into — the MATLAB analog of a Python venv or a conda environment.

Environments are useful whenever one shared package set isn't enough:

- Two projects need different versions of the same package.
- You want a clean, throwaway package set for an experiment, without disturbing your main setup.
- You want a project's packages to live alongside its code.

## Quick start

```matlab
cd ~/work/myproject
mip env create            % create ./.mip next to your code
mip activate              % point the session at it
mip install chebfun       % installs into the environment
mip load chebfun          % loads from the environment
% ... work ...
mip deactivate            % back to your normal setup
```

Delete the `.mip` directory when you're done and every trace of the environment is gone.

## Named or local?

One command creates both kinds; the argument decides which:

```matlab
mip env create            % local: ./.mip in the current directory
mip env create myenv      % named: kept in a central store inside your mip root
mip env create ~/envs/e1  % local, at an explicit path
```

- **Named environments** (a bare word) live in a central store and can be activated by name from anywhere — handy for reusable setups like `teaching` or `dev`. mip keeps track of them: `mip env list` shows them all.
- **Local environments** (a path, like the default `./.mip`) live alongside a project. mip does not track them — they are ordinary directories that you manage like any other file, so deleting one is just deleting the folder.

If a local `.mip` sits inside a git repository, add it to your `.gitignore`.

Creation is deliberately strict: mip will not turn an existing non-empty directory into an environment, and it won't overwrite an existing one.

## Activating

```matlab
mip activate myenv        % a named environment
mip activate              % ./.mip in the current directory
mip activate ~/envs/e1    % an environment at a path
```

Activation points your MATLAB session at the environment:

- Whatever packages you had loaded are unloaded first, so nothing from your main setup leaks into the environment. Your session is restored when you deactivate.
- Nothing is loaded automatically — as always with mip, you `mip load` the packages you want. To instead load everything the environment contains in one step, use `mip activate myenv --load`.
- One environment is active at a time. Activating another one switches to it; `mip deactivate` returns to your normal setup, with your previously loaded packages put back.

## Working inside an environment

While an environment is active, all mip commands act on it — `install`, `uninstall`, `update`, `load`, `list`, `info`, and the rest. Commands that change the environment print a leading line so you always know where packages are going:

```
environment: myenv (~/Documents/MATLAB/mip/envs/myenv)
```

`mip env` (by itself) or `mip info` also report the active environment at any time.

A fresh environment starts empty and fully independent: it has its own installed packages, its own channel subscriptions, and its own pins. Subscribing to a channel or pinning a package inside an environment affects only that environment.

A common pattern for project work is an editable install of the project itself:

```matlab
mip activate
mip install -e .          % your package, editable, plus its declared dependencies
```

Missing channel dependencies declared in your `mip.yaml` are installed automatically.

## Managing environments

```matlab
mip env                   % show the active environment
mip env list              % list named environments (* marks the active one)
mip env delete myenv      % delete a named environment (asks for confirmation)
```

`mip env delete` works on named environments only and always asks before deleting (pass `--yes` to skip the prompt, e.g. in scripts). Local path environments are yours to manage — deleting the `.mip` directory is all it takes.

## Good to know

- **mip itself stays put.** Activating an environment never moves or reinstalls mip; environments don't need to contain it.
- **Environments are hand-managed.** What you install is what's there — there is no lockfile or spec file. A declarative, reproducible workflow on top of environments is planned separately ([MEP 9](https://github.com/mip-org/meps/blob/main/meps/mep-0009.md)).
- **Programs you launch inherit the environment.** `system(...)` calls and `matlab -batch` runs started from an activated session see the same environment.
- **Scripts and CI** don't need activation: setting the `MIP_ROOT` environment variable before starting MATLAB points mip at any root directly.
- **Multiple MATLAB sessions** can activate the same environment; each session keeps its own set of loaded packages.

## Trying it out

Until the feature ships in a release, you can preview it by installing the MEP 8 build of mip from the labs channel and loading it in place of your installed mip:

```matlab
mip install mip-org/labs/mip@mep-0008
mip load mip-org/labs/mip
```

From that point, `mip` commands in your session use the preview build, and everything described above is available. Your regular mip installation is untouched, and the preview stays active even across `mip activate` / `mip deactivate`. To go back to your released version:

```matlab
mip unload mip-org/labs/mip
```

Feedback is welcome on the [MEP 8 discussion](https://github.com/mip-org/meps/issues/8).
