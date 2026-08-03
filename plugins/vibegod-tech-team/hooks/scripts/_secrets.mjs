// Shared credential detection — imported by guard-write (blocks a secret being WRITTEN into a file)
// and guard-commit (blocks a secret being COMMITTED). One list, so the two can never drift; the same
// reason `sectionBlock`/`applyToolEdit` live in _lib.mjs.
//
// The two callers deliberately differ on ONE point, and it is the whole reason the commit guard exists:
// a bare `KEY=value` in a `.env` is FINE to write (a dotenv file is exactly where a real secret belongs,
// which is why guard-write only warns) but is NOT fine to commit. Callers pass `bareAssignments` to
// choose. Everything else is identical.

// Test fixtures, examples and docs legitimately carry realistic-looking credentials — a throwaway JWT
// signing key, a sample token in an auth guide. Those secrets are not real.
export const FIXTURE_PATH = /(?:^|[\\/])(?:tests?|spec|__tests__|__mocks__|fixtures?|examples?|samples?|docs?)[\\/]|\.(?:md|mdx)$|(?:^|[\\/])[^\\/]*\.(?:test|spec)\.[a-z]+$/i;

export const placeholder = (v) =>
  /(?:example|placeholder|your[_-]?(?:api|key|token|secret|password)|changeme|dummy|sample|redacted|xxxx|<[^>]*>|\$\{[^}]*\})/i.test(v) ||
  // Prefix forms are how fixtures are actually written (`test-key-...`, `fake_token_...`).
  /^(?:test|fake|sample|dummy|demo|example|my|foo|bar)[-_]/i.test(v) ||
  // A UUID is a shape, not a credential — common as a fixture client_secret.
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v) ||
  // Anchored, NOT substring: as a substring these dismissed genuine values that merely contained
  // an ellipsis or a run of zeros (`S3cr3t...P4ssw0rd99` was treated as a placeholder).
  /^(?:x{3,}|none|null|test|fake|todo|\.{3,}|0{6,})$/i.test(v);

export const SECRET_PATTERNS = [
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
  // default OpenAI (`sk-proj-`) and Anthropic (`sk-ant-api03-`) formats both sailed straight through.
  [/\bsk-(?:proj|svcacct|admin)-[A-Za-z0-9_-]{20,}/, 'OpenAI project/service key (sk-proj-/sk-svcacct-)'],
  [/\bsk-ant-(?:api\d+|admin\d*)-[A-Za-z0-9_-]{20,}/, 'Anthropic API key (sk-ant-)'],
  [/\beyJ[A-Za-z0-9_-]{8,}\.eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/, 'JWT (signed token)'],
  [/\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|redis|amqp|rediss):\/\/[^\s:@/]+:[^\s:@/]{6,}@/, 'Database URL with inline password'],
  [/\bAccountKey=[A-Za-z0-9+/=]{40,}/, 'Azure storage account key'],
  [/hooks\.slack\.com\/services\/T[A-Za-z0-9]+\/B[A-Za-z0-9]+\/[A-Za-z0-9]{20,}/, 'Slack incoming-webhook URL'],
  [/\bAuthorization:\s*Basic\s+[A-Za-z0-9+/=]{16,}/i, 'HTTP Basic auth credential'],
  [/-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP |ENCRYPTED )?PRIVATE KEY-----/, 'Private key block'],
];

// The key may itself be quoted (JSON/YAML) and the value may be bare. Requiring `key<sep>"value"` with
// nothing between key and separator meant `{"api_key": "..."}` never matched — because in JSON the
// closing quote sits before the colon, and config.json is the single most common place a secret lands.
// Built fresh per call: a /g regex carries lastIndex between uses and would skip matches.
const genericRule = () =>
  /["'`]?\b(?:api[_-]?key|secret|token|passwd|password|client[_-]?secret|access[_-]?key|private[_-]?key|auth[_-]?token)\b["'`]?\s*[:=]\s*(?:["'`]([A-Za-z0-9_\-\/+=.]{16,})["'`]|([A-Za-z0-9_\-\/+=.]{16,})(?=[\s,;}\]#]|$))/gi;

// Scan text for credentials. `bareAssignments: false` ignores unquoted KEY=value forms (guard-write
// uses this for dotenv files, where writing a secret is the correct thing to do).
export function scanSecrets(text, { bareAssignments = true } = {}) {
  const found = new Set();
  const s = String(text ?? '');
  if (!s.trim()) return found;
  for (const [re, name] of SECRET_PATTERNS) {
    const m = s.match(re);
    if (m && !placeholder(m[0])) found.add(name);
  }
  const gen = genericRule();
  let mm;
  while ((mm = gen.exec(s))) {
    const quoted = mm[1] !== undefined;
    const v = mm[1] ?? mm[2];
    if (!quoted && !bareAssignments) continue;
    if (v && !placeholder(v) && /[A-Za-z]/.test(v) && /[0-9]/.test(v)) {
      found.add('Hardcoded credential assignment');
      break;
    }
  }
  return found;
}
