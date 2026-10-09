import { chromium } from "@playwright/test";
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 375, height: 900 } });
await page.goto("http://127.0.0.1:5173/");
console.log(
  await page.evaluate(() =>
    [...document.querySelectorAll("body *")]
      .filter((e) => e.getBoundingClientRect().right > innerWidth)
      .map((e) => ({
        tag: e.tagName,
        cl: e.className,
        w: e.getBoundingClientRect().width,
      })),
  ),
);
await browser.close();
