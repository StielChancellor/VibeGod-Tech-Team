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
