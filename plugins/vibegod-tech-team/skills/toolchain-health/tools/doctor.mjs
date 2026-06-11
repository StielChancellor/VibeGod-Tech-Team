// VibeGod toolchain doctor — one-shot health check of every external tool the pipeline assumes.
// Run from the PROJECT directory:  node "<plugin>/skills/toolchain-health/tools/doctor.mjs"
// Zero dependencies, fail-graceful (a crashed probe reports ✗, never aborts the run).
// Exit codes: 0 = healthy (missing OPTIONAL tools don't fail) · 1 = a configured/required tool is BROKEN.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const cwd = process.cwd();
const results = [];
const add = (name, status, detail, fix = '') => results.push({ name, status, detail, fix });
// status: 'ok' | 'warn' (optional/absent) | 'fail' (configured-but-broken or required-and-missing)

function run(cmd, args, timeout = 15000) {
  try {
    const r = spawnSync(cmd, args, { encoding: 'utf8', timeout, shell: process.platform === 'win32' });
    return { ok: r.status === 0, out: ((r.stdout || '') + (r.stderr || '')).trim().split(/\r?\n/)[0] || '' };
  } catch (e) { return { ok: false, out: e.message }; }
}

// 1. Node — the hooks, visual-check, and this script all need >=18.
const major = parseInt(process.versions.node.split('.')[0], 10);
add('Node.js', major >= 18 ? 'ok' : 'fail', `v${process.versions.node}`,
  major >= 18 ? '' : 'Install Node 18+ (https://nodejs.org)');

// 2. git — required by the whole flow.
const git = run('git', ['--version']);
add('git', git.ok ? 'ok' : 'fail', git.out, git.ok ? '' : 'Install git (https://git-scm.com)');

// 3. Claude CLI — needed for plugin management (not for the session itself).
const claude = run('claude', ['--version']);
add('Claude CLI', claude.ok ? 'ok' : 'warn', claude.ok ? claude.out : 'not on PATH',
  claude.ok ? '' : 'npm install -g @anthropic-ai/claude-code (only needed to manage plugins)');

// 4. Playwright — REQUIRED for any UI work (the v0.8.0 render mandate). Resolve from the project.
let pw = null;
try { pw = (await import('node:module')).createRequire(join(cwd, 'package.json')).resolve('playwright'); } catch {}
add('Playwright', pw ? 'ok' : 'warn', pw ? 'resolvable from project' : 'not installed in this project',
  pw ? '' : 'npm i -D playwright && npx playwright install chromium (REQUIRED before any UI render/check)');

// 5. graphify — the resolution chain the codebase-knowledge-graph skill uses.
const marker = join(cwd, '.graphify-path');
if (existsSync(marker)) {
  const inv = readFileSync(marker, 'utf8').trim();
  const parts = inv.split(/\s+/);
  const probe = run(parts[0], [...parts.slice(1), '--version']);
  add('graphify (.graphify-path)', probe.ok ? 'ok' : 'fail',
    probe.ok ? `${inv} → ${probe.out}` : `marker says '${inv}' but it does not run`,
    probe.ok ? '' : 'Stale marker — re-run /graph to re-resolve (or delete .graphify-path)');
} else {
  const bare = run('graphify', ['--version']);
  const mod = bare.ok ? bare : run('python', ['-m', 'graphify', '--version']);
  add('graphify', mod.ok ? 'warn' : 'warn',
    mod.ok ? `${mod.out} installed but no .graphify-path yet — run /graph to persist it` : 'not installed (optional)',
    mod.ok ? 'Run /graph once in this project' : 'Optional — /graph offers to install it for impact analysis');
}

// 6. mermaid-cli — optional; diagrams render on GitHub regardless. --no-install: never hit the network.
const mmdc = run('npx', ['--no-install', '@mermaid-js/mermaid-cli', '--version'], 20000);
add('mermaid-cli', mmdc.ok ? 'ok' : 'warn', mmdc.ok ? mmdc.out : 'not cached locally',
  mmdc.ok ? '' : 'Optional — diagrams still render in GitHub/IDE; npx @mermaid-js/mermaid-cli to render locally');

// 7. Guardrails mode.
const mode = (process.env.VIBEGOD_GUARDRAILS || '').toLowerCase() === 'advisory' ? 'ADVISORY (warn only)' : 'ENFORCING';
add('Guardrails', 'ok', mode, '');

// Report.
const icon = { ok: '✓', warn: '–', fail: '✗' };
const w = Math.max(...results.map((r) => r.name.length));
console.log('VibeGod toolchain doctor\n');
for (const r of results) {
  console.log(`  ${icon[r.status]} ${r.name.padEnd(w)}  ${r.detail}`);
  if (r.fix && r.status !== 'ok') console.log(`    ${' '.repeat(w)}  FIX: ${r.fix}`);
}
const fails = results.filter((r) => r.status === 'fail');
console.log(`\n${fails.length ? '✗ ' + fails.length + ' broken' : '✓ healthy'} — ${results.filter((r) => r.status === 'ok').length} ok, ${results.filter((r) => r.status === 'warn').length} optional/absent, ${fails.length} broken`);
process.exit(fails.length ? 1 : 0);
