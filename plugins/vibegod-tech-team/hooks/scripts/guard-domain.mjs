// PreToolUse(Edit|Write|MultiEdit|NotebookEdit): the UNDECLARED SENSITIVE DOMAIN trigger.
//
// The envelope asks the user, in plain language, whether the product handles payments, personal data,
// health data or user logins. Anything they DECLARE is worked on under its constraints and never
// interrupts again. Anything they did NOT declare stops the run the moment the work reaches it — because
// a build wandering into payments or PII without the user knowing is the failure that costs them money
// or a breach, and it is precisely the decision a visionary can make and an agent should not make alone.
//
// This is a PAUSE, not a verdict: declaring the domain in `## ENVELOPE` unblocks it permanently.
//
// DESIGN NOTE — noise is the whole risk here. A keyword scan for "email" or "user" would fire on half a
// codebase and be disabled within a day, which is worse than not shipping it. So it fires only on strong
// signals: a path that names the domain, a real SDK/library import, or a SCHEMA declaring several PII
// fields together. One stray mention of `email` in a comment does not trip it.
//
// BEST-EFFORT, fail-open: no state file, no `## ENVELOPE`, or no `Sensitive domains:` line => allow.
import { readStdin, hardBlock, sectionBlock } from './_lib.mjs';
import { readFileSync, existsSync, realpathSync } from 'node:fs';
import { join, sep } from 'node:path';

process.on('uncaughtException', () => process.exit(0));
process.on('unhandledRejection', () => process.exit(0));

const inp = await readStdin();
const ti = inp?.tool_input ?? {};

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
let statePath;
try {
  statePath = join(root, 'VIBEGOD-STATE.md');
  if (!existsSync(statePath)) process.exit(0);
  if (!realpathSync(statePath).startsWith(realpathSync(root) + sep)) process.exit(0);
} catch { process.exit(0); }

let onDisk;
try { onDisk = readFileSync(statePath, 'utf8'); } catch { process.exit(0); }

const env = sectionBlock(onDisk, 'ENVELOPE');
const declLine = (env || '').match(/^Sensitive domains:\s*(.*)$/im);
if (!declLine || /[<>]/.test(declLine[1])) process.exit(0);   // not agreed yet => nothing to enforce
const declared = declLine[1].toLowerCase();

// Editing the state file itself is how a domain gets DECLARED — never block that, or the trigger would
// prevent the only action that resolves it.
const file = String(ti.file_path ?? '');
if (file.split(/[\\/]/).pop() === 'VIBEGOD-STATE.md') process.exit(0);

const text = [ti.content, ti.new_string, ti.new_source,
  ...(Array.isArray(ti.edits) ? ti.edits.map((e) => e?.new_string) : [])]
  .filter((s) => typeof s === 'string').join('\n');
if (!text.trim()) process.exit(0);

const path = file.toLowerCase();
// Two independent signal classes per domain: the PATH names it, or the CONTENT imports a real library
// for it. `fields` domains additionally need SEVERAL PII columns together, which is what distinguishes a
// schema that stores personal data from a file that merely mentions a person.
const DOMAINS = [
  { name: 'payments', declared: /payment|billing|card|stripe|paypal|checkout/,
    path: /(?:^|[\/_-])(?:payment|billing|checkout|invoice|subscription|stripe|paypal)/,
    content: /\b(?:require\(['"]stripe|from ['"]stripe|import Stripe|@stripe\/|paypal-rest-sdk|braintree)\b/i },
  { name: 'user logins', declared: /login|auth|sign[- ]?in|session|account/,
    path: /(?:^|[\/_-])(?:auth[-_\/.]|authn|authz|authenticat|authoriz|login|signin|sign-in|signup|session|oauth|jwt)/,
    content: /\b(?:bcrypt|argon2|scrypt\b|jsonwebtoken|next-auth|passport\.authenticate|createSession)\b/i },
  { name: 'health data', declared: /health|medical|phi|hipaa|patient/,
    path: /(?:^|[\/_-])(?:patient|medical|clinical|health(?!check|z|-check|_check))/,
    fields: /\b(?:diagnosis|medication|nhs[_-]?number|patient[_-]?id|medical[_-]?record|allerg(?:y|ies))\b/gi },
  { name: 'personal data', declared: /personal|pii|gdpr|customer data|user data/,
    path: /(?:^|[\/_-])(?:pii|gdpr|personal)/,
    fields: /\b(?:date[_-]?of[_-]?birth|\bdob\b|national[_-]?insurance|social[_-]?security|\bssn\b|passport[_-]?number|home[_-]?address|postcode|phone[_-]?number|email[_-]?address)\b/gi },
];

for (const d of DOMAINS) {
  if (d.declared.test(declared)) continue;                       // user already agreed to this domain
  let hit = null;
  if (d.path?.test(path)) hit = `the path \`${file}\` names it`;
  else if (d.content?.test(text)) hit = 'the change imports a library for it';
  else if (d.fields) {
    const found = [...new Set((text.match(d.fields) || []).map((s) => s.toLowerCase()))];
    if (found.length >= 2) hit = `the change declares ${found.slice(0, 4).join(', ')} together`;
  }
  if (!hit) continue;
  hardBlock('PreToolUse',
    `UNDECLARED SENSITIVE DOMAIN — this change reaches **${d.name}**, which the envelope did not declare.\n` +
    `Signal: ${hit}.\n\n` +
    `Declared at kickoff: ${declLine[1].trim()}\n\n` +
    `Stop and ask — do not decide this for the user. Handling ${d.name} changes what the product must do\n` +
    `(and may change its legal obligations), so it is their call, not yours. If they confirm it is in\n` +
    `scope, add it to \`Sensitive domains:\` in \`## ENVELOPE\` and continue under its constraints. If it\n` +
    `is not, find an approach that avoids it.`);
}

process.exit(0);
