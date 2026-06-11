// Render-checks every fenced ```mermaid block shipped in the plugin's markdown, so a broken
// diagram (esp. the canonical C4 convention template) can't merge. Run: node ingest/check-mermaid.mjs
// Uses @mermaid-js/mermaid-cli via npx (chromium-backed — the same engine GitHub-adjacent tools use).
// Exit codes: 0 = all blocks render · 1 = a block fails to render · 2 = environment failure (npx/mmdc unavailable).
import { readFileSync, readdirSync, writeFileSync, mkdtempSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PLUGIN = join(ROOT, 'plugins', 'vibegod-tech-team');

function walkMd(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walkMd(p));
    else if (e.name.endsWith('.md')) out.push(p);
  }
  return out;
}

// Only LINE-START fences count — inline mentions like “(a ```mermaid``` block)” are prose, not diagrams.
const FENCE = /^```mermaid[ \t]*\r?\n([\s\S]*?)^```[ \t]*$/gm;
const blocks = [];
for (const file of walkMd(PLUGIN)) {
  const t = readFileSync(file, 'utf8');
  let m;
  while ((m = FENCE.exec(t))) blocks.push({ file: file.slice(PLUGIN.length + 1).replace(/\\/g, '/'), src: m[1] });
}
if (!blocks.length) { console.log('No fenced mermaid blocks found — nothing to check.'); process.exit(0); }
console.log(`Mermaid render check — ${blocks.length} fenced block(s):`);

const work = mkdtempSync(join(tmpdir(), 'vg-mermaid-'));
// Chromium in CI containers needs --no-sandbox; harmless locally.
const pptr = join(work, 'puppeteer.json');
writeFileSync(pptr, JSON.stringify({ args: ['--no-sandbox'] }));

let failed = 0;
blocks.forEach((b, i) => {
  const src = join(work, `block-${i}.mmd`);
  const out = join(work, `block-${i}.svg`);
  writeFileSync(src, b.src);
  const r = spawnSync('npx', ['-y', '@mermaid-js/mermaid-cli', '-i', src, '-o', out, '-p', pptr, '-q'],
    { encoding: 'utf8', shell: process.platform === 'win32', timeout: 180000 });
  if (r.error || r.status === null) {
    console.error(`  ✗ environment: could not run mermaid-cli (${r.error?.message || 'timeout'})`);
    process.exit(2);
  }
  if (r.status !== 0 || !existsSync(out)) {
    failed++;
    const detail = ((r.stderr || '') + (r.stdout || '')).split(/\r?\n/).filter(Boolean).slice(-4).join(' | ');
    console.error(`  ✗ ${b.file} block #${i + 1}: render FAILED — ${detail}`);
  } else {
    console.log(`  ✓ ${b.file} block #${i + 1} renders`);
  }
});

console.log(`${failed ? '✗' : '✓'} ${blocks.length - failed}/${blocks.length} mermaid blocks render`);
process.exit(failed ? 1 : 0);
