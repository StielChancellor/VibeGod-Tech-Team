// SessionStart: establish the VibeGod Tech Team operating posture for the session.
// Also nudges (quietly, fail-open) when a newer plugin version is on GitHub — checked at most
// once per 24h via a tmpdir cache; skip entirely with VIBEGOD_NO_UPDATE_CHECK=1.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { readStdin, advise } from './_lib.mjs';

process.on('uncaughtException', () => process.exit(0));
process.on('unhandledRejection', () => process.exit(0));

await readStdin();

const mode = (process.env.VIBEGOD_GUARDRAILS || '').toLowerCase() === 'advisory' ? 'ADVISORY (warn only)' : 'ENFORCING (hard-block)';

// --- update nudge (best-effort; NEVER blocks or slows the session more than ~1.5s, once a day) ---
const RAW_MANIFEST = 'https://raw.githubusercontent.com/StielChancellor/VibeGod-Tech-Team/main/plugins/vibegod-tech-team/.claude-plugin/plugin.json';
const newer = (a, b) => { // true if b > a (semver-ish)
  const pa = String(a).split('.').map(Number), pb = String(b).split('.').map(Number);
  for (let i = 0; i < 3; i++) { if ((pb[i] || 0) > (pa[i] || 0)) return true; if ((pb[i] || 0) < (pa[i] || 0)) return false; }
  return false;
};
async function updateNudge() {
  if (process.env.VIBEGOD_NO_UPDATE_CHECK) return '';
  try {
    const local = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', '..', '.claude-plugin', 'plugin.json'), 'utf8')).version;
    const cacheFile = join(tmpdir(), 'vibegod-update-check.json');
    let latest = null;
    if (existsSync(cacheFile)) {
      const c = JSON.parse(readFileSync(cacheFile, 'utf8'));
      if (Date.now() - c.ts < 24 * 60 * 60 * 1000) latest = c.latest;
    }
    if (latest === null) {
      const res = await fetch(RAW_MANIFEST, { signal: AbortSignal.timeout(1500) });
      latest = res.ok ? (await res.json()).version : local;
      writeFileSync(cacheFile, JSON.stringify({ ts: Date.now(), latest }));
    }
    if (newer(local, latest)) return `\nUPDATE available: vibegod-tech-team v${latest} (you have v${local}) — run: claude plugin update vibegod-tech-team@vibegod`;
  } catch { /* offline, rate-limited, anything — stay silent */ }
  return '';
}
const nudge = await updateNudge();

advise('SessionStart',
  `VibeGod Tech Team is active — operate as a Google/Anthropic-grade engineering + product team led by the vibegod-orchestrator skill.\n` +
  `PRIME DIRECTIVE: never jump straight to code. Run the gated pipeline — Discover → PRD → Journey → Stack&Cost → ` +
  `Modules → Foundation-first Build → per-feature QA (parallel lenses: 4 core + UX/perf where applicable) → UAT/Smoke → Ship — and stop for the user at every ◆ gate. ` +
  `If VIBEGOD-STATE.md exists, read it and RESUME the recorded stage — don't restart the pipeline. ` +
  `Any change re-enters at PRD and propagates PRD → blueprint → roadmap → graphify → code.\n` +
  `Honor vibegod-principles: investigate-before-answering, simplicity/anti-overeagerness, surgical changes, general-correct ` +
  `solutions (don't code to the test), OWASP security, WCAG 2.2 AA, consistency/no-orphans, maker–checker (no agent checks ` +
  `its own work), and cost-awareness (always surface cheaper alternatives + tradeoffs).\n` +
  `Security guardrails: ${mode}. Use /kickoff to start a build, /change-request to change one, /doctor to health-check the toolchain.` +
  nudge);
