# Requirements review - 2026-10-12

Figma source: Design page, file n9IyoxHkRQEIRHwdqlDPOf; desktop 8202:63498, tablet 8257:501, mobile 8257:1476. Parameters were read directly through the Figma API. See FIGMA_MEASUREMENTS.md.

Implemented: fixed 375/768/1440px containers with shrinking below 375px; tablet navigation; full-height keyboard-accessible mobile menu; vertical full-width mobile Hero buttons; bordered mobile Event cards with 28px radius; six Team portraits/names/roles; six original testimonials; measured footer dimensions. Registration has name, email and skills only, with no backend. Its dialog explains that no data was sent, preserves entered values, traps focus, makes the background inert and restores focus on close.

Verification: npm run format:check, npm run validate, npm run build, npm test. Browser tests cover 320, 375, 600, 767, 768, 1024, 1439, 1440 and 1920px, checking fixed containers, column counts, header mode, mobile Hero buttons, card radius, image loading, overflow, form validation and menu/dialog keyboard behavior.

Remaining scope: the current project uses a root index.html and src/styles.css; migration to the official GoIT src/partials, src/css and src/img structure has not been performed. W3C Nu HTML validation returned no errors or warnings (34 informational messages about void-element trailing slashes). W3C CSS validation was attempted twice but returned HTTP 500/520. The GoIT spreadsheet could not be retrieved, so all 49 requirements are not certified. The configured figma MCP server timed out during startup; this review used the existing local measurements and assets, without a fresh MCP comparison. Map destinations are venue-name searches. Figma has internally inconsistent Team heights; CSS allows visible text to fit naturally. Exact pixel matching of every element is not certified.

No push or deploy was performed.
