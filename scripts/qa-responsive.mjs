import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.QA_BASE_URL || "http://127.0.0.1:3100";
const routes = [
  "/",
  "/modelle-webcam/",
  "/modelle-hd/",
  "/nuove-modelle-webcam/",
  "/modelle-tattoo/",
  "/modelle-prosperose/",
  "/modelle-italiane/",
  "/diventare-webcam-model/",
  "/privacy-webcam-model/",
  "/attrezzatura-webcam-model/",
];
const viewports = [
  { width: 1440, height: 900 },
  { width: 1280, height: 800 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 430, height: 932 },
  { width: 390, height: 844 },
  { width: 360, height: 740 },
  { width: 932, height: 430 },
];

const outputDirectory = path.resolve(".next", "qa-responsive");
await mkdir(outputDirectory, { recursive: true });
const browser = await chromium.launch({ headless: true });
const failures = [];
const results = [];

for (const viewport of viewports) {
  for (const route of routes) {
    const page = await browser.newPage({ viewport });
    const consoleErrors = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    const response = await page.goto(new URL(route, baseUrl).toString(), { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(250);
    const checks = await page.evaluate(() => {
      const main = document.querySelector("main");
      const info = document.querySelector(".full-width-info");
      const grid = document.querySelector(".model-grid");
      const cards = document.querySelectorAll(".model-card.real").length;
      const columnCount = grid ? getComputedStyle(grid).gridTemplateColumns.split(" ").filter(Boolean).length : 0;
      const cardTops = [...document.querySelectorAll(".model-card.real")].slice(0, columnCount).map((card) => card.getBoundingClientRect().top);
      return {
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        h1: document.querySelectorAll("h1").length,
        header: Boolean(document.querySelector("header")),
        footer: Boolean(document.querySelector("footer")),
        textLength: document.body.innerText.trim().length,
        infoRatio: info && main ? info.getBoundingClientRect().width / main.getBoundingClientRect().width : null,
        gridTop: grid?.getBoundingClientRect().top ?? null,
        cards,
        cardsAligned: cardTops.length < 2 || Math.max(...cardTops) - Math.min(...cardTops) < 2,
        filterButtons: document.querySelectorAll(".category-panel-links button").length,
      };
    });
    const label = `${route} at ${viewport.width}x${viewport.height}`;
    if (response?.status() !== 200) failures.push(`${label}: HTTP ${response?.status()}`);
    if (checks.overflow > 1) failures.push(`${label}: horizontal overflow ${checks.overflow}px`);
    if (checks.h1 !== 1) failures.push(`${label}: expected one H1, found ${checks.h1}`);
    if (!checks.header || !checks.footer) failures.push(`${label}: header or footer missing`);
    if (checks.textLength < 200) failures.push(`${label}: page text appears incomplete`);
    if (checks.infoRatio !== null && checks.infoRatio < 0.9) failures.push(`${label}: information section uses only ${checks.infoRatio.toFixed(2)} of main width`);
    if (!checks.cardsAligned) failures.push(`${label}: first model row is not aligned`);
    if (consoleErrors.length) failures.push(`${label}: console errors: ${consoleErrors.join(" | ")}`);

    if (viewport.width <= 1120) {
      const menu = page.locator(".mobile-nav summary");
      if (!(await menu.isVisible())) failures.push(`${label}: mobile menu control is not visible`);
      else {
        await menu.click();
        if (!(await page.locator(".mobile-nav-panel").isVisible())) failures.push(`${label}: mobile menu did not open`);
      }
    }

    if ((route === "/privacy-webcam-model/" || route === "/attrezzatura-webcam-model/") && viewport.width === 390) {
      const checkbox = page.locator(".local-checklist input").first();
      await checkbox.check();
      const score = await page.locator(".checklist-score strong").innerText();
      if (score === "0%") failures.push(`${label}: checklist score did not update`);
    }

    if (["/", "/modelle-webcam/", "/privacy-webcam-model/", "/attrezzatura-webcam-model/"].includes(route) && [1440, 390].includes(viewport.width)) {
      const slug = route === "/" ? "home" : route.split("/").filter(Boolean)[0];
      await page.screenshot({ path: path.join(outputDirectory, `${slug}-${viewport.width}x${viewport.height}.png`), fullPage: true });
    }

    results.push({ route, viewport, ...checks });
    await page.close();
  }
}

await browser.close();
await writeFile(path.join(outputDirectory, "results.json"), JSON.stringify({ baseUrl, failures, results }, null, 2));

if (failures.length) {
  console.error(`Responsive QA failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Responsive QA passed for ${routes.length} routes across ${viewports.length} viewports`);
console.log(`Screenshots: ${outputDirectory}`);
