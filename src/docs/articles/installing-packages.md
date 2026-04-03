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

This adds the package (and its dependencies) to your path for the current session. To make a package load automatically in every session:

```matlab
mip load chebfun --sticky
```

To unload:

```matlab
mip unload chebfun
mip unload --all          % Unload all non-sticky packages
mip unload --all --force  % Unload everything, including sticky
```

## Listing and searching

```matlab
mip avail                 % List all available packages
mip list                  % List installed and loaded packages
mip info chebfun          % Show details about a package
```

## Using other channels

The default channel is `mip-org/core`, but packages can be hosted on any channel. To install from a different channel:

```matlab
mip install --channel youruser/mylab my_package
```

Here `youruser/mylab` refers to the GitHub repo `youruser/mip-mylab`. You can also use fully qualified package names:

```matlab
mip install youruser/mylab/my_package
mip load youruser/mylab/my_package
```

## Installing a specific version

If a package has multiple versions, you can install a specific one:

```matlab
mip install chebfun@1.0.0
```

## Other commands

```matlab
mip arch                  % Show your system's MEX architecture
mip version               % Show MIP version
mip help                  % Show help
mip help install          % Show help for a specific command
```
