# WildSketch

Responsive one-page art workshop website built with HTML, CSS, JavaScript and Vite.

## Run locally

Requires Node.js 22.12+ (verified with Node.js 24.20.0).

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. On Windows, ensure C:\Program Files\nodejs is on PATH.

## Production and checks

```sh
npm run format:check
npm run validate
npm run build
npm test
npm run preview
```

Browser checks require installed Google Chrome. The test command starts its own preview server and checks the production build at six viewport widths, image loading, overflow, menu, form patterns, event selection and section structure. Screenshots are saved in qa/.

## Included

Header, Hero, Benefits, Gallery, Events, Team, Feedbacks, Register, Footer and full-height mobile navigation. Layout uses Mobile First styles with tablet and desktop breakpoints at 768px and 1440px. Images use WebP variants and responsive source sets. Icons use an SVG sprite.

Team cards and testimonials contain visibly labelled demonstration content because source photos, names and reviews were not included in the provided Design 2 exports. Registration validates input and selects the workshop from event links. It has no server integration and explicitly reports that details have not been sent; no successful registration is simulated.

The desktop export and written requirements guided implementation. Exact tablet/mobile and UI Kit matching is not certified. Map links search the supplied venue names; precise locations were not provided.

## Publishing

Run `npm run deploy` only when ready to publish the contents of dist/ to the configured GitHub repository. See GITHUB_SETUP.md. This work does not automatically push or deploy the site.
