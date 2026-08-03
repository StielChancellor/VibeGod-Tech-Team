// PreToolUse(Edit|Write|MultiEdit): block hardcoded secrets; warn on injection sinks. OWASP A02/A03/A07.
import { readStdin, hardBlock, advise } from './_lib.mjs';
import { FIXTURE_PATH, placeholder, scanSecrets } from './_secrets.mjs';

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

// A dotenv file is the one place a real secret is SUPPOSED to live (and is normally gitignored), so a
// bare `KEY=value` there stays advisory — hard-blocking it would block the correct thing to do. The
// quoted form still blocks everywhere, `envGen` below keeps warning, and guard-commit is what stops a
// dotenv secret actually reaching a commit.
const isDotenv = /(?:^|[\\/])\.env(?:\.[\w-]+)?$/i.test(file);
const found = scanSecrets(text, { bareAssignments: !isDotenv });

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
