// Shared helpers for VibeGod Tech Team guardrail hooks. Cross-platform (Node, no deps).
import process from 'node:process';

export async function readStdin() {
  try {
    const chunks = [];
    for await (const c of process.stdin) chunks.push(c);
    const s = Buffer.concat(chunks).toString('utf8').trim();
    return s ? JSON.parse(s) : {};
  } catch { return {}; }
}

export const isAdvisory = () =>
  (process.env.VIBEGOD_GUARDRAILS || '').toLowerCase() === 'advisory';

function emit(event, fields) {
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: event, ...fields } }));
}

// Hard block (exit 2 + stderr) unless advisory mode, where it downgrades to a warning.
export function hardBlock(event, reason) {
  if (isAdvisory()) { emit(event, { additionalContext: '[VIBEGOD advisory — would BLOCK] ' + reason }); process.exit(0); }
  process.stderr.write(reason + '\n');
  process.exit(2);
}

// Non-blocking advisory injected as context.
export function advise(event, msg) { emit(event, { additionalContext: msg }); process.exit(0); }

// Apply an Edit / Write / MultiEdit tool_input to `text` exactly the way the TOOL itself would, so a
// hook validates the document that will really be written. The naive `text.replace(old, new)` diverges
// from reality in two ways, and both are exploitable by an agent that controls the tool call:
//   - `replace_all: true` rewrites EVERY occurrence, but String.replace(str, str) rewrites only the
//     FIRST. Plant a decoy copy of old_string earlier in the file and the simulated edit lands on the
//     decoy — the real mutation (raised budget, edited frozen GOAL) never appears in what the hook checks.
//   - `$&`, `$1`, `` $` `` and `$'` are special in a STRING replacement, but the tool writes them
//     literally. Expanding them validates a document that never exists. A replacer FUNCTION is literal.
// Returns null when the input shape is unrecognized — callers fail open on null, per the house rule.
export function applyToolEdit(text, ti) {
  if (typeof ti?.content === 'string') return ti.content;                       // Write (whole-file overwrite)
  const apply = (s, oldS, newS, all) =>
    (typeof oldS !== 'string' || typeof newS !== 'string') ? s
      : all ? s.split(oldS).join(newS) : s.replace(oldS, () => newS);
  if (typeof ti?.new_string === 'string') return apply(text, ti.old_string, ti.new_string, !!ti.replace_all);
  if (Array.isArray(ti?.edits)) {
    let out = text;
    for (const e of ti.edits) if (e) out = apply(out, e.old_string, e.new_string, !!e.replace_all);
    return out;
  }
  return null;
}

// Extract a `## <NAME>` section from a state file: the heading up to (not including) the next `## `
// section or EOF. FENCE-AWARE — a `## `-prefixed line inside a fenced code block (a proof snippet,
// example output) is body text, not a section boundary. Without this, fenced text can truncate the
// block early and silently drop everything after it out of whatever check is scanning the block.
// Shared by guard-state (frozen GOAL), reinforce-goal (re-injection) and guard-autopilot (brake).
export function sectionBlock(text, name) {
  const lines = String(text ?? '').split(/\r?\n/);
  const heading = new RegExp('^##\\s+' + name + '\\b', 'i');
  const start = lines.findIndex((l) => heading.test(l));
  if (start === -1) return null;
  let end = lines.length, inFence = false;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^```/.test(lines[i].trim())) { inFence = !inFence; continue; }
    if (!inFence && /^##\s/.test(lines[i])) { end = i; break; }
  }
  return lines.slice(start, end).join('\n').trimEnd();
}
