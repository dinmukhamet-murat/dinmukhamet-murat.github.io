# Dinmukhamet Murat — portfolio

Static React/Vite version of the portfolio prepared for:

`https://dinmukhamet-murat.github.io`

## Local preview

Requirements: Node.js 22 or newer.

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite.

## Production check

```bash
npm run build
npm run preview
```

The production files are generated in `dist/`.

## Put this version in your repository

1. Clone `dinmukhamet-murat/dinmukhamet-murat.github.io`.
2. Create and switch to your new branch.
3. Remove the old site files that this package replaces.
4. Copy every file from this package into the repository root, including
   `.github`, `.gitignore`, and `.nojekyll`.
5. Run `npm ci` and `npm run build`.
6. Review the changes, commit them, and push your branch.
7. Merge the branch into `main` when you are satisfied.

The included workflow publishes every push to `main`. In the repository
settings, GitHub Pages should use **GitHub Actions** as its source.

## Main content files

- `src/App.tsx` — content and interactions
- `src/styles.css` — layout, visual design, responsive styles, and animations
- `public/images` — portfolio imagery
- `public/Dinmukhamet_Murat_Resume.pdf` — downloadable CV
