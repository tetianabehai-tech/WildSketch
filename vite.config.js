import { defineConfig } from "vite";
import injectHTML from "vite-plugin-html-inject";
import FullReload from "vite-plugin-full-reload";
import SortCss from "postcss-sort-media-queries";
export default defineConfig({
  root: "src",
  base: "./",
  publicDir: "../public",
  build: { outDir: "../dist", emptyOutDir: true, sourcemap: true },
  plugins: [injectHTML(), FullReload(["./src/**/*.html"])],
  css: { postcss: { plugins: [SortCss({ sort: "mobile-first" })] } },
  server: { host: "127.0.0.1", port: 5173 },
  preview: { host: "127.0.0.1", port: 4173 },
});
