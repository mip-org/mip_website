---
title: Installing mip
slug: installing-mip
summary: Get the mip package manager set up in MATLAB.
order: 0
---

mip runs entirely inside MATLAB — no external tools required. It works on Linux, macOS, and Windows.

Run this in the MATLAB Command Window:

```matlab
eval(webread('https://mip.sh/install.txt'))
```

The install script asks where to install mip (default: `<userpath>/mip`), downloads the latest release, and saves the `mip` command to your MATLAB path for future sessions.

Alternatively, [download install_mip.m](/install_mip.m) — the same script — and run it from the folder where you saved it:

```matlab
install_mip
```

Once installed, `mip help` lists the available commands. To update mip itself later, run `mip update mip`.
