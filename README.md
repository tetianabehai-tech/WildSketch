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

Browser checks require installed Google Chrome. The test command starts its own preview server and checks the production build at nine viewport widths, image loading, overflow, menu, form patterns and section structure. Screenshots are saved in qa/.

## Included

Header, Hero, Benefits, Gallery, Events, Team, Feedbacks, Register, Footer and full-height mobile navigation. Layout uses Mobile First styles with tablet and desktop breakpoints at 768px and 1440px. Images use WebP variants and responsive source sets. Icons use an SVG sprite.

Team portraits, names, roles and the six testimonials come from the correct Figma Design page (file n9IyoxHkRQEIRHwdqlDPOf, desktop node 8202:63498). Registration includes name, email and skills only, as requested by the mentor. It validates locally and opens a preview explaining that no details were sent and no booking was made.

Layout measurements were retrieved directly from the Figma API for desktop, tablet and mobile. See FIGMA_MEASUREMENTS.md for frame IDs and measured sizes. Some Figma Team frames have inconsistent heights; text is allowed to fit naturally. Map links search the supplied venue names; precise locations were not provided.

## Publishing

Run `npm run deploy` only when ready to publish the contents of dist/ to the configured GitHub repository. See GITHUB_SETUP.md. This work does not automatically push or deploy the site.
