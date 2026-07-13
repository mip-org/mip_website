---
title: For Developers
slug: for-developers
summary: How mip is built — the repositories, the behavior spec, the build engine, and the proposal process.
order: 7
---

This section is for people who want to work on mip itself rather than just use it — fixing the package manager, extending the build system, or proposing a change. mip is developed in the open across a few repositories in the [mip-org](https://github.com/mip-org) organization.

## The repositories

| Repository | What it is |
|---|---|
| [mip](https://github.com/mip-org/mip) | The package manager — the MATLAB CLI you run as `mip ...`. |
| [mip_channel_tools](https://github.com/mip-org/mip_channel_tools) | The shared build engine every channel uses to build, test, and publish packages. |
| [mip-core](https://github.com/mip-org/mip-core) | The default `mip-org/core` channel — the package recipes published to everyone. |
| [mip-staging](https://github.com/mip-org/mip-staging) | The `mip-org/staging` channel — packages being prepared to move into core. |
| [mip-labs](https://github.com/mip-org/mip-labs) | The `mip-org/labs` channel — experimental and in-house packages not necessarily destined for core. |
| [meps](https://github.com/mip-org/meps) | Mip Enhancement Proposals — design docs for substantial changes. |

## The package manager

mip is written in MATLAB. Every command dispatches from `mip.m` into the `+mip/` package namespace, which is organized by concern (`+install`, `+load`, `+resolve`, `+channel`, `+state`, and so on).

The authoritative reference for how each command behaves — including edge cases — is the [behavior specification](https://github.com/mip-org/mip/blob/main/docs/specification.md). Every rule it states is backed by a unit test, so the spec and the test suite are meant to stay in lockstep: change one, change the other.

Tests use MATLAB's `matlab.unittest` framework and run from the repo root:

```matlab
addpath('tests'); addpath('tests/helpers');
results = run_tests();
```

## The build engine

[mip_channel_tools](https://github.com/mip-org/mip_channel_tools) holds the reusable GitHub Actions workflows, the `mip-channel` Python CLI, and the MATLAB build scripts. A channel repo contains only its own `packages/` plus thin caller workflows that delegate here, so every channel shares one centrally maintained pipeline for preparing source, compiling, bundling, testing, and publishing.

[Hosting a Channel](/docs/hosting-a-channel) covers this from the channel author's side; the [README](https://github.com/mip-org/mip_channel_tools) documents the engine itself.

## Proposing a change

Most changes don't need a formal process — open an issue or a pull request on the relevant repo. Substantial changes — new commands, or behavior that affects many packages — go through a **MEP** (Mip Enhancement Proposal): a short design doc that is discussed and refined before any code is written.

Float the idea in an issue first, then copy the template and open a pull request against [meps](https://github.com/mip-org/meps). See [MEP 1](https://github.com/mip-org/meps/blob/main/meps/mep-0001.md) for the full process.
