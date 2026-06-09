// VibeGod Tech Team — portable cross-breakpoint visual check (Playwright).
// Renders a URL at each breakpoint, screenshots it, and flags broken-UI signals
// (horizontal overflow, broken images, elements wider than the viewport, console/page errors).
//
// Usage:
//   node visual-check.mjs --url <url> [--out <dir>] [--breakpoints 320,375,768,1024,1280,1440,1920]
//                         [--full false] [--timeout 30000]
//
// Playwright is resolved from the CURRENT PROJECT (cwd), so install it where you run it:
//   npm i -D playwright   &&   npx playwright install chromium
//
// Exit codes: 0 = clean · 1 = broken-UI findings · 2 = usage/runtime error · 3 = playwright missing.
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { join, isAbsolute } from 'node:path';
import { mkdirSync, writeFileSync } from 'node:fs';

const DEFAULT_BREAKPOINTS = [320, 375, 768, 1024, 1280, 1440, 1920];

function parseArgs(argv) {
  const a = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) { a[argv[i].slice(2)] = argv[i + 1]?.startsWith('--') || argv[i + 1] === undefined ? true : argv[++i]; }
  }
  return a;
}

const args = parseArgs(process.argv.slice(2));
const url = args.url;
if (!url || url === true) {
  console.error('Usage: node visual-check.mjs --url <url> [--out dir] [--breakpoints 320,768,1280] [--full false]');
  process.exit(2);
}
const outDir = (() => {
  const o = typeof args.out === 'string' ? args.out : '.vibegod-visual-check';
  return isAbsolute(o) ? o : join(process.cwd(), o);
})();
const breakpoints = typeof args.breakpoints === 'string'
  ? args.breakpoints.split(',').map((n) => parseInt(n.trim(), 10)).filter(Boolean)
  : DEFAULT_BREAKPOINTS;
const fullPage = String(args.full ?? 'true') !== 'false';
// Guard against bare flags (`--timeout` with no value parses to boolean `true` → NaN).
const timeout = (typeof args.timeout === 'string' ? parseInt(args.timeout, 10) : NaN) || 30000;

// Resolve Playwright from the project being tested (cwd), not from the plugin dir.
let chromium;
try {
  const req = createRequire(pathToFileURL(join(process.cwd(), 'package.json')));
  ({ chromium } = req('playwright'));
} catch {
  console.error(
    'Playwright is not installed in this project.\n' +
    'Install it where you run the check:\n' +
    '  npm i -D playwright && npx playwright install chromium\n' +
    '(or `npm i -D @playwright/test`). Then re-run this command.'
  );
  process.exit(3);
}

// In-page checks: returns broken-UI signals for the current viewport.
const PAGE_CHECKS = () => {
  const vw = window.innerWidth;
  const doc = document.documentElement;
  const overflow = Math.max(doc.scrollWidth, document.body ? document.body.scrollWidth : 0) - vw;
  const wideEls = [];
  for (const el of Array.from(document.querySelectorAll('body *'))) {
    const r = el.getBoundingClientRect();
    if (r.width > vw + 2 || r.right > vw + 2 || r.left < -2) {
      wideEls.push({ tag: el.tagName.toLowerCase(), cls: (el.className && String(el.className).slice(0, 40)) || '', w: Math.round(r.width), right: Math.round(r.right) });
      if (wideEls.length >= 10) break;
    }
  }
  const brokenImgs = Array.from(document.images)
    .filter((im) => im.currentSrc && im.complete && im.naturalWidth === 0)
    .map((im) => im.currentSrc).slice(0, 10);
  return { vw, horizontalOverflowPx: Math.max(0, Math.round(overflow)), elementsWiderThanViewport: wideEls, brokenImages: brokenImgs };
};

(async () => {
  mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const report = { url, generatedAt: null, breakpoints: [], summary: { brokenBreakpoints: 0, totalFindings: 0 } };
  let findings = 0;

  for (const width of breakpoints) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    const consoleErrors = [];
    page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 200)); });
    page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + (e.message || String(e)).slice(0, 200)));

    const entry = { width };
    try {
      await page.goto(url, { waitUntil: 'load', timeout });
      await page.waitForTimeout(500);
      const checks = await page.evaluate(PAGE_CHECKS);
      const shot = join(outDir, `viewport-${width}.png`);
      await page.screenshot({ path: shot, fullPage });
      const issues = [];
      if (checks.horizontalOverflowPx > 2) issues.push(`horizontal overflow ${checks.horizontalOverflowPx}px`);
      if (checks.elementsWiderThanViewport.length) issues.push(`${checks.elementsWiderThanViewport.length} element(s) wider than viewport`);
      if (checks.brokenImages.length) issues.push(`${checks.brokenImages.length} broken image(s)`);
      if (consoleErrors.length) issues.push(`${consoleErrors.length} console/page error(s)`);
      entry.screenshot = shot;
      entry.checks = checks;
      entry.consoleErrors = consoleErrors;
      entry.issues = issues;
      entry.ok = issues.length === 0;
      if (!entry.ok) { findings += issues.length; report.summary.brokenBreakpoints++; }
      console.log(`${entry.ok ? 'OK ' : 'XX '} ${width}px${entry.ok ? '' : ' — ' + issues.join('; ')}`);
    } catch (e) {
      entry.ok = false;
      entry.error = (e.message || String(e)).slice(0, 300);
      findings++;
      report.summary.brokenBreakpoints++;
      console.log(`XX ${width}px — render error: ${entry.error}`);
    } finally {
      await context.close();
    }
    report.breakpoints.push(entry);
  }

  await browser.close();
  report.summary.totalFindings = findings;
  const reportPath = join(outDir, 'report.json');
  writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  console.log(`\nReport: ${reportPath}  ·  screenshots in ${outDir}`);
  console.log(`${report.summary.brokenBreakpoints ? '✗' : '✓'} ${breakpoints.length} breakpoints, ${report.summary.brokenBreakpoints} with issues, ${findings} findings`);
  process.exit(report.summary.brokenBreakpoints ? 1 : 0);
})().catch((e) => { console.error('visual-check failed:', e?.message || e); process.exit(2); });
