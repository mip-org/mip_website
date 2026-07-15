---
title: Installing from a URL
slug: installing-from-a-url
summary: Install packages straight from a zip URL or a MATLAB File Exchange page.
order: 9
section: coming-soon
---

> **Coming soon.** URL installs in this form are not yet available in the released version of mip — they are planned for the next release. The design is tracked in [mip#338](https://github.com/mip-org/mip/issues/338).

A lot of MATLAB code isn't published in any mip channel, but is available on the [File Exchange](https://www.mathworks.com/matlabcentral/fileexchange/) or as a zip archive on GitHub or elsewhere. You can install it by passing the URL directly to `mip install`:

```matlab
mip install https://www.mathworks.com/matlabcentral/fileexchange/23629-export_fig
```

mip suggests a package name derived from the URL and asks you to confirm or override it:

```
Package name [export_fig]:
```

Press Enter to accept the suggestion, or type a different name. To skip the prompt, pass the name up front:

```matlab
mip install https://www.mathworks.com/matlabcentral/fileexchange/23629-export_fig --name export_fig
```

Either way, mip downloads and extracts the archive, generates a `mip.yaml` via `mip init` if one isn't included, and installs it into mip's package store under the chosen name — the name you'll pass to `mip load`.

## What URLs work

- **File Exchange pages** — copy the landing page URL from your browser; mip resolves it to the underlying zip download. This works for entries distributed as zip files; MATLAB Toolbox (`.mltbx`) entries are not supported.
- **Zip archives** — any `https://` URL whose path ends in `.zip`, such as a GitHub source archive:

```matlab
mip install https://github.com/someone/repo/archive/refs/heads/main.zip
```

Plain `http://` URLs are refused — the download must use `https://`.

## The suggested name

The default offered at the prompt comes from the URL:

- File Exchange: the name in the page URL — `.../23629-export_fig` suggests `export_fig`.
- GitHub archives: the repository name.
- Other zip URLs: the archive's file name.

## Good to know

- Archives installed this way usually don't include a `mip.yaml`, so mip makes a best guess at which subdirectories to add to the MATLAB path on load. Tweak the generated `mip.yaml` (or use `--addpath` / `--rmpath` on `mip load`) if the defaults aren't quite right.
- URL-installed packages can't be updated automatically — `mip update` skips them, since the original archive is not preserved. To pull a newer version, run the same `mip install <url>` again (uninstalling first if needed).
- In non-interactive settings (scripts, `matlab -batch`), pass `--name`, or set the `MIP_CONFIRM=y` environment variable to accept the suggested name.
