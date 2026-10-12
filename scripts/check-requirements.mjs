import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import http from "node:http";
import sharp from "sharp";

export async function checkRequirements(browser, url) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  try {
    await page.goto(url, { waitUntil: "networkidle" });
    const structure = await page.evaluate(() => {
      const $ = (selector) => document.querySelector(selector);
      return {
        order: [...document.querySelector("main").children].map(
          (e) => e.id || e.className,
        ),
        benefits: document.querySelectorAll(".benefits-list > li article")
          .length,
        gallery: document.querySelectorAll(".gallery-list > li img").length,
        events: document.querySelectorAll(".event-list > li article").length,
        galleryFlex: getComputedStyle($(".gallery-list")).display,
        eventsFlex: getComputedStyle($(".event-list")).display,
        eventCards: [...document.querySelectorAll(".event-card")].every(
          (e) =>
            e.querySelector("img[alt]") &&
            e.querySelector("h3") &&
            e.querySelector("time[datetime]") &&
            e.querySelector(
              '.event-meta a[href^="https://www.google.com/maps/"]',
            ) &&
            e.querySelector('a[href="#register"]'),
        ),
        reviews: [...document.querySelectorAll(".feedback-card")].map((e) => ({
          author: e.querySelector("footer").textContent.trim(),
          stars: e.querySelector(".rating").getAttribute("aria-label"),
          empty: e.querySelectorAll('use[href$="#icon-star-outline"]').length,
        })),
        fields: [...document.querySelectorAll("#register-form input")].every(
          (e) => e.required && e.pattern && e.labels.length,
        ),
        submit: $("#register-form button").type,
        normalize: getComputedStyle(document.body).margin,
      };
    });
    assert.deepEqual(structure.order, [
      "hero",
      "benefits",
      "gallery",
      "events",
      "team",
      "feedbacks",
      "register",
    ]);
    assert.equal(structure.benefits, 3);
    assert.equal(structure.gallery, 7);
    assert.equal(structure.events, 5);
    assert.equal(structure.galleryFlex, "flex");
    assert.equal(structure.eventsFlex, "flex");
    assert.ok(structure.eventCards && structure.fields);
    assert.equal(structure.submit, "submit");
    assert.equal(structure.normalize, "0px");
    assert.deepEqual(
      structure.reviews.map((r) => r.author),
      [
        "Julia Nguyen",
        "Mark Leblanc",
        "Sofia Mendes",
        "Daniel Ortiz",
        "Anika Shah",
        "Thomas Becker",
      ],
    );
    assert.deepEqual(
      structure.reviews.map((r) => r.stars),
      [5, 4, 5, 4, 5, 4].map((n) => `${n} out of 5 stars`),
    );
    assert.deepEqual(
      structure.reviews.map((r) => r.empty),
      [0, 1, 0, 1, 0, 1],
    );
    const sprite = await fs.readFile("src/img/sprite.svg", "utf8");
    for (const href of await page
      .locator("svg use")
      .evaluateAll((elements) => elements.map((e) => e.getAttribute("href"))))
      assert.ok(
        sprite.includes(`id="${href.split("#")[1]}"`),
        "Missing sprite symbol " + href,
      );
    await page.locator("#register-form button").click();
    assert.ok(
      !(await page
        .locator(".backdrop")
        .evaluate((e) => e.classList.contains("subscription-open"))),
      "Empty form opened modal",
    );
    await page.locator("#name").fill("Emma Smith");
    await page.locator("#email").fill("bad@email");
    await page.locator("#register-form button").click();
    assert.ok(
      !(await page
        .locator(".backdrop")
        .evaluate((e) => e.classList.contains("subscription-open"))),
      "Invalid email opened modal",
    );
    await page.locator("#skills").fill("x".repeat(510));
    assert.equal((await page.locator("#skills").inputValue()).length, 500);
    await page.locator("#email").fill("emma@example.com");
    await page.locator("#register-form button").click();
    await page.keyboard.press("Escape");
    assert.ok(
      !(await page
        .locator(".backdrop")
        .evaluate((e) => e.classList.contains("subscription-open"))),
      "Escape did not close modal",
    );
    await page.locator("#register-form button").click();
    await page.locator(".modal-close-icon").click();
    assert.ok(
      !(await page
        .locator(".backdrop")
        .evaluate((e) => e.classList.contains("subscription-open"))),
      "Close icon did not close modal",
    );
    await page.locator("#register-form button").click();
    await page.locator(".backdrop").click({ position: { x: 5, y: 5 } });
    assert.ok(
      !(await page
        .locator(".backdrop")
        .evaluate((e) => e.classList.contains("subscription-open"))),
      "Backdrop did not close modal",
    );
    await page.setViewportSize({ width: 375, height: 900 });
    await page.locator(".menu-toggle").click();
    assert.ok(await page.locator(".mobile-menu .header-logo").isVisible());
    assert.ok(
      await page.locator('.mobile-menu a[href="#register"]').isVisible(),
    );
    await page.locator(".menu-close").click();
    assert.ok(await page.locator(".mobile-menu").isHidden());
    await page.locator(".menu-toggle").click();
    await page.setViewportSize({ width: 768, height: 900 });
    assert.ok(await page.locator(".mobile-menu").isHidden());
    assert.ok(!(await page.locator("main").evaluate((e) => e.inert)));
    const sections = [];
    for (const width of [375, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(url, { waitUntil: "networkidle" });
      await page.evaluate(async () => {
        await document.fonts.ready;
        for (const img of document.images) img.loading = "eager";
        await Promise.all(
          [...document.images].map((i) => i.decode().catch(() => {})),
        );
      });
      const dimensions = await page
        .locator("main > section")
        .evaluateAll((elements) =>
          elements.map((e) => ({
            section: e.id || e.className,
            height: e.getBoundingClientRect().height,
          })),
        );
      sections.push({ width, dimensions });
      for (const selector of [
        ".site-header",
        ".hero",
        "#events",
        "#team",
        "#feedbacks",
        "#register",
        ".site-footer",
      ])
        await page.locator(selector).screenshot({
          path: `qa/${width}-${selector.replace(/[.#]/g, "")}.png`,
          animations: "disabled",
        });
      if (width === 768)
        assert.equal(
          await page
            .locator(".hero-copy h1")
            .evaluate((e) => e.getBoundingClientRect().width),
          601,
        );
      const footer = await page.locator(".footer-inner").evaluate((e) => ({
        padding: getComputedStyle(e).paddingTop,
        logoWidth: e.querySelector("img").getBoundingClientRect().width,
        navDirection: getComputedStyle(e.querySelector(".nav-list"))
          .flexDirection,
      }));
      assert.equal(footer.padding, "80px");
      assert.equal(footer.logoWidth, 268);
      assert.equal(footer.navDirection, width < 768 ? "column" : "row");
    }
    await fs.writeFile(
      "qa/section-dimensions.json",
      JSON.stringify(sections, null, 2),
    );
    console.log(
      "PASS GoIT section structure, SVG symbols, review ratings, invalid submissions, form limits, menu resize and modal closing",
    );
  } finally {
    await page.close();
  }

  const retina = await browser.newContext({ deviceScaleFactor: 2 });
  try {
    const page = await retina.newPage();
    for (const width of [375, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(url, { waitUntil: "networkidle" });
      const images = await page.evaluate(async () => {
        for (const img of document.images) img.loading = "eager";
        await Promise.all(
          [...document.images].map((i) => i.decode().catch(() => {})),
        );
        return [...document.images]
          .filter((i) => /\.webp/.test(i.currentSrc) && !i.closest(".backdrop"))
          .map((i) => ({
            src: i.currentSrc,
            width: i.getBoundingClientRect().width,
            height: i.getBoundingClientRect().height,
            fit: getComputedStyle(i).objectFit,
          }));
      });
      for (const image of images) {
        const response = await page.request.get(image.src);
        assert.ok(response.ok());
        const metadata = await sharp(await response.body()).metadata();
        const ratio =
          image.fit === "contain"
            ? Math.min(
                image.width / metadata.width,
                image.height / metadata.height,
              )
            : Math.max(
                image.width / metadata.width,
                image.height / metadata.height,
              );
        assert.ok(
          ratio <= 0.501,
          `${width}px retina source too small: ${image.src} ${metadata.width}x${metadata.height} for ${image.width}x${image.height}`,
        );
      }
      console.log(`PASS ${width}px retina images at deviceScaleFactor=2`);
    }
  } finally {
    await retina.close();
  }

  const root = path.resolve("dist");
  const server = http.createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
      if (!pathname.startsWith("/WildSketch/")) {
        res.writeHead(404).end();
        return;
      }
      const file = path.resolve(
        root,
        pathname.slice("/WildSketch/".length) || "index.html",
      );
      if (!file.startsWith(root + path.sep)) {
        res.writeHead(403).end();
        return;
      }
      const types = {
        ".html": "text/html",
        ".js": "text/javascript",
        ".css": "text/css",
        ".svg": "image/svg+xml",
        ".webp": "image/webp",
      };
      res.setHeader(
        "Content-Type",
        types[path.extname(file)] || "application/octet-stream",
      );
      res.end(await fs.readFile(file));
    } catch {
      res.writeHead(404).end();
    }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const hostedPage = await browser.newPage();
  const failures = [];
  hostedPage.on("pageerror", (error) => failures.push(error.message));
  hostedPage.on("response", (response) => {
    if (
      response.url().startsWith("http://127.0.0.1:") &&
      response.status() >= 400
    )
      failures.push(response.url());
  });
  try {
    await hostedPage.goto(
      `http://127.0.0.1:${server.address().port}/WildSketch/`,
      {
        waitUntil: "networkidle",
      },
    );
    await hostedPage.evaluate(async () => {
      for (const img of document.images) img.loading = "eager";
      await Promise.all(
        [...document.images].map((i) => i.decode().catch(() => {})),
      );
    });
    assert.deepEqual(failures, []);
    assert.equal(await hostedPage.locator("h1").count(), 1);
    assert.equal(await hostedPage.locator(".feedback-card").count(), 6);
    assert.ok(
      await hostedPage
        .locator("img")
        .evaluateAll((images) => images.every((i) => i.naturalWidth > 0)),
    );
    console.log(
      "PASS GitHub Pages /WildSketch/ subdirectory: scripts, CSS, SVG and responsive images",
    );
  } finally {
    await hostedPage.close();
    await new Promise((resolve) => server.close(resolve));
  }
}
