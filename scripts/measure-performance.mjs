import { chromium } from "playwright";

const baseUrl = process.env.QA_BASE_URL || "http://127.0.0.1:3100";
const routes = ["/", "/modelle-webcam/", "/privacy-webcam-model/"];
const browser = await chromium.launch({ headless: true });
const results = [];

for (const route of routes) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.__qaMetrics = { cls: 0, lcp: 0 };
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) window.__qaMetrics.cls += entry.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      window.__qaMetrics.lcp = entries.at(-1)?.startTime || 0;
    }).observe({ type: "largest-contentful-paint", buffered: true });
  });
  await page.goto(new URL(route, baseUrl).toString(), { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType("navigation")[0];
    const resources = performance.getEntriesByType("resource");
    const scripts = resources.filter((entry) => entry.initiatorType === "script");
    const images = [...document.images];
    const largestImage = images
      .map((img) => ({ src: img.currentSrc || img.src, area: img.clientWidth * img.clientHeight, complete: img.complete, naturalWidth: img.naturalWidth }))
      .sort((a, b) => b.area - a.area)[0];
    return {
      ttfbMs: Math.round(navigation.responseStart - navigation.requestStart),
      htmlResponseMs: Math.round(navigation.responseEnd - navigation.requestStart),
      jsTransferBytes: scripts.reduce((sum, entry) => sum + entry.transferSize, 0),
      jsResources: scripts.length,
      cls: Number(window.__qaMetrics.cls.toFixed(4)),
      lcpMs: Math.round(window.__qaMetrics.lcp),
      imageCount: images.length,
      lazyImages: images.filter((img) => img.loading === "lazy").length,
      incompleteImages: images.filter((img) => !img.complete || img.naturalWidth === 0).length,
      largestImage: largestImage ? { area: largestImage.area, complete: largestImage.complete, naturalWidth: largestImage.naturalWidth } : null,
      fontStatus: document.fonts.status,
      fontResources: resources.filter((entry) => entry.initiatorType === "css" && /\.(?:woff2?|ttf|otf)(?:\?|$)/i.test(entry.name)).length,
      firstModelTop: Math.round(document.querySelector(".model-card.real")?.getBoundingClientRect().top ?? -1),
      h1: document.querySelector("h1")?.textContent?.trim() || "",
    };
  });
  const html = await (await fetch(new URL(route, baseUrl))).text();
  metrics.serverRenderedH1 = /<h1\b[^>]*>[\s\S]*?<\/h1>/i.test(html);
  metrics.serverRenderedEditorial = /full-width-info|guide-dashboard/.test(html);
  results.push({ route, ...metrics });
  await context.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
