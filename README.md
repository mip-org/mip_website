# mip-org.github.io

Source for the mip website, a Vite + React + TypeScript single-page app.

## Local development

Requires Node 20+.

```bash
npm install
npm run dev      # start the dev server with hot reload
npm run build    # type-check and build to dist/
npm run preview  # serve the built dist/ locally
npm run lint     # run eslint
```

## Content

Most content is Markdown, rendered by the React app:

- Documentation articles: `src/docs/articles/` (registered in `index.ts`)
- Blog posts: `src/blog/posts/` (registered in `index.ts`)

Everything else (layout, pages, theming) is React under `src/`.

## Deployment

Deployment is automatic. Pushing to `main` triggers
`.github/workflows/deploy.yml`, which builds the site and publishes `dist/` to
GitHub Pages. The workflow can also be run manually from the Actions tab.

The build copies `dist/index.html` to `dist/404.html` so client-side routes
resolve on Pages, and copies `public/install.txt` to `install_mip.m` so the
one-line installer is downloadable.
