# Requirements review - 2026-10-12

## Sources and structure

The GoIT spreadsheet was retrieved directly and reviewed, including its Code Guide link. The current export has 55 baseline checklist entries and two optional modal entries; the older context's count of 49 is outdated.

Figma was checked through the configured `figma` MCP server using `get_figma_data`: file `n9IyoxHkRQEIRHwdqlDPOf`, desktop `8202:63498`, tablet `8257:501`, mobile `8257:1476`, mobile menu `8258:3368`, UI Elements `8211:3541`, Logos `8211:3527`, Icons `8211:3576`. Reference images and SVGs were retrieved using the same server's `download_figma_images`. The Codex apps Figma connector was not used.

The page now uses `src/index.html`, `src/partials`, `src/css` and `src/img`. Vite is configured with `root: src`, HTML injection, partial reload, media query sorting and output to `dist`. All image references, favicon and sprite IDs are validated locally. Temporary exports, scripts and screenshots stay in ignored `qa/`; root-level export patterns are also ignored.

## Checked behavior

- Fixed mobile-first 375/768/1440px containers, shrinking below 375px.
- Header navigation from 768px; the mobile menu includes its own logo, Register link and close button, fills the viewport, traps focus, closes with Escape or a navigation link and clears background blocking on tablet resize.
- Hero has the original heading and description, correct anchor destinations, full-width stacked mobile buttons and a 601px tablet heading.
- Benefits has three semantic articles with SVG icons. Gallery has seven content images in a flex list.
- Events has five complete cards, map links, dates, anchor Register buttons and mobile borders. Retina source selection accounts for landscape images cropped to square thumbnails.
- Team has six original portraits with 1x/2x sources, names and roles, arranged in 1/2/6 columns. Tablet row spacing follows the mockup.
- Feedbacks has six original quotes and authors, 5/4/5/4/5/4 ratings, exact filled/outline SVG stars and 1/2/3 columns.
- Register has name, email and skills only, required/pattern validation, a 500-character skills limit and a submit button. Invalid submissions do not open the dialog. The optional demonstration dialog preserves values, traps and restores focus, blocks background interactions and closes by its buttons, Escape or backdrop.
- Footer uses the original SVG logo, navigation arrangement and copyright text. Favicon comes from Figma node `8258:68014`.

## Verification

`npm run format:check`, `npm run validate`, `npm run build` and `npm test` are the reproducible checks. Browser tests exercise nine widths; additional checks cover 375/768/1440px retina sources, all section/list counts, missing sprite symbols, invalid forms, field limits, menu resizing, dialog controls, and a static server mounted at `/WildSketch/`. The dev version is also checked at 375/768/1440px.

W3C Nu HTML validation returned no errors or warnings, only informational messages about Prettier's trailing slashes on void elements. W3C CSS validation returned HTTP 500 even for the minimal valid rule `body { color: red; }`; remote certification is unavailable. Local CSS parsing and property-value validation pass. CSS custom properties and vendor declarations are syntax-checked; var-dependent values are resolved and exercised by the browser tests.

Figma's desktop Team card heights are internally inconsistent with their visible text: several 233px cards contain 260px of image and text, and Lina's frame is only 161px. The implementation allows this content to fit naturally, adding 27px to the desktop section instead of clipping text. Other section dimensions are within normal browser font rounding of the reference frames. Map destinations are searches for the supplied venue names, since precise coordinates are not supplied.

No push or deploy was performed.
