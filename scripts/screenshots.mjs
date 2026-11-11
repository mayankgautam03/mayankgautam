/**
 * npm run shots
 * --------------
 * Reads every `url:` from src/data/projects.ts, opens it in a real browser and saves
 *   public/projects/<slug>.png         (desktop hero, 1440x900)
 *   public/projects/<slug>-mobile.png  (mobile hero, 390x844)
 * then prints the `image:` lines to paste into projects.ts.
 *
 * First time only:  npx playwright install chromium
 */
import { readFile, mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const src = await readFile(new URL("../src/data/projects.ts", import.meta.url), "utf8");
const blocks = [...src.matchAll(/title:\s*"([^"]+)",\s*\n\s*url:\s*"([^"]+)"/g)].map((m) => ({ title: m[1], url: m[2] }));
const only = process.argv[2]; // optional: npm run shots -- "Project Name"
const list = only ? blocks.filter((b) => b.title.toLowerCase().includes(only.toLowerCase())) : blocks;
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

await mkdir(new URL("../public/projects/", import.meta.url), { recursive: true });
const browser = await chromium.launch();

for (const { title, url } of list) {
  for (const [suffix, viewport, mobile] of [
    ["", { width: 1440, height: 900 }, false],
    ["-mobile", { width: 390, height: 844 }, true],
  ]) {
    const ctx = await browser.newContext({ viewport, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile });
    const page = await ctx.newPage();
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
      await page.waitForTimeout(2500); // let intro animations finish
      const file = `public/projects/${slug(title)}${suffix}.png`;
      await page.screenshot({ path: file });
      console.log("✓", file);
    } catch (e) {
      console.log("✗", title, suffix || "desktop", e.message.split("\n")[0]);
    }
    await ctx.close();
  }
  console.log(`   → add to "${title}":\n      image: "/projects/${slug(title)}.png",\n      mobileImage: "/projects/${slug(title)}-mobile.png",\n`);
}
await browser.close();
