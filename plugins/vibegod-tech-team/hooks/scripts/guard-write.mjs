// PreToolUse(Edit|Write|MultiEdit): block hardcoded secrets; warn on injection sinks. OWASP A02/A03/A07.
import { readStdin, hardBlock, advise } from './_lib.mjs';

// Fail OPEN on any unexpected error — never block a legitimate write because the heuristic threw.
process.on('uncaughtException', () => process.exit(0));
process.on('unhandledRejection', () => process.exit(0));

const inp = await readStdin();
const ti = inp?.tool_input ?? {};
let text = '';
if (typeof ti.content === 'string') text += ti.content + '\n';
if (typeof ti.new_string === 'string') text += ti.new_string + '\n';
if (Array.isArray(ti.edits)) for (const e of ti.edits) if (e && typeof e.new_string === 'string') text += e.new_string + '\n';
const file = String(ti.file_path ?? '');
if (!text.trim()) process.exit(0);

// Test fixtures, examples and docs legitimately carry realistic-looking credentials — a throwaway JWT
// signing key, a sample token in an auth guide. Those secrets are not real, so hard-blocking them is
// pure friction (it even made the repo unable to edit guard-write's OWN test file). Warn there instead;
// keep the hard block for real source and config paths.
const FIXTURE_PATH = /(?:^|[\\/])(?:tests?|spec|__tests__|__mocks__|fixtures?|examples?|samples?|docs?)[\\/]|\.(?:md|mdx)$|(?:^|[\\/])[^\\/]*\.(?:test|spec)\.[a-z]+$/i;

const placeholder = (v) =>
  /(?:example|placeholder|your[_-]?(?:api|key|token|secret|password)|changeme|dummy|sample|redacted|xxxx|<[^>]*>|\$\{[^}]*\})/i.test(v) ||
  // Prefix forms are how fixtures are actually written (`test-key-...`, `fake_token_...`).
  /^(?:test|fake|sample|dummy|demo|example|my|foo|bar)[-_]/i.test(v) ||
  // A UUID is a shape, not a credential — common as a fixture client_secret.
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v) ||
  // Anchored, NOT substring: as a substring these dismissed genuine values that merely contained
  // an ellipsis or a run of zeros (`S3cr3t...P4ssw0rd99` was treated as a placeholder).
  /^(?:x{3,}|none|null|test|fake|todo|\.{3,}|0{6,})$/i.test(v);

const secrets = [
  [/\bAKIA[0-9A-Z]{16}\b/, 'AWS access key ID'],
  [/\bASIA[0-9A-Z]{16}\b/, 'AWS temporary access key ID'],
  [/\bgh[psuor]_[A-Za-z0-9]{36}\b/, 'GitHub token (ghp_/gho_/ghs_/ghu_/ghr_)'],
  [/\bgithub_pat_[A-Za-z0-9_]{40,}\b/, 'GitHub fine-grained PAT'],
  [/\bglpat-[A-Za-z0-9_-]{20,}\b/, 'GitLab personal access token'],
  [/\bAIza[0-9A-Za-z_-]{35}\b/, 'Google API key'],
  [/\bxox[baprs]-[A-Za-z0-9-]{10,}\b/, 'Slack token'],
  [/\b(?:sk|rk)_(?:live|prod)_[0-9a-zA-Z]{20,}\b/, 'Stripe live/prod secret key'],
  [/\bSG\.[\w-]{22}\.[\w-]{43}\b/, 'SendGrid API key'],
  [/\bnpm_[A-Za-z0-9]{36}\b/, 'npm access token'],
  // The legacy one-segment form only. `(?<![\w.#-])` keeps it off hashed CSS-module class names and
  // minified identifiers like `.sk-circle1234...`, which it used to block.
  [/(?<![\w.#-])sk-[A-Za-z0-9]{32,}(?![\w-])/, 'OpenAI-style secret key'],
  // Modern segmented keys: the hyphen after `sk-` ended the legacy pattern after 4 chars, so today's
  // default OpenAI (`sk-proj-`) and Anthropic (`sk-ant-api03-`) formats both sailed straight through —
  // an Anthropic key being the one credential this repo is least able to afford leaking.
  [/\bsk-(?:proj|svcacct|admin)-[A-Za-z0-9_-]{20,}/, 'OpenAI project/service key (sk-proj-/sk-svcacct-)'],
  [/\bsk-ant-(?:api\d+|admin\d*)-[A-Za-z0-9_-]{20,}/, 'Anthropic API key (sk-ant-)'],
  [/\beyJ[A-Za-z0-9_-]{8,}\.eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/, 'JWT (signed token)'],
  [/\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|redis|amqp|rediss):\/\/[^\s:@/]+:[^\s:@/]{6,}@/, 'Database URL with inline password'],
  [/\bAccountKey=[A-Za-z0-9+/=]{40,}/, 'Azure storage account key'],
  [/hooks\.slack\.com\/services\/T[A-Za-z0-9]+\/B[A-Za-z0-9]+\/[A-Za-z0-9]{20,}/, 'Slack incoming-webhook URL'],
  [/\bAuthorization:\s*Basic\s+[A-Za-z0-9+/=]{16,}/i, 'HTTP Basic auth credential'],
  [/-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP |ENCRYPTED )?PRIVATE KEY-----/, 'Private key block'],
];

const found = new Set();
for (const [re, name] of secrets) { const m = text.match(re); if (m && !placeholder(m[0])) found.add(name); }

// generic high-entropy credential assignment (mixed letters+digits, not a placeholder)
// The key may itself be quoted (JSON/YAML) and the value may be bare. Requiring `key<sep>"value"` with
// nothing between key and separator meant `{"api_key": "..."}` never matched — because in JSON the
// closing quote sits before the colon. config.json / appsettings.json is the single most common place a
// real secret lands, so that blind spot mattered more than everything the rule did catch.
const gen = /["'`]?\b(?:api[_-]?key|secret|token|passwd|password|client[_-]?secret|access[_-]?key|private[_-]?key|auth[_-]?token)\b["'`]?\s*[:=]\s*(?:["'`]([A-Za-z0-9_\-\/+=.]{16,})["'`]|([A-Za-z0-9_\-\/+=.]{16,})(?=[\s,;}\]#]|$))/gi;
// A dotenv file is the one place a real secret is SUPPOSED to live (and is normally gitignored), so the
// bare `KEY=value` form stays advisory there — hard-blocking it would block the correct thing to do.
// The quoted form still blocks everywhere, and `envGen` below keeps warning. Elsewhere (config.json,
// app.yml, CI workflows) a bare assignment is a genuine leak and now blocks.
const isDotenv = /(?:^|[\\/])\.env(?:\.[\w-]+)?$/i.test(file);
let mm;
while ((mm = gen.exec(text))) {
  const v = mm[1] ?? mm[2];
  if (isDotenv && mm[1] === undefined) continue;   // bare value in .env => advisory only
  if (v && !placeholder(v) && /[A-Za-z]/.test(v) && /[0-9]/.test(v)) { found.add('Hardcoded credential assignment'); break; }
}

const secretMsg = `hardcoded secret(s) in ${file || 'this change'}:\n- ${[...found].join('\n- ')}`;
if (found.size && !FIXTURE_PATH.test(file))
  hardBlock('PreToolUse', `VibeGod Tech Team blocked a write: ${secretMsg}\n\nMove secrets to environment variables or a secret manager (OWASP A02/A07). Set VIBEGOD_GUARDRAILS=advisory to override.`);

// injection sinks — non-blocking advisory (OWASP A03)
const sinks = [
  [/\beval\s*\(/, 'eval()'],
  [/\bnew\s+Function\s*\(/, 'new Function()'],
  [/child_process[\s\S]{0,60}\.(?:exec|execSync)\s*\(\s*[`'"][^`'"]*\$\{/, 'child_process.exec with string interpolation'],
  [/\bos\.system\s*\(/, 'os.system()'],
  [/subprocess\.(?:run|call|Popen)\([^)]*shell\s*=\s*True/, 'subprocess(shell=True)'],
  [/(?:execute|query|raw)\s*\(\s*[`'"][^`'"]*(?:SELECT|INSERT|UPDATE|DELETE)[\s\S]*?["'`]\s*\+/i, 'SQL built by string concatenation'],
  [/(?:execute|query|raw)\s*\(\s*f["'][^"']*\{/, 'SQL built by f-string interpolation'],
  [/\.innerHTML\s*=\s*(?:[^;]*\$\{|\s*\w+\s*\+)/, 'innerHTML assignment from a variable (XSS)'],
  [/dangerouslySetInnerHTML/, 'dangerouslySetInnerHTML (XSS risk)'],
  [/\bpickle\.loads?\s*\(/, 'pickle.load(s) on possibly-untrusted data'],
  [/\byaml\.load\s*\((?![^)]*Loader\s*=\s*yaml\.SafeLoader)/, 'yaml.load without SafeLoader'],
];
const warns = new Set();
for (const [re, name] of sinks) if (re.test(text)) warns.add(name);

// unquoted env-style credential assignment (KEY=value, e.g. .env files) — advisory only:
// unquoted matching has a higher false-positive rate than the quoted block above (OWASP A02/A07).
const envSecrets = new Set();
const envGen = /(?:^|\n)\s*(?:export\s+)?([A-Za-z][A-Za-z0-9_]*(?:KEY|SECRET|TOKEN|PASSWORD|PASSWD|CREDENTIAL|API[_-]?KEY)[A-Za-z0-9_]*)\s*=\s*([^\s"'`#]{16,})\s*(?:$|\r?\n|#)/gim;
let em;
while ((em = envGen.exec(text))) {
  const v = em[2];
  if (!placeholder(v) && /[A-Za-z]/.test(v) && /[0-9]/.test(v)) envSecrets.add(em[1]);
}

const notes = [];
// Reached only on a fixture/docs path (the hard block above returns otherwise) — still say it, because a
// REAL credential does sometimes get pasted into a test file, and silence would be the wrong lesson.
if (found.size) notes.push(`Looks like ${secretMsg.replace(/\n- /g, ', ').replace(/:\s*,/, ':')} — allowed because this is a test/fixture/docs path, but never commit a real credential here`);
if (warns.size) notes.push(`Potential injection sink(s): ${[...warns].join(', ')}`);
if (envSecrets.size) notes.push(`Possible unquoted secret(s) assigned to ${[...envSecrets].join(', ')} — move to a secret manager, don't commit`);
if (notes.length)
  advise('PreToolUse', `[VIBEGOD security advisory] ${file || 'this change'}: ${notes.join('. ')}. Validate input & encode output at boundaries; use parameterized queries; avoid dynamic code execution and hardcoded secrets (OWASP A02/A03/A07). Confirm this path is safe.`);

process.exit(0);
