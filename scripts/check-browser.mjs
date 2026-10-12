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
try {
  for (const width of [320, 375, 600, 767, 768, 1024, 1439, 1440, 1920]) {
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
    const layout = await page.evaluate(() => {
      const box = (selector) =>
        document.querySelector(selector).getBoundingClientRect();
      const columns = (selector) => {
        const cards = [...document.querySelectorAll(selector)];
        return cards.filter(
          (card) =>
            Math.abs(
              card.getBoundingClientRect().top -
                cards[0].getBoundingClientRect().top,
            ) < 1,
        ).length;
      };
      return {
        containers: [...document.querySelectorAll(".container")].map(
          (element) => element.getBoundingClientRect().width,
        ),
        header: box(".header-inner").height,
        logo: box(".header-logo img").width,
        teamColumns: columns(".team-card"),
        reviewColumns: columns(".feedback-card"),
        heroButtons: [
          ...document.querySelectorAll(".hero-actions .button"),
        ].map((element) => ({
          width: element.getBoundingClientRect().width,
          height: element.getBoundingClientRect().height,
        })),
        eventRadius: getComputedStyle(document.querySelector(".event-card"))
          .borderTopLeftRadius,
        formFields: [
          ...document.querySelectorAll(
            "#register-form input, #register-form textarea, #register-form select",
          ),
        ].map((element) => element.name),
      };
    });
    const containerWidth =
      width >= 1440 ? 1440 : width >= 768 ? 768 : Math.min(width, 375);
    const expectedTeamColumns = width >= 1440 ? 6 : width >= 768 ? 2 : 1;
    const expectedReviewColumns = width >= 1440 ? 3 : width >= 768 ? 2 : 1;
    if (
      layout.containers.some((value) => Math.abs(value - containerWidth) > 1) ||
      layout.header !== (width >= 768 ? 72 : 64) ||
      layout.logo !== 117 ||
      layout.teamColumns !== expectedTeamColumns ||
      layout.reviewColumns !== expectedReviewColumns ||
      layout.formFields.join(",") !== "name,email,skills" ||
      layout.heroButtons.some((button) => button.height !== 44) ||
      (width < 768 &&
        (layout.eventRadius !== "28px" ||
          layout.heroButtons.some(
            (button) => Math.abs(button.width - (containerWidth - 40)) > 1,
          )))
    ) {
      throw Error(
        width + ": Figma layout regression " + JSON.stringify(layout),
      );
    }
    if (
      width >= 768 &&
      (!(await page.locator(".site-nav").isVisible()) ||
        (await page.locator(".menu-toggle").isVisible()))
    )
      throw Error("Tablet/desktop navigation mismatch");
    if (width < 768) {
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
    await page.locator(".register-form button").click();
    if (
      !(await page
        .locator(".backdrop")
        .evaluate((e) => e.classList.contains("subscription-open")))
    )
      throw Error("Registration preview did not open");
    if (!(await page.locator("main").evaluate((element) => element.inert)))
      throw Error("Dialog background remains interactive");
    await page.locator(".modal-title").click();
    if (!(await page.locator("main").evaluate((element) => element.inert)))
      throw Error("Dialog click unlocked background");
    await page.locator(".modal .button").focus();
    await page.keyboard.press("Tab");
    if (
      !(await page
        .locator(".modal-close-icon")
        .evaluate((element) => element === document.activeElement))
    )
      throw Error("Dialog focus escaped");
    await page.keyboard.press("Shift+Tab");
    if (
      !(await page
        .locator(".modal .button")
        .evaluate((element) => element === document.activeElement))
    )
      throw Error("Dialog reverse focus escaped");
    await page.locator(".modal .button").click();
    if (
      await page
        .locator(".backdrop")
        .evaluate((e) => e.classList.contains("subscription-open"))
    )
      throw Error("Registration preview did not close");
    if (await page.locator("main").evaluate((element) => element.inert))
      throw Error("Dialog background remains inert");
    if (
      !(await page
        .locator(".register-form button")
        .evaluate((element) => element === document.activeElement))
    )
      throw Error("Dialog focus was not restored");
    if ((await page.locator("#name").inputValue()) !== "Test User")
      throw Error("Preview discarded input");
    await page.screenshot({
      path: `qa/${width}.png`,
      fullPage: true,
      animations: "disabled",
    });
    console.log(
      `PASS ${width}px: Figma layout, images, overflow, menu, form, dialog focus`,
    );
  }
} finally {
  await browser.close();
}
if (errors.length) throw Error(errors.join("\n"));
