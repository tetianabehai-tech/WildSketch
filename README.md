# WildSketch

Responsive art workshop landing page built with HTML, CSS, JavaScript and Vite, using the GoIT vanilla-app-template structure and its HTML injection and reload plugins.

## Run locally

Requires Node.js 22.12+ and npm. On Windows use `npm.cmd` if PowerShell blocks `npm.ps1`.

```sh
npm install
npm run dev
```

## Project structure

- `src/index.html`: page entry and ordered partial includes.
- `src/partials`: Header, Hero, Benefits, Gallery, Events, Team, Feedbacks, Register, Footer, Mobile menu and modal.
- `src/css`: shared styles and section styles, bundled by Vite.
- `src/img`: responsive WebP images, SVG logos, original Figma favicon and icon sprite.
- `scripts`: HTML/CSS/resource validation and browser checks.
- `dist`: generated production build (ignored by Git).
- `qa`: local reports, screenshots and Figma exports (ignored by Git).

## Verification

```sh
npm run format:check
npm run validate
npm run build
npm test
```

Browser tests require installed Google Chrome. Tests cover 320, 375, 600, 767, 768, 1024, 1439, 1440 and 1920px, plus retina sources at 375/768/1440px and loading under `/WildSketch/`. The test command starts and stops its own production preview server. Screenshots and reports are saved in `qa/`.

The correct Figma file is `n9IyoxHkRQEIRHwdqlDPOf`, Design page: desktop `8202:63498`, tablet `8257:501`, mobile `8257:1476`. The layout, texts, UI states and brand assets were checked through the configured `figma` MCP server. See `REQUIREMENTS_STATUS.md` for results and the external CSS validator service limitation.

Registration follows the assignment: required name and email with patterns, an optional comment limited to 500 characters, and no event selector. It validates locally and opens a demonstration dialog; no backend is required by the MVP and no booking is sent.

## Publishing

The generated build supports a GitHub Pages subdirectory. Push and deployment require the user's explicit approval. No push or deployment is part of the verification commands above.
