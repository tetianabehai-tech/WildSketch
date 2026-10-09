import { spawn } from "node:child_process";
import { chromium } from "@playwright/test";
const port = 4183;
const url = "http://127.0.0.1:" + port;
const server = spawn(
  process.execPath,
  [
    "node_modules/vite/bin/vite.js",
    "preview",
    "--host",
    "127.0.0.1",
    "--port",
    String(port),
    "--strictPort",
  ],
  { stdio: "ignore" },
);
let browser;
try {
  let ready = false;
  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        ready = true;
        break;
      }
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  if (!ready) throw Error("Preview server failed to start");
  process.env.QA_URL = url;
  await import("./check-browser.mjs");
  browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  await page.goto(url);
  const structure = await page.evaluate(() => ({
    headings: document.querySelectorAll("h1").length,
    sections: [
      "benefits",
      "gallery",
      "events",
      "team",
      "feedbacks",
      "register",
    ].every((id) => document.getElementById(id)),
    brokenAnchors: [...document.querySelectorAll('a[href^="#"]')].some(
      (a) => !document.querySelector(a.getAttribute("href")),
    ),
    team: document.querySelectorAll("#team .team-card").length,
    reviews: document.querySelectorAll("#feedbacks .feedback-card").length,
    stars: document.querySelectorAll("#feedbacks use").length,
    skillsLimit: document.querySelector("#skills").maxLength,
  }));
  if (
    structure.headings !== 1 ||
    !structure.sections ||
    structure.brokenAnchors ||
    structure.team !== 3 ||
    structure.reviews !== 3 ||
    structure.stars !== 15 ||
    structure.skillsLimit !== 500
  )
    throw Error(JSON.stringify(structure));
  for (const [name, email, valid] of [
    ["Emma", "emma@example.com", false],
    ["Emma Smith", "bad@email", false],
    ["Emma123", "emma@example.com", false],
    ["Emma Smith", "emma@example.com", true],
  ]) {
    await page.locator("#name").fill(name);
    await page.locator("#email").fill(email);
    await page.locator("#event").selectOption("1");
    if (
      (await page
        .locator("#register-form")
        .evaluate((f) => f.checkValidity())) !== valid
    )
      throw Error("Form validation mismatch");
  }
  await page.locator("#event").evaluate((e) => {
    e.value = "";
  });
  if (await page.locator("#register-form").evaluate((f) => f.checkValidity()))
    throw Error("Event is not required");
  for (let i = 0; i < 5; i++) {
    await page.locator(".event-register").nth(i).click();
    if ((await page.locator("#event").inputValue()) !== String(i + 1))
      throw Error("Incorrect selected event");
  }
  await page.setViewportSize({ width: 375, height: 900 });
  await page.locator(".menu-toggle").click();
  if (!(await page.locator("main").evaluate((e) => e.inert)))
    throw Error("Background remains interactive");
  if (
    (await page
      .locator(".mobile-menu")
      .evaluate((e) => e.getBoundingClientRect().height)) !== 900
  )
    throw Error("Menu does not fill viewport");
  await page.locator(".mobile-menu a").last().focus();
  await page.keyboard.press("Tab");
  if (
    !(await page
      .locator(".header-logo")
      .evaluate((e) => e === document.activeElement))
  )
    throw Error("Menu focus escaped");
  await page.keyboard.press("Escape");
  if (await page.locator("main").evaluate((e) => e.inert))
    throw Error("Background remains inert");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.locator("#team").screenshot({ path: "qa/team-desktop.png" });
  await page
    .locator("#feedbacks")
    .screenshot({ path: "qa/feedbacks-desktop.png" });
  console.log(
    "PASS production structure, validation, event selection, menu keyboard navigation",
  );
} finally {
  if (browser) await browser.close();
  server.kill();
}
