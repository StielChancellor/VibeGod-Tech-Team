// Self-validation for the god-mode-sde plugin. Run: node ingest/validate.mjs
// Checks: manifests parse; every SKILL.md/agent/command has required frontmatter;
// every agent binds <=2 skills that EXIST; every ${CLAUDE_PLUGIN_ROOT}/<file> ref resolves.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PLUGIN = join(ROOT, 'plugins', 'god-mode-sde');
let errors = 0, warns = 0;
const err = (m) => { console.error('  ✗ ' + m); errors++; };
const warn = (m) => { console.warn('  ! ' + m); warns++; };

// Reject unquoted scalar values a real YAML parser would choke on. The killer case:
// an unquoted value containing ": " (colon-space) is read as a nested mapping ->
// "Unexpected token" -> the ENTIRE frontmatter is silently dropped (no description,
// no allowed-tools, etc.). Also catches " #" (inline comment) and leading indicators.
function yamlUnsafe(value) {
  if (!value || /^["']/.test(value)) return null; // empty or already quoted -> safe
  if (value.includes(': ') || value.endsWith(':')) return "contains ': ' (colon-space)";
  if (/\s#/.test(value)) return "contains ' #' (inline comment)";
  if (/^[!&*?|>@`%[\]{},]/.test(value)) return 'starts with a YAML indicator char';
  return null;
}

function frontmatter(file) {
  const t = readFileSync(file, 'utf8');
  const m = t.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const mm = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!mm) continue;
    const key = mm[1], value = mm[2].trim();
    fm[key] = value;
    const why = yamlUnsafe(value);
    if (why) err(`${file.slice(ROOT.length + 1)}: frontmatter '${key}' must be quoted — ${why}; a YAML parser would drop the whole block.`);
  }
  return fm;
}

console.log('Manifests:');
for (const f of ['.claude-plugin/marketplace.json', 'plugins/god-mode-sde/.claude-plugin/plugin.json']) {
  let parsed;
  try { parsed = JSON.parse(readFileSync(join(ROOT, f), 'utf8')); console.log('  ✓ ' + f); }
  catch (e) { err(`${f}: ${e.message}`); continue; }
  // Duplicate-hooks guard: hooks/hooks.json auto-loads by convention. If the manifest ALSO
  // references it, Claude Code REFUSES to load the plugin ("Duplicate hooks file detected:
  // ... The standard hooks/hooks.json is loaded automatically, so manifest.hooks should only
  // reference additional hook files."). `claude plugin validate` does NOT catch this — only a
  // real load (`claude plugin list`) does — so we guard it here.
  if (f.endsWith('plugin.json') && typeof parsed.hooks === 'string') {
    const norm = parsed.hooks.replace(/^\.\//, '');
    if (norm === 'hooks/hooks.json' && existsSync(join(PLUGIN, 'hooks', 'hooks.json'))) {
      err(`${f}: manifest.hooks references the auto-loaded hooks/hooks.json — this triggers a "Duplicate hooks file detected" load failure. Remove the field; the convention loads it. Reserve manifest.hooks for ADDITIONAL hook files only.`);
    }
  }
}

console.log('Skills:');
const skillsDir = join(PLUGIN, 'skills');
const skillNames = new Set();
for (const name of readdirSync(skillsDir)) {
  const dir = join(skillsDir, name);
  if (!statSync(dir).isDirectory() || name === '_shared') continue;
  const sk = join(dir, 'SKILL.md');
  if (!existsSync(sk)) { err(`skill ${name}: missing SKILL.md`); continue; }
  const fm = frontmatter(sk);
  if (!fm) { err(`skill ${name}: no frontmatter`); continue; }
  if (!fm.description) err(`skill ${name}: missing description`);
  if (fm.description && fm.description.length < 30) warn(`skill ${name}: thin description`);
  skillNames.add(name);
}
console.log(`  -> ${skillNames.size} skills`);

console.log('Agents:');
const agentsDir = join(PLUGIN, 'agents');
let agentCount = 0;
if (existsSync(agentsDir)) for (const f of readdirSync(agentsDir)) {
  if (!f.endsWith('.md')) continue;
  const fm = frontmatter(join(agentsDir, f));
  if (!fm) { err(`agents/${f}: no frontmatter`); continue; }
  for (const r of ['description', 'model']) if (!fm[r]) err(`agents/${f}: missing ${r}`);
  const bound = (fm.skills || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (bound.length > 2) err(`agents/${f}: binds ${bound.length} skills (max 2)`);
  for (const s of bound) if (!skillNames.has(s)) err(`agents/${f}: bound skill '${s}' does not exist`);
  agentCount++;
}
console.log(`  -> ${agentCount} agents`);

console.log('Commands:');
const cmdDir = join(PLUGIN, 'commands');
let cmdCount = 0;
if (existsSync(cmdDir)) for (const f of readdirSync(cmdDir)) {
  if (!f.endsWith('.md')) continue;
  const fm = frontmatter(join(cmdDir, f));
  if (!fm) { err(`commands/${f}: no frontmatter`); continue; }
  if (!fm.description) err(`commands/${f}: missing description`);
  cmdCount++;
}
console.log(`  -> ${cmdCount} commands`);

console.log('Path refs (${CLAUDE_PLUGIN_ROOT}/...):');
function walkMd(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walkMd(p));
    else if (e.name.endsWith('.md')) out.push(p);
  }
  return out;
}
let refs = 0;
for (const file of walkMd(PLUGIN)) {
  const t = readFileSync(file, 'utf8');
  const re = /\$\{CLAUDE_PLUGIN_ROOT\}\/([A-Za-z0-9._/-]+\.(?:md|mjs|json|js|html))/g;
  let m;
  while ((m = re.exec(t))) {
    refs++;
    if (!existsSync(join(PLUGIN, m[1]))) err(`${file.slice(PLUGIN.length + 1)}: dangling ref \${CLAUDE_PLUGIN_ROOT}/${m[1]}`);
  }
}
console.log(`  -> ${refs} path refs checked`);

console.log(`\n${errors ? '✗' : '✓'} ${errors} errors, ${warns} warnings`);
process.exit(errors ? 1 : 0);
