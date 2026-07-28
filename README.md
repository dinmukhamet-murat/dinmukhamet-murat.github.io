# Dinmukhamet Murat — Industrial Editorial portfolio

Static React/Vite build prepared for:

`https://dinmukhamet-murat.github.io`

This package does not contain ChatGPT Sites, Cloudflare Worker, database, or
authentication files. It can be deployed as a static GitHub Pages site.

## Local check

Requirements: Node.js 22 or newer.

```bash
npm ci
npm run build
npm run preview
```

The production files are generated in `dist/`.

## Publish from your repository

1. Clone `dinmukhamet-murat/dinmukhamet-murat.github.io`.
2. Create and switch to your new branch.
3. Replace the old site files with every file from this package, including
   `.github`, `.gitignore`, and `.nojekyll`.
4. Run `npm ci` and `npm run build`.
5. Review `git diff`, then commit and push the branch yourself.
6. Merge the branch into `main` when you are ready to publish.
7. In repository **Settings → Pages**, set **Source** to **GitHub Actions**.

The included workflow publishes every push to `main`.

## Main files

- `src/App.tsx` — page content and interactions
- `src/styles.css` — Industrial Editorial design and responsive behavior
- `public/images` — portfolio media
- `public/Dinmukhamet_Murat_Resume.pdf` — downloadable CV
- `.github/workflows/deploy-pages.yml` — GitHub Pages deployment
