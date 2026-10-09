import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
const page = await browser.newPage();
page.on("pageerror", (e) => errors.push(e.message));
page.on("response", (r) => {
  if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`);
});
await fs.mkdir("qa", { recursive: true });
for (const width of [375, 600, 768, 1024, 1440, 1920]) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(process.env.QA_URL || "http://127.0.0.1:5173/", {
    waitUntil: "networkidle",
  });
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const image of document.images) {
      image.loading = "eager";
    }
    await Promise.all(
      [...document.images].map((i) => i.decode().catch(() => {})),
    );
  });
  const state = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > innerWidth,
    broken: [...document.images]
      .filter((i) => !i.complete || !i.naturalWidth)
      .map((i) => i.src),
  }));
  if (state.overflow || state.broken.length)
    throw Error(`${width}: ${JSON.stringify(state)}`);
  if (width < 1440) {
    await page.locator(".menu-toggle").click();
    if (await page.locator(".mobile-menu").isHidden())
      throw Error("Menu failed to open");
    await page.keyboard.press("Escape");
    if (await page.locator(".mobile-menu").isVisible())
      throw Error("Escape failed");
    await page.locator(".menu-toggle").click();
    await page.locator('.mobile-menu a[href="#gallery"]').click();
    if (await page.locator(".mobile-menu").isVisible())
      throw Error("Menu link failed");
  }
  await page.locator("#name").fill("Test User");
  await page.locator("#email").fill("test@example.com");
  await page.locator("#event").selectOption("1");
  await page.locator(".register-form button").click();
  if ((await page.locator("#name").inputValue()) !== "Test User")
    throw Error("Form erased input");
  if (
    !(await page.locator(".form-status").innerText()).includes("not been sent")
  )
    throw Error("Misleading form status");
  await page.screenshot({ path: `qa/${width}.png`, fullPage: true });
  console.log(`PASS ${width}px: images, overflow, menu, form`);
}
await browser.close();
if (errors.length) throw Error(errors.join("\n"));
