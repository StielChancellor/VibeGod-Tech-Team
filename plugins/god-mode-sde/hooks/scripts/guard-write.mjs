// PreToolUse(Edit|Write|MultiEdit): block hardcoded secrets; warn on injection sinks. OWASP A02/A03/A07.
import { readStdin, hardBlock, advise } from './_lib.mjs';

const inp = await readStdin();
const ti = inp?.tool_input ?? {};
let text = '';
if (typeof ti.content === 'string') text += ti.content + '\n';
if (typeof ti.new_string === 'string') text += ti.new_string + '\n';
if (Array.isArray(ti.edits)) for (const e of ti.edits) if (e && typeof e.new_string === 'string') text += e.new_string + '\n';
const file = String(ti.file_path ?? '');
if (!text.trim()) process.exit(0);

const placeholder = (v) =>
  /(?:example|placeholder|your[_-]?(?:api|key|token|secret|password)|changeme|dummy|sample|redacted|xxxx|<[^>]*>|\$\{[^}]*\}|\.\.\.|0{6,})/i.test(v) ||
  /^(?:x{3,}|none|null|test|fake|todo)$/i.test(v);

const secrets = [
  [/\bAKIA[0-9A-Z]{16}\b/, 'AWS access key ID'],
  [/\bASIA[0-9A-Z]{16}\b/, 'AWS temporary access key ID'],
  [/\bghp_[A-Za-z0-9]{36}\b/, 'GitHub personal access token'],
  [/\bgho_[A-Za-z0-9]{36}\b/, 'GitHub OAuth token'],
  [/\bgithub_pat_[A-Za-z0-9_]{40,}\b/, 'GitHub fine-grained PAT'],
  [/\bglpat-[A-Za-z0-9_-]{20,}\b/, 'GitLab personal access token'],
  [/\bAIza[0-9A-Za-z_-]{35}\b/, 'Google API key'],
  [/\bxox[baprs]-[A-Za-z0-9-]{10,}\b/, 'Slack token'],
  [/\b(?:sk|rk)_(?:live|prod)_[0-9a-zA-Z]{20,}\b/, 'Stripe live/prod secret key'],
  [/\bSG\.[\w-]{22}\.[\w-]{43}\b/, 'SendGrid API key'],
  [/\bnpm_[A-Za-z0-9]{36}\b/, 'npm access token'],
  [/\bsk-[A-Za-z0-9]{32,}\b/, 'OpenAI-style secret key'],
  [/-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----/, 'Private key block'],
];

const found = new Set();
for (const [re, name] of secrets) { const m = text.match(re); if (m && !placeholder(m[0])) found.add(name); }

// generic high-entropy credential assignment (mixed letters+digits, not a placeholder)
const gen = /(?:api[_-]?key|secret|token|passwd|password|client[_-]?secret|access[_-]?key|private[_-]?key|auth[_-]?token)\s*[:=]\s*["'`]([A-Za-z0-9_\-\/+=.]{16,})["'`]/gi;
let mm;
while ((mm = gen.exec(text))) {
  const v = mm[1];
  if (!placeholder(v) && /[A-Za-z]/.test(v) && /[0-9]/.test(v)) { found.add('Hardcoded credential assignment'); break; }
}

if (found.size)
  hardBlock('PreToolUse', `God-Mode SDE blocked a write: hardcoded secret(s) in ${file || 'this change'}:\n- ${[...found].join('\n- ')}\n\nMove secrets to environment variables or a secret manager (OWASP A02/A07). Set GODMODE_GUARDRAILS=advisory to override.`);

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
if (warns.size)
  advise('PreToolUse', `[GODMODE security advisory] Potential injection sink(s) in ${file || 'this change'}: ${[...warns].join(', ')}. Validate input & encode output at boundaries; use parameterized queries; avoid dynamic code execution (OWASP A03). Confirm this path is safe.`);

process.exit(0);
