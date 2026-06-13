// Resolve a public-asset path against Vite's base URL, so files in public/
// load correctly whether the site is served from the domain root
// (https://dinmukhamet-murat.github.io/) or a sub-path (a project page).
// BASE_URL is '/' locally and on the user page; '/repo/' for a project page.
const BASE = import.meta.env.BASE_URL;
export const asset = (p) => BASE + String(p).replace(/^\//, '');
